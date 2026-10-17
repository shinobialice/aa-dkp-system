#!/usr/bin/env python3
"""Corvus PvP scanner v3 - Windows UI with one button «Сканировать рядом».

How it works (see README_RU.md):
  * passive capture starts with the program, on all adapters (Npcap);
  * every 0x00EF unit state (sent when a player enters view) is decoded into
    name + PvP honor + PvP kills; DD01/0x00AF movement keeps positions and the
    3-second presence heartbeat;
  * the button shows who is in view right now, nearest first.

Start it BEFORE your character enters the world (character select screen):
players that were already loaded before the capture started are only visible
as nameless objects until the server sends their unit state again
(re-enter the world, teleport, or walk out of range and back).

No packets are sent, no game memory is read, nothing is modified.
"""
from __future__ import annotations

import csv
import json
import os
import queue
import sys
import threading
import time
import tkinter as tk
from datetime import datetime, timedelta
from pathlib import Path
from tkinter import filedialog, messagebox, ttk

sys.path.insert(0, str(Path(__file__).resolve().parent))

from aa_capture import CaptureDecoder, messages_from_file
from aa_killcount import build_killcount, describe, list_snapshots, load_snapshot, save_snapshot, snapshot_from
from aa_tracker import PRESENT_S, WorldTracker

ROOT = Path(__file__).resolve().parent
# The installed program lives in Program Files (read-only): keep user data in
# %LOCALAPPDATA%\CorvusScanner.  Run from a plain folder, data stays next to it.
DATA = (Path(os.environ.get('LOCALAPPDATA') or Path.home()) / 'CorvusScanner'
        if getattr(sys, 'frozen', False) else ROOT)
CONFIG = DATA / 'corvus_scanner.json'
CAPTURES = DATA / 'captures'
SNAPSHOTS = DATA / 'snapshots'
ICON = ROOT / 'corvus.png'
DASH = '—'
COLUMNS = (('name', 'Ник', 170, 'w'), ('honor', 'PvP честь', 90, 'e'), ('kills', 'PvP убийства', 90, 'e'),
           ('class', 'Класс', 150, 'w'), ('guild_id', 'Гильдия ID', 75, 'e'), ('distance_m', 'Дист., м', 65, 'e'),
           ('presence', 'Статус', 80, 'w'), ('seen_ago_s', 'Сигнал, с назад', 100, 'e'),
           ('record_age_s', 'Анкета, с назад', 105, 'e'), ('pvp_status', 'Разбор', 120, 'w'))


def fmt(v):
    return DASH if v is None else str(v)


