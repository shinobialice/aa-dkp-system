#!/usr/bin/env python3
"""Corvus PvP scanner v3 - offline command line.

  py -3 corvus_scan.py decode   CAPTURE [--csv out.csv] [--json out.json]
  py -3 corvus_scan.py verify   CAPTURE --truth truth.csv
  py -3 corvus_scan.py nearby   CAPTURE [--me НИК] [--radius 150] [--at SEC]
  py -3 corvus_scan.py discover CAPTURE            (experiment: who left / which message)
  py -3 corvus_scan.py capture  --seconds 300 --out exp.pcap   (Windows + Npcap, receive-only)

CAPTURE is .pcap or .pcapng (Npcap, Wireshark, `pktmon etl2pcap`).
Reports contain names and game values only - no IP addresses or raw payloads.
Unknown values are printed as '—', never as 0.
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from aa_capture import GAME_PORT, messages_from_file
from aa_classes import class_info
from aa_tracker import HEARTBEAT_S, PRESENT_S, WorldTracker
from aa_unitstate import UNITS_PER_METER, parse_movements, parse_unit_states, tail_dict

DASH = '—'


def fmt(v):
    return DASH if v is None else str(v)


def load(path, ports):
    msgs, diag = messages_from_file(Path(path), ports)
    if not msgs:
        raise SystemExit(f'В захвате нет игровых сообщений с порта {ports}. Проверь порт/файл.')
    return msgs, diag


def decoded_records(msgs):
    t0 = msgs[0].ts
    out = []
    for i, m in enumerate(msgs):
        if m.kind == 4 and m.status == 'ok':
            for r in parse_unit_states(m.payload):
                if r.name:
                    out.append((m.ts - t0, i, m.subpacket_count, r))
    return out


# --------------------------------------------------------------------------- decode

def describe(r) -> list:
    t = r.tail
    lines = [f"{r.name}  obj_id={r.obj_id} char_id?={fmt(r.char_id)} уровень={fmt(r.level)}"
             f"/{fmt(r.heir_level)}  статус={r.status}"]
    if r.has_values:
        cls = class_info(t.active_abilities)
        lines.append(f"    PvP честь={r.honor}  PvP убийства={r.kills}  класс={cls.label} ({' + '.join(cls.trees)})")
    else:
        lines.append(f"    PvP честь={DASH}  PvP убийства={DASH}  (не подставлено: {r.note or 'нет структуры'})")
    if t is not None:
        w = '+'.join(str(x) for x in t.pvp_widths)
        lines.append(f"    PISC флаг=0x{t.pvp_flag:02X} ширины={w} байт; доп.значения того же блока="
                     f"{t.pvp_extra} (смысл не установлен)")
        if t.unverified_width:
            lines.append('    ВНИМАНИЕ: код ширины 11 (4 байта) не встречался в образце - ширина не проверена')
        lines.append(f"    раса={t.race} фракция?={t.faction_id} гильдия?={t.expedition_id} семья?={t.family_id}"
                     f" блокA={t.block_a} флаги=0x{t.flags:04X} доп.7Б={t.ext.hex(' ') if t.ext else DASH}")
        lines.append(f"    навыков={len(t.skills)} пассивок={len(t.buffs)} отсортированы={t.lists_sorted}"
                     f" способности: активные={t.active_abilities} подтверждение="
                     f"{'да' if t.tail_confirmed else 'НЕТ: ' + t.tail_problem}"
                     + (f" (нестандартный зазор {t.gap})" if r.status == 'OK_RELAXED_GAP' else ''))
    if len(r.candidates) > 1:
        lines.append(f"    кандидатов={len(r.candidates)}: " + ', '.join(
            f"@{c.pvp_offset}:{c.pvp_honor}/{c.pvp_kills}{'' if c.tail_confirmed else '(непод.)'}"
            for c in r.candidates[:6]))
    return lines


def cmd_decode(a):
    msgs, diag = load(a.capture, a.port)
    recs = decoded_records(msgs)
    print('Corvus PvP decoder v3 - структурный разбор 0x00EF (без списков ников и известных чисел)')
    print('Сообщения: ' + ', '.join(f'{k}={v}' for k, v in sorted(diag.items())))
    print()
    for ts, i, sub, r in recs:
        print(f'[t={ts:6.2f}s сообщение #{i} DD04 подпакетов={sub}]')
        print('\n'.join(describe(r)))
        print()
    st = Counter(r.status for *_, r in recs)
    print('ИТОГ: записей персонажей=%d, ' % len(recs) + ', '.join(f'{k}={v}' for k, v in st.most_common()))
    rows = [{'name': r.name, 'obj_id': r.obj_id, 'char_id': r.char_id, 'status': r.status,
             'honor': r.honor, 'kills': r.kills, 'level': r.level, 'heir_level': r.heir_level,
             'guild_id': r.tail.expedition_id if r.has_values else None,
             'class': class_info(r.tail.active_abilities).label if r.has_values else None,
             'pvp_widths': '+'.join(map(str, r.tail.pvp_widths)) if r.tail else None,
             't': round(ts, 3), 'note': r.note} for ts, i, sub, r in recs]
    if a.csv:
        with open(a.csv, 'w', encoding='utf-8-sig', newline='') as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0]) if rows else ['name'])
            w.writeheader()
            w.writerows(rows)
        print('CSV:', Path(a.csv).resolve())
    if a.json:
        full = [dict(row, tail=tail_dict(r.tail)) for row, (*_, r) in zip(rows, recs)]
        Path(a.json).write_text(json.dumps(full, ensure_ascii=False, indent=1), encoding='utf-8')
        print('JSON:', Path(a.json).resolve())


# --------------------------------------------------------------------------- verify

def read_truth(path):
    truth = {}
    with open(path, encoding='utf-8-sig', newline='') as f:
        for row in csv.DictReader(f):
            row = {k.strip().lower(): (v or '').strip() for k, v in row.items() if k}
            if row.get('name'):
                truth[row['name']] = (int(row['honor']), int(row['kills']))
    return truth


def cmd_verify(a):
    msgs, _ = load(a.capture, a.port)
    truth = read_truth(a.truth)
    latest = {}
    for *_, r in decoded_records(msgs):
        latest[r.name] = r
    ok = 0
    print(f"{'Ник':16s} {'ожидалось':>18s} {'декодер':>18s}  результат")
    for name, (h, k) in truth.items():
        r = latest.get(name)
        if r is None:
            res, got = 'НЕТ ЗАПИСИ В ЗАХВАТЕ', DASH
        elif not r.has_values:
            res, got = f'НЕТ ЗНАЧЕНИЯ ({r.status})', DASH
        else:
            got = f'{r.honor}/{r.kills}'
            res = 'СОВПАДАЕТ' if (r.honor, r.kills) == (h, k) else 'РАСХОЖДЕНИЕ'
            ok += res == 'СОВПАДАЕТ'
        print(f'{name:16s} {f"{h}/{k}":>18s} {got:>18s}  {res}')
    extra = sorted(set(latest) - set(truth))
    for name in extra:
        r = latest[name]
        print(f'{name:16s} {"(нет эталона)":>18s} {fmt(r.honor) + "/" + fmt(r.kills):>18s}  {r.status}, не проверено')
    print(f'\nСовпало {ok} из {len(truth)}')
    return 0 if ok == len(truth) else 1


# --------------------------------------------------------------------------- nearby

def cmd_nearby(a):
    msgs, _ = load(a.capture, a.port)
    tr = WorldTracker(a.me)
    t0 = msgs[0].ts
    stop = None if a.at is None else t0 + a.at
    for m in msgs:
        if stop is not None and m.ts > stop:
            break
        tr.feed(m)
    snap = tr.snapshot(now=stop, radius_m=a.radius)
    print(f"Снимок на t={snap['now'] - t0:.1f}s; я: obj_id={fmt(snap['me_obj'])} ({snap['me_how'] or 'не определён'})")
    print(f"Сигнал = последнее сообщение сервера с координатами игрока (приходит каждые {HEARTBEAT_S:.0f} с,"
          f" даже если он стоит); 'рядом' = сигнал не старше {PRESENT_S} с;"
          f" расстояние ≈ единицы/{UNITS_PER_METER:.0f} (масштаб выведен, не официальный)")
    print(f"{'Ник':16s} {'честь':>9s} {'убийства':>8s} {'класс':22s} {'гильдия?':>8s} {'дист,м':>7s} {'статус':9s}"
          f" {'сигнал,с':>8s} PvP-статус")
    for r in snap['rows']:
        print(f"{r['name'] + (' (я)' if r['is_me'] else ''):16s} {fmt(r['honor']):>9s} {fmt(r['kills']):>8s} "
              f"{fmt(r['class']):22s} {fmt(r['guild_id']):>8s} {fmt(r['distance_m']):>7s} {r['presence']:9s}"
              f" {r['seen_ago_s']:>8} {r['pvp_status']}{' (статы менялись)' if r['stats_changed'] else ''}")
    print(f"\nОбъектов с сигналом, но без анкеты 0xEF (загружены до начала захвата; игроки или NPC): "
          f"{snap['unnamed_in_view']}")


# --------------------------------------------------------------------------- discover

def cmd_discover(a):
    """Experiment helper: departures (heartbeat stopped) and messages naming them."""
    msgs, _ = load(a.capture, a.port)
    t0, t_end = msgs[0].ts, msgs[-1].ts
    af, ef, names = defaultdict(list), defaultdict(list), {}
    for m in msgs:
        if m.status != 'ok':
            continue
        if m.kind == 1 and m.opcode == 0x00AF:
            mv, _ = parse_movements(m.payload)
            for x in mv or []:
                af[x.obj_id].append(m.ts)
        elif m.kind == 4:
            for r in parse_unit_states(m.payload):
                ef[r.obj_id].append(m.ts)
                if r.name:
                    names[r.obj_id] = r.name
    gap_limit = 3 * HEARTBEAT_S
    departures, stayers = [], []
    print(f'Захват {t_end - t0:.1f} с. Уход = AF-пульс прекратился > {gap_limit:.0f} с до конца или до нового 0xEF.')
    for oid, ts in af.items():
        if len(ts) < 2:
            continue
        gaps = [(b, c) for b, c in zip(ts, ts[1:]) if c - b > gap_limit]
        if t_end - ts[-1] > gap_limit:
            gaps.append((ts[-1], None))
        for last, back in gaps:
            departures.append((oid, last, back))
        if not gaps and ts[-1] - ts[0] > 4 * HEARTBEAT_S:
            stayers.append(oid)
    for oid, last, back in sorted(departures, key=lambda d: d[1]):
        respawn = [t for t in ef.get(oid, []) if back is None or t <= back + 1]
        print(f"  ушёл: {names.get(oid, '(без имени)'):16s} obj_id={oid} последний пульс t={last - t0:.1f}s "
              f"вернулся={'нет' if back is None else f't={back - t0:.1f}s'} новые 0xEF={len(respawn)}")
    if not departures:
        print('  Уходов не найдено: отойди дальше (>200 м) или телепортируйся, захват не прерывай.')
        return

    def hits(oid, lo, hi):
        """(key, context) for every non-movement message naming `oid` in [lo, hi]."""
        pat = oid.to_bytes(3, 'little')
        found = {}
        for m in msgs:
            if lo <= m.ts <= hi and m.status == 'ok' and not (m.kind == 1 and m.opcode == 0x00AF):
                p = m.payload.find(pat)
                while p >= 0:
                    if m.kind != 4:
                        key = f'DD{m.kind:02X}/0x{m.opcode:04X}'
                    elif p < 16:  # first sub-packet: its opcode is known
                        key = f'DD04 первый подпакет 0x{int.from_bytes(m.payload[2:4], "little"):04X}'
                    else:
                        key = 'DD04 внутри пачки'
                    found.setdefault(key, m.payload[max(0, p - 8):p + 6].hex(' '))
                    p = m.payload.find(pat, p + 1)
        return found

    dep_score, stay_score, examples = Counter(), Counter(), {}
    for oid, last, _ in departures:
        for key, ctx in hits(oid, last - 1.0, last + 2 * HEARTBEAT_S).items():
            dep_score[key] += 1
            examples.setdefault(key, ctx)
    for oid in stayers[:60]:
        for key in hits(oid, af[oid][0], af[oid][-1]):
            stay_score[key] += 1
    print('\nСообщения, упоминающие ушедший ID в окне [пульс-1с, пульс+6с] (кандидаты на «удаление юнита»):')
    print('  ключ | ушедших | у оставшихся (у настоящего пакета удаления ~0) | пример байтов вокруг ID')
    for key, n in dep_score.most_common(25):
        print(f'  {key} | {n} из {len(departures)} | {stay_score.get(key, 0)} из {len(stayers[:60])} | {examples[key]}')


def cmd_capture(a):
    from npcap_live import capture_to_file
    capture_to_file(Path(a.out), a.seconds, a.port[0])


class Tee:
    def __init__(self, *streams):
        self.streams = streams

    def write(self, s):
        for st in self.streams:
            st.write(s)

    def flush(self):
        for st in self.streams:
            st.flush()


def main(argv=None):
    p = argparse.ArgumentParser(description='Corvus PvP scanner v3 (offline, passive)')
    p.add_argument('--port', type=int, action='append', help=f'порт игрового сервера (по умолчанию {GAME_PORT})')
    p.add_argument('--report', help='дополнительно записать вывод в UTF-8 файл')
    sub = p.add_subparsers(dest='cmd', required=True)
    d = sub.add_parser('decode')
    d.add_argument('capture')
    d.add_argument('--csv')
    d.add_argument('--json')
    v = sub.add_parser('verify')
    v.add_argument('capture')
    v.add_argument('--truth', required=True, help='локальный CSV: name,honor,kills')
    n = sub.add_parser('nearby')
    n.add_argument('capture')
    n.add_argument('--me', help='ник своего персонажа (иначе авто по записи входа в мир)')
    n.add_argument('--radius', type=float)
    n.add_argument('--at', type=float, help='секунд от начала захвата (по умолчанию - конец)')
    x = sub.add_parser('discover')
    x.add_argument('capture')
    c = sub.add_parser('capture')
    c.add_argument('--seconds', type=float, default=300)
    c.add_argument('--out', default='captures/experiment.pcap')
    a = p.parse_args(argv)
    a.port = tuple(a.port or (GAME_PORT,))
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    if a.report:
        sys.stdout = Tee(sys.stdout, open(a.report, 'w', encoding='utf-8'))
    return {'decode': cmd_decode, 'verify': cmd_verify, 'nearby': cmd_nearby,
            'discover': cmd_discover, 'capture': cmd_capture}[a.cmd](a) or 0


if __name__ == '__main__':
    sys.exit(main())
