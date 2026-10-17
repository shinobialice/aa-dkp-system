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
import queue
import sys
import threading
import time
import tkinter as tk
from datetime import datetime
from pathlib import Path
from tkinter import filedialog, messagebox, ttk

sys.path.insert(0, str(Path(__file__).resolve().parent))

from aa_capture import CaptureDecoder, messages_from_file
from aa_tracker import PRESENT_S, WorldTracker

ROOT = Path(__file__).resolve().parent
CONFIG = ROOT / 'corvus_scanner.json'
CAPTURES = ROOT / 'captures'
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
        from npcap_live import LiveCapture
        self.capture = LiveCapture(self.q.put, on_error=self.errors.append)
        self.adapters = self.capture.start()

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
                f"анкет игроков: {snap['counts']['player_records']}; рядом сейчас: {near}; "
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
        self.info.set(f"[{datetime.now():%H:%M:%S}, {source}] Игроков рядом: {near}. Я: {me}. "
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


if __name__ == '__main__':
    App().mainloop()