def load_config():
    try:
        return json.loads(CONFIG.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return {}


class Engine:
    """Capture -> decoder -> tracker, on a worker thread."""

    def __init__(self, me_name):
        self.tracker = WorldTracker(me_name)
        self.decoder = CaptureDecoder()
        self.q: queue.Queue = queue.Queue()
        self.writer = None
        self.capture = None
        self.errors = []
        self.last_game_wall = None
        self.adapters = []
        threading.Thread(target=self._work, daemon=True, name='decoder').start()

    def start_capture(self):
        from winraw_live import start_any_capture
        self.capture, self.adapters = start_any_capture(self.q.put, on_error=self.errors.append)

    def _work(self):
        while True:
            pkt = self.q.get()
            try:
                w = self.writer
                if w is not None:
                    w.write(pkt)
                msgs = self.decoder.add_packet(pkt)
                if msgs:
                    self.last_game_wall = time.time()
                for m in msgs:
                    self.tracker.feed(m)
            except Exception as e:  # keep capturing; show the problem in the status line
                self.errors.append(f'декодер: {type(e).__name__}: {e}')

    def set_recording(self, on: bool):
        if on and self.writer is None:
            from npcap_live import PcapWriter
            self.writer = PcapWriter(CAPTURES / datetime.now().strftime('corvus_%Y%m%d_%H%M%S.pcap'))
        elif not on and self.writer is not None:
            w, self.writer = self.writer, None
            w.close()
            return w.path
        return None

    def stop(self):
        if self.capture:
            self.capture.stop()
        self.set_recording(False)


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title('Corvus PvP — сканер рядом v3')
        if ICON.is_file():
            self._icon = tk.PhotoImage(file=str(ICON))
            self.iconphoto(True, self._icon)
        self.geometry('1150x600')
        self.minsize(820, 420)
        cfg = load_config()
        self.engine = Engine(cfg.get('me'))
        self.file_tracker = None
        self.rows = []

        top = ttk.Frame(self, padding=(10, 8))
        top.pack(fill='x')
        ttk.Label(top, text='Мой ник:').pack(side='left')
        self.me_var = tk.StringVar(value=cfg.get('me', ''))
        ttk.Entry(top, textvariable=self.me_var, width=18).pack(side='left', padx=(4, 12))
        ttk.Label(top, text='Радиус, м:').pack(side='left')
        self.radius_var = tk.StringVar(value=str(cfg.get('radius', '')))
        ttk.Spinbox(top, from_=0, to=500, increment=10, textvariable=self.radius_var, width=6).pack(side='left', padx=(4, 12))
        self.stale_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(top, text='показывать ушедших', variable=self.stale_var).pack(side='left', padx=(0, 12))
        self.rec_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(top, text='писать PCAP (эксперимент)', variable=self.rec_var,
                        command=self.toggle_record).pack(side='left')

        btns = ttk.Frame(self, padding=(10, 0))
        btns.pack(fill='x')
        style = ttk.Style(self)
        style.configure('Big.TButton', font=('Segoe UI', 11, 'bold'), padding=(16, 6))
        ttk.Button(btns, text='Сканировать рядом', style='Big.TButton', command=self.scan).pack(side='left')
        ttk.Button(btns, text='Сохранить CSV', command=self.save_csv).pack(side='left', padx=8)
        ttk.Button(btns, text='Открыть PCAP…', command=self.open_pcap).pack(side='left')
        ttk.Button(btns, text='Киллкаунт…', command=lambda: KillcountDialog(self)).pack(side='left', padx=8)

        self.status = tk.StringVar(value='Запуск захвата…')
        ttk.Label(self, textvariable=self.status, padding=(10, 6), wraplength=960).pack(fill='x')

        body = ttk.Frame(self, padding=(10, 0))
        body.pack(fill='both', expand=True)
        self.tree = ttk.Treeview(body, columns=[c[0] for c in COLUMNS], show='headings')
        for key, title, width, anchor in COLUMNS:
            self.tree.heading(key, text=title)
            self.tree.column(key, width=width, anchor=anchor)
        self.tree.tag_configure('me', background='#e8f1ff')
        self.tree.tag_configure('stale', foreground='#888888')
        sb = ttk.Scrollbar(body, orient='vertical', command=self.tree.yview)
        self.tree.configure(yscrollcommand=sb.set)
        self.tree.pack(side='left', fill='both', expand=True)
        sb.pack(side='right', fill='y')

        self.info = tk.StringVar(value='')
        ttk.Label(self, textvariable=self.info, padding=(10, 6), foreground='#555555',
                  wraplength=960).pack(fill='x')
        self.protocol('WM_DELETE_WINDOW', self.close)

        try:
            self.engine.start_capture()
        except Exception as e:  # missing Npcap etc. - offline mode still works
            self.status.set(f'Живой захват недоступен: {e}  Можно открыть PCAP-файл.')
        self.after(1000, self.tick)

    # ------------------------------------------------------------------ live status
    def tick(self):
        e = self.engine
        if e.capture:
            age = DASH if e.last_game_wall is None else f'{time.time() - e.last_game_wall:.0f} c назад'
            d = e.decoder.diagnostics()
            snap = e.tracker.snapshot(now=time.time())
            near = sum(r['presence'] == 'рядом' for r in snap['rows'])
            ages = [r['record_age_s'] for r in snap['rows'] if r['record_age_s'] is not None]
            last_card = f'{min(ages):.0f} c назад' if ages else DASH
            warn = ''
            if e.last_game_wall is None:
                warn = '  Игрового трафика пока нет: запусти игру/войди персонажем.'
            elif time.time() - e.last_game_wall > 10:
                warn = '  Нет игрового трафика >10 с — статусы «рядом» устаревают.'
            if e.errors:
                warn += '  Ошибка: ' + e.errors[-1]
            self.status.set(
                f"Захват: {len(e.adapters)} адаптер(ов), трафик игры: {', '.join(e.capture.active_adapters()) or DASH}; "
                f"последний игровой пакет: {age}; сообщений: {sum(v for k, v in d.items() if k.startswith('DD'))}; "
                f"анкет игроков: {snap['counts']['player_records']} (последняя {last_card}); рядом сейчас: {near}; "
                f"без анкеты рядом: {snap['unnamed_in_view']}.{warn}")
        self.after(1000, self.tick)

    def toggle_record(self):
        path = self.engine.set_recording(self.rec_var.get())
        if path:
            messagebox.showinfo('PCAP', f'Сохранено: {path}\nНе публикуй сырые PCAP.')

    # ------------------------------------------------------------------ scan
    def _radius(self):
        try:
            r = float(self.radius_var.get().replace(',', '.'))
            return r if r > 0 else None
        except ValueError:
            return None

    def _apply_me(self, tracker):
        me = self.me_var.get().strip() or None
        if me != tracker.me_name:
            with tracker.lock:
                tracker.me_name = me
                tracker.me_obj, tracker.me_how = None, ''
                for ent in tracker.entities.values():
                    if me and ent.name == me:
                        tracker.me_obj, tracker.me_how = ent.obj_id, 'по нику из настроек'
        DATA.mkdir(parents=True, exist_ok=True)
        CONFIG.write_text(json.dumps({'me': me or '', 'radius': self.radius_var.get()}, ensure_ascii=False),
                          encoding='utf-8')

    def scan(self, tracker=None, now=None, source='живой захват'):
        if tracker is None:
            tracker, now = self.engine.tracker, time.time()
        self._apply_me(tracker)
        snap = tracker.snapshot(now=now, radius_m=self._radius(), include_stale=self.stale_var.get())
        self.rows = snap['rows']
        self.tree.delete(*self.tree.get_children())
        for r in self.rows:
            vals = []
            for key, *_ in COLUMNS:
                v = r[key]
                if key == 'name':
                    v = v + ('  (я)' if r['is_me'] else '') + ('  *статы менялись' if r['stats_changed'] else '')
                vals.append(fmt(v))
            tags = ('me',) if r['is_me'] else ('stale',) if r['presence'] != 'рядом' else ()
            self.tree.insert('', 'end', values=vals, tags=tags)
        near = sum(r['presence'] == 'рядом' and not r['is_me'] for r in self.rows)
        me = DASH if snap['me_obj'] is None else f"obj {snap['me_obj']} ({snap['me_how']})"
        hint = ''
        if snap['unnamed_in_view']:
            hint = (f"  {snap['unnamed_in_view']} объект(ов) рядом без анкеты — они были загружены до старта "
                    f"захвата (игроки или NPC). Чтобы получить их ники и PvP: перезайди в мир с экрана выбора "
                    f"персонажа или телепортируйся и вернись, не закрывая программу.")
        saved = ''
        if source == 'живой захват':
            doc = snapshot_from(tracker.snapshot(now=now), 'live')
            if doc['players']:
                path = save_snapshot(doc, SNAPSHOTS)
                saved = f"Снимок для киллкаунта: {path.name} ({len(doc['players'])} игроков). "
        self.info.set(f"[{datetime.now():%H:%M:%S}, {source}] {saved}Игроков рядом: {near}. Я: {me}. "
                      f"«Рядом» = сервер присылал координаты игрока за последние {PRESENT_S} с "
                      f"(он шлёт их каждые 3 с, даже если игрок стоит). «?» у класса — ветка не подтверждена. "
                      f"Неизвестные значения показаны как «{DASH}», "
                      f"не нулём.{hint}")

    def open_pcap(self):
        path = filedialog.askopenfilename(filetypes=[('Захват', '*.pcap *.pcapng'), ('Все файлы', '*.*')])
        if not path:
            return
        try:
            msgs, _ = messages_from_file(Path(path))
        except Exception as e:
            messagebox.showerror('PCAP', str(e))
            return
        tr = WorldTracker(self.me_var.get().strip() or None)
        for m in msgs:
            tr.feed(m)
        self.scan(tr, None, f'файл {Path(path).name}, снимок на конец файла')

    def save_csv(self):
        if not self.rows:
            messagebox.showinfo('CSV', 'Сначала нажми «Сканировать рядом».')
            return
        path = filedialog.asksaveasfilename(defaultextension='.csv', initialfile=f'corvus_{datetime.now():%Y%m%d_%H%M%S}.csv')
        if path:
            with open(path, 'w', encoding='utf-8-sig', newline='') as f:
                w = csv.DictWriter(f, fieldnames=list(self.rows[0]))
                w.writeheader()
                w.writerows(self.rows)

    def close(self):
        self.engine.stop()
        self.destroy()


class KillcountDialog(tk.Toplevel):
    """Pick the start and end snapshots, copy the site JSON to the clipboard."""

    def __init__(self, app: App):
        super().__init__(app)
        self.app = app
        self.title('Киллкаунт за прайм')
        self.geometry('960x540')
        self.paths = list_snapshots(SNAPSHOTS)
        if not self.paths:
            ttk.Label(self, padding=16, wraplength=700, text=(
                'Снимков пока нет. В начале и в конце прайма: зайди в локацию с запущенной программой и '
                'нажми «Сканировать рядом» — каждый скан сохраняется в папку snapshots.')).pack()
            return
        labels = [self._label(p) for p in self.paths]
        frm = ttk.Frame(self, padding=10)
        frm.pack(fill='x')
        ttk.Label(frm, text='Начало прайма:').grid(row=0, column=0, sticky='w')
        ttk.Label(frm, text='Конец прайма:').grid(row=1, column=0, sticky='w')
        # Default: the last snapshot is the end, the earliest one within 8 hours
        # before it is the start (works for a prime that crosses midnight).
        times = [self._taken(p) for p in self.paths]
        end_t = times[-1]
        first_today = next((i for i, t in enumerate(times)
                            if t and end_t and timedelta(0) <= end_t - t <= timedelta(hours=8)), 0)
        self.start = ttk.Combobox(frm, values=labels, state='readonly', width=80)
        self.end = ttk.Combobox(frm, values=labels, state='readonly', width=80)
        self.start.current(first_today)
        self.end.current(len(labels) - 1)
        self.start.grid(row=0, column=1, padx=6, pady=3)
        self.end.grid(row=1, column=1, padx=6, pady=3)
        self.guild_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(frm, text='только моя гильдия', variable=self.guild_var).grid(row=2, column=1, sticky='w')
        ttk.Button(frm, text='Посчитать и скопировать JSON для сайта', command=self.run).grid(
            row=3, column=1, sticky='w', pady=6)
        ttk.Button(frm, text='Открыть папку снимков', command=self.open_folder).grid(
            row=3, column=1, sticky='e', pady=6)
        self.out = tk.Text(self, wrap='word', height=20)
        self.out.pack(fill='both', expand=True, padx=10, pady=(0, 10))

    @staticmethod
    def open_folder():
        SNAPSHOTS.mkdir(parents=True, exist_ok=True)
        if hasattr(os, 'startfile'):
            os.startfile(str(SNAPSHOTS))

    @staticmethod
    def _taken(path: Path):
        try:
            return datetime.fromisoformat(load_snapshot(path)['taken_at'])
        except (OSError, ValueError, KeyError):
            return None

    @staticmethod
    def _label(path: Path) -> str:
        try:
            doc = load_snapshot(path)
        except (OSError, ValueError) as e:
            return f'{path.name} — не читается: {e}'
        me = (doc.get('me') or {}).get('name') or DASH
        when = datetime.fromisoformat(doc['taken_at']).strftime('%d.%m %H:%M:%S')
        return f"{when} — {len(doc['players'])} игроков, сканировал {me}  [{path.name}]"

    def run(self):
        try:
            start = load_snapshot(self.paths[self.start.current()])
            end = load_snapshot(self.paths[self.end.current()])
        except (OSError, ValueError) as e:
            messagebox.showerror('Киллкаунт', str(e), parent=self)
            return
        if self.start.current() == self.end.current():
            messagebox.showwarning('Киллкаунт', 'Выбран один и тот же снимок.', parent=self)
            return
        res = build_killcount(start, end, only_my_guild=self.guild_var.get())
        text = describe(res, start, end)
        if res.rows:
            data = res.site_json()
            self.clipboard_clear()
            self.clipboard_append(data)
            day = datetime.fromisoformat(end['taken_at']).strftime('%Y-%m-%d')
            path = SNAPSHOTS / f'killcount_{day}.json'
            path.write_text(data, encoding='utf-8')
            text += (f'\n\nJSON скопирован в буфер обмена и сохранён в {path.name}.\n'
                     f'На сайте: Киллкаунт → «Добавить вручную» → вставить в поле «Вставьте JSON» → «Сохранить».')
        else:
            text += '\n\nНекого добавлять в киллкаунт — JSON не создан (причины выше).'
        self.out.delete('1.0', 'end')
        self.out.insert('1.0', text)


def selftest() -> int:
    """Non-GUI check of a built program: decoder, class table, capture backends."""
    import zlib
    from aa_classes import CLASS_NAMES, class_info
    from aa_unitstate import encode_pisc, encode_pisc_list
    lines, ok = [], True
    lines.append(f'классов в таблице: {len(CLASS_NAMES)}')
    ok &= len(CLASS_NAMES) == 364 and class_info([2, 4, 10]).name is not None
    # A minimal synthetic unit state: header, filler, character tail.
    nb = 'Тест'.encode()
    rec = (b'\x00\x00\xef\x00' + (777).to_bytes(3, 'little') + len(nb).to_bytes(2, 'little') + nb
           + b'\x2a\x01\x00\x00' + (5).to_bytes(4, 'little') + bytes(14) + bytes(11)
           + b'\x00\x00\x80\x3f\x37\x01' + bytes(300) + bytes([3, 2]) + bytes(13)
           + encode_pisc_list([100, 200, 300]) + encode_pisc_list([5, 6]) + bytes([0, 0, 1, 0x13])
           + encode_pisc([0, 0, 0, 0]) + encode_pisc([101, 1085, 1]) + encode_pisc([1049037, 764, 0, 0])
           + b'\x00\x20\x00' + b''.join(b'\x00\x00\x00\x00' + bytes([o]) for o in
                                         [0xFF, 0, 0xFF, 1] + [0xFF] * 5 + [2] + [0xFF] * 19)
           + bytes([3, 2, 4, 10]))
    from aa_unitstate import parse_unit_states
    recs = parse_unit_states(rec)
    got = (recs[0].honor, recs[0].kills) if recs else None
    lines.append(f'разбор записи: {got}')
    ok &= got == (1049037, 764)
    zlib.compress(b'x')
    try:
        import importlib
        importlib.import_module('tkinter')   # the GUI toolkit must be bundled
        lines.append('tkinter: есть')
    except ImportError as e:
        ok = False
        lines.append(f'tkinter: нет ({e})')
    from winraw_live import available, local_ipv4
    lines.append(f'встроенный захват Windows: {available()}, адреса: {local_ipv4()}')
    try:
        from npcap_live import load_npcap
        load_npcap()
        lines.append('Npcap: установлен')
    except Exception as e:
        lines.append(f'Npcap: нет ({e})')
    lines.append('ИТОГ: ' + ('OK' if ok else 'ОШИБКА'))
    out = '\n'.join(lines)
    DATA.mkdir(parents=True, exist_ok=True)
    (DATA / 'selftest.txt').write_text(out + '\n', encoding='utf-8')
    if sys.stdout:
        print(out)
    return 0 if ok else 1


if __name__ == '__main__':
    if '--selftest' in sys.argv:
        sys.exit(selftest())
    App().mainloop()
