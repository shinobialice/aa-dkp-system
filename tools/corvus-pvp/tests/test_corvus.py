#!/usr/bin/env python3
"""Offline tests.  Run:  py -3 -m unittest discover -s tests -v

Synthetic tests always run.  Tests on a real capture run only when it is given
locally (captures and other players' data are not stored in the repository):

    $env:CORVUS_PCAP  = "C:\\ArcheAgePvP\\login_capture.pcap"
    $env:CORVUS_TRUTH = "C:\\ArcheAgePvP\\truth.local.csv"   # name,honor,kills (optional)
"""
from __future__ import annotations

import csv
import json
import os
import random
import struct
import sys
import tempfile
import unittest
import zlib
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(HERE))

from aa_capture import (CaptureDecoder, RawPacket, _checksum, _xor_dd05, messages_from_file,
                        read_capture)
from aa_classes import ABILITY_TREES, CLASS_NAMES, class_info
from aa_killcount import build_killcount, load_snapshot, save_snapshot, snapshot_from
from aa_tracker import WorldTracker
from aa_unitstate import (ABILITY_SLOTS, PiscError, encode_pisc, encode_pisc_list,
                          find_confirmed_tails, parse_movements, parse_unit_states, read_pisc,
                          read_pisc_list)


# --------------------------------------------------------------------------- builders

def player_record(obj_id, name, honor, kills, extra=(0, 0), flags=0x2000, ext=None, seed=1,
                  race_gender=0x13, active=(2, 4, 10), guild=1085, x=5_700_000, y=6_200_000):
    rnd = random.Random(seed)
    nb = name.encode('utf-8')
    head = (b'\x00\x00\xef\x00' + obj_id.to_bytes(3, 'little') + len(nb).to_bytes(2, 'little') + nb
            + b'\x2a\x01\x00\x00' + (1000 + obj_id).to_bytes(4, 'little') + bytes(14)
            + x.to_bytes(4, 'little') + y.to_bytes(4, 'little') + (242_000).to_bytes(3, 'little')
            + struct.pack('<f', 1.0) + bytes([55, 30]))
    filler = bytes(rnd.getrandbits(8) for _ in range(2500)).replace(b'\xef\x00', b'\xee\x00')
    skills = sorted(rnd.sample(range(10_000, 40_000), 20))
    buffs = sorted(rnd.sample(range(2, 400), 14))
    orders = {a: i for i, a in enumerate(rnd.sample(list(active), len(active)))}
    abil = b''.join(rnd.randrange(0, 7_784_001).to_bytes(4, 'little')
                    + bytes([orders.get(i + 1, 0xFF)]) for i in range(ABILITY_SLOTS))
    tail = (bytes([len(skills), len(buffs)]) + bytes(13) + encode_pisc_list(skills)
            + encode_pisc_list(buffs) + bytes([0, 0, 0x0B, race_gender])
            + encode_pisc([0, 0, 850, 0]) + encode_pisc([101, guild, 27365])
            + encode_pisc([honor, kills, *extra]) + flags.to_bytes(2, 'little') + b'\x00'
            + (ext or b'') + abil + bytes([len(active)]) + bytes(sorted(active)))
    return head + filler + tail + bytes(rnd.getrandbits(8) for _ in range(300)).replace(b'\xef\x00', b'\xee\x00')


def npc_record(obj_id):
    return b'\x00\x00\xef\x00' + obj_id.to_bytes(3, 'little') + b'\x00\x00\xff\xff\x00\x01' + bytes(120)


def dd_frame(kind, body):
    return (2 + len(body)).to_bytes(2, 'little') + bytes([0xDD, kind]) + body


def dd04(sub_blob, count):
    c = zlib.compressobj(wbits=-15)
    return dd_frame(4, count.to_bytes(2, 'little') + c.compress(sub_blob) + c.flush())


def dd05(opcode, payload, counter=1):
    dec = bytearray([0, counter]) + opcode.to_bytes(2, 'little') + payload
    dec[0] = _checksum(dec[1:])
    return dd_frame(5, _xor_dd05(bytes(dec)))


def movement(obj_id, x, y, z=242_000, t=1000):
    return (obj_id.to_bytes(3, 'little') + b'\x01' + t.to_bytes(4, 'little') + b'\x00'
            + x.to_bytes(4, 'little') + y.to_bytes(4, 'little') + z.to_bytes(3, 'little') + bytes(16))


def dd01_movements(moves):
    return dd_frame(1, b'\x00\x00' + (0x00AF).to_bytes(2, 'little') + len(moves).to_bytes(2, 'little') + b''.join(moves))


def eth_tcp(payload, seq, sport=1239, dport=50000):
    tcp = struct.pack('>HHIIBBHHH', sport, dport, seq, 0, 5 << 4, 0x18, 65535, 0, 0)
    ip = struct.pack('>BBHHHBBH4s4s', 0x45, 0, 20 + len(tcp) + len(payload), 0, 0, 64, 6, 0,
                     bytes([10, 0, 0, 1]), bytes([10, 0, 0, 2]))
    return b'\x00' * 12 + b'\x08\x00' + ip + tcp + payload


def segments(stream: bytes, seq0=4_294_960_000, size=1000):
    """Split a byte stream into TCP payloads; seq0 near 2^32 also tests wraparound."""
    return [((seq0 + i) % (1 << 32), stream[i:i + size]) for i in range(0, len(stream), size)]


def write_pcap(path, pkts):
    with open(path, 'wb') as f:
        f.write(struct.pack('<IHHiIII', 0xA1B2C3D4, 2, 4, 0, 0, 65535, 1))
        for ts, data in pkts:
            f.write(struct.pack('<IIII', int(ts), int((ts % 1) * 1e6), len(data), len(data)) + data)


def write_pcapng(path, pkts):
    def block(t, body):
        pad = (-len(body)) % 4
        n = 12 + len(body) + pad
        return struct.pack('<II', t, n) + body + bytes(pad) + struct.pack('<I', n)
    with open(path, 'wb') as f:
        f.write(block(0x0A0D0D0A, struct.pack('<IHHq', 0x1A2B3C4D, 1, 0, -1)))
        f.write(block(1, struct.pack('<HHI', 1, 0, 65535)))
        for ts, data in pkts:
            us = int(round(ts * 1e6))
            f.write(block(6, struct.pack('<IIIII', 0, us >> 32, us & 0xFFFFFFFF, len(data), len(data)) + data))


# --------------------------------------------------------------------------- PISC

class PiscTests(unittest.TestCase):
    def test_width_codes(self):
        for v, width in [(0, 1), (255, 1), (256, 2), (65535, 2), (65536, 3), (0xFFFFFF, 3), (0x1000000, 4)]:
            b = read_pisc(encode_pisc([v]), 0, 1)
            self.assertEqual((b.values, b.widths), ([v], [width]))

    def test_unused_flag_bits_rejected(self):
        with self.assertRaises(PiscError):
            read_pisc(bytes([0x40, 1, 2, 3, 4]), 0, 3)   # bits of a 4th value in a 3-value block

    def test_list_uses_short_last_chunk(self):
        vals = [10082, 10189, 10481, 10694, 10723, 2, 6]
        raw = encode_pisc_list(vals)
        self.assertEqual(raw[9], 0x01)   # second chunk: 3 values u16,u8,u8
        self.assertEqual(read_pisc_list(raw, 0, len(vals))[0], vals)

    def test_old_fixed_layouts_are_special_cases(self):
        # Bytes of one real record: flag 41 | 3C 02 | 15 | 00 | B7 03
        self.assertEqual(read_pisc(bytes.fromhex('41 3c 02 15 00 b7 03'), 0, 4).values, [572, 21, 0, 951])
        # COMPACT_16 read kills as u16 '15 00' and was right only because value #3 was 0.
        raw = encode_pisc([572, 21, 5, 0])
        self.assertEqual(int.from_bytes(raw[3:5], 'little'), 0x0515)       # old reading: 1301
        self.assertEqual(read_pisc(raw, 0, 4).values[1], 21)
        # FULL_24 read kills as u24 'FC 02 00' - same story.
        raw = encode_pisc([1049037, 764, 7, 0])
        self.assertEqual(int.from_bytes(raw[4:7], 'little'), 0x0702FC)
        self.assertEqual(read_pisc(raw, 0, 4).values[:2], [1049037, 764])


# --------------------------------------------------------------------------- records

class RecordTests(unittest.TestCase):
    def blob(self):
        return (npc_record(35001) + player_record(70001, 'Игрок', 1049037, 764, seed=2)
                + player_record(70002, 'Zero', 0, 0, seed=3)
                + player_record(70003, 'Small', 16, 0, seed=4, flags=0x3400)
                + player_record(70004, 'Ext', 57367, 878, extra=(0, 951), flags=0x2100,
                                ext=bytes.fromhex('9c ba 01 00 00 00 00'), seed=5)
                + player_record(70005, 'Huge', 20_000_000, 70_000, seed=6) + npc_record(35002))

    def test_values_and_zeros(self):
        recs = {r.name: r for r in parse_unit_states(self.blob())}
        expect = {'Игрок': (1049037, 764), 'Zero': (0, 0), 'Small': (16, 0), 'Ext': (57367, 878),
                  'Huge': (20_000_000, 70_000)}
        for name, hk in expect.items():
            r = recs[name]
            self.assertEqual(r.status, 'OK', (name, r.note))
            self.assertEqual((r.honor, r.kills), hk)
            self.assertEqual(len(r.candidates), 1)
        self.assertTrue(recs['Huge'].tail.unverified_width)
        self.assertIsNone(recs['Zero'].tail.ext)
        self.assertEqual(recs['Ext'].tail.ext.hex(), '9cba0100000000')
        self.assertEqual(recs[''].status, 'NOT_A_CHARACTER')

    def test_broken_confirmation_gives_no_values(self):
        rec = bytearray(player_record(70010, 'Broken', 500, 5, seed=7))
        idx = rec.rfind(bytes([3, 2, 4, 10]))      # n_active + active ids at the end of the tail
        rec[idx + 1] = 9                            # no longer matches slot orders
        r = parse_unit_states(bytes(rec))[0]
        self.assertEqual(r.status, 'UNCONFIRMED')
        self.assertIsNone(r.honor)
        self.assertIsNone(r.kills)

    def test_no_false_positives_in_noise(self):
        rnd = random.Random(42)
        noise = bytes(rnd.getrandbits(8) for _ in range(200_000)) + bytes(50_000) + b'\xff' * 5000
        self.assertEqual(find_confirmed_tails(noise, 0, len(noise)), [])

    def test_movement(self):
        frame = dd01_movements([movement(25005, 5_698_154, 6_208_492), movement(70001, 1, 2)])
        moves, st = parse_movements(frame[8:])
        self.assertEqual(st, 'ok')
        self.assertEqual([(m.obj_id, m.x, m.y) for m in moves], [(25005, 5_698_154, 6_208_492), (70001, 1, 2)])


# --------------------------------------------------------------------------- capture + tracker

class CaptureTests(unittest.TestCase):
    def stream(self):
        own = player_record(25005, 'Я', 10, 1, seed=8, x=5_700_000)
        blob = own + bytes(600)
        other = player_record(70001, 'Сосед', 341694, 22833, seed=9, x=5_700_000 + 5120)
        return (dd05(0x0254, b'hello') + dd04(blob, 45) + dd04(other, 3)
                + dd01_movements([movement(25005, 5_700_000, 6_200_000), movement(70001, 5_705_120, 6_200_000)]))

    def decode(self, segs, t=100.0):
        dec = CaptureDecoder()
        out = []
        for i, (seq, data) in enumerate(segs):
            out += dec.add_packet(RawPacket(t + i * 0.01, 1, eth_tcp(data, seq)))
        return out, dec

    def test_reassembly_out_of_order_and_retransmit(self):
        segs = segments(self.stream())
        rnd = random.Random(3)
        shuffled = segs[:1] + rnd.sample(segs[1:], len(segs) - 1) + segs[2:4]
        msgs, dec = self.decode(shuffled)
        self.assertEqual([m.kind for m in msgs], [5, 4, 4, 1])
        self.assertTrue(all(m.status == 'ok' for m in msgs))
        self.assertEqual(msgs[1].subpacket_count, 45)

    def test_capture_started_mid_stream(self):
        stream = self.stream()
        start = stream.find(b'\xdd\x04') + 40          # inside the first DD04
        msgs, _ = self.decode(segments(stream[start:]))
        self.assertEqual([m.kind for m in msgs], [4, 1])  # resynced on the next DD04

    def test_pcap_pcapng_and_tracker(self):
        pkts = [(1000.0 + i * 0.05, eth_tcp(d, s)) for i, (s, d) in enumerate(segments(self.stream()))]
        with tempfile.TemporaryDirectory() as tmp:
            for writer, name in ((write_pcap, 'a.pcap'), (write_pcapng, 'a.pcapng')):
                path = Path(tmp) / name
                writer(path, pkts)
                self.assertEqual(len(list(read_capture(path))), len(pkts))
                msgs, diag = messages_from_file(path)
                tr = WorldTracker()
                for m in msgs:
                    tr.feed(m)
                snap = tr.snapshot()
                rows = {r['name']: r for r in snap['rows']}
                self.assertEqual(snap['me_obj'], 25005)          # world-entry batch (45 sub-packets)
                self.assertEqual(rows['Сосед']['honor'], 341694)
                self.assertEqual(rows['Сосед']['distance_m'], 10.0)  # 5120 units / 512
                self.assertEqual(rows['Сосед']['presence'], 'рядом')
                late = tr.snapshot(now=snap['now'] + 30)
                self.assertEqual({r['name']: r['presence'] for r in late['rows']}['Сосед'], 'ушёл?')


class DiscoverTests(unittest.TestCase):
    def test_finds_removal_candidate(self):
        """A player leaves (heartbeat stops) and a made-up 0x0123 message names him."""
        frames = [(0.0, dd04(player_record(70001, 'Уходит', 1, 1, seed=11)
                             + player_record(70002, 'Стоит', 2, 2, seed=12), 2))]
        for i in range(14):
            t = 0.5 + 3.0 * i
            moves = [movement(70002, 1, 1)] + ([movement(70001, 2, 2)] if t < 12 else [])
            frames.append((t, dd01_movements(moves)))
        frames.append((10.2, dd05(0x0123, (1).to_bytes(2, 'little') + (70001).to_bytes(3, 'little'))))
        frames.sort(key=lambda f: f[0])
        seq, pkts = 1000, []
        for t, fr in frames:
            pkts.append((5000.0 + t, eth_tcp(fr, seq)))
            seq += len(fr)
        import io
        from contextlib import redirect_stdout
        import corvus_scan
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'leave.pcap'
            write_pcap(path, pkts)
            buf = io.StringIO()
            with redirect_stdout(buf):
                corvus_scan.main(['discover', str(path)])
        out = buf.getvalue()
        self.assertIn('ушёл: Уходит', out)
        self.assertNotIn('ушёл: Стоит', out)
        self.assertIn('DD05/0x0123 | 1 из 1 | 0 из 1', out)


class ClassTests(unittest.TestCase):
    def test_table_complete_and_mapping_covers_all_trees(self):
        self.assertEqual(len(CLASS_NAMES), 364)                      # C(14, 3)
        slugs = {t[0] for t in ABILITY_TREES.values()}
        self.assertEqual(len(slugs), 14)
        self.assertEqual(slugs, {x for k in CLASS_NAMES for x in k.split('+')})

    def test_copy_matches_site_table(self):
        import sync_class_names
        if not sync_class_names.SOURCE.is_file():
            self.skipTest('нет src/ - папка сканера скопирована отдельно')
        self.assertEqual(sync_class_names.read_ts(), CLASS_NAMES)

    def test_lookup_order_independent_and_unknown_ids(self):
        a, b = class_info([10, 2, 4]), class_info([2, 4, 10])
        self.assertEqual((a.name, a.trees), (b.name, b.trees))
        self.assertIsNotNone(a.name)
        odd = class_info([2, 4, 99])
        self.assertIsNone(odd.name)
        self.assertIn('?99', odd.label)
        self.assertEqual(class_info([]).label, '—')


class KillcountTests(unittest.TestCase):
    @staticmethod
    def doc(when, players, me_guild=1085):
        return {'format': 'corvus-snapshot/1', 'taken_at': when, 'source': 'test',
                'me': {'name': 'Я', 'char_id': 1, 'guild_id': me_guild},
                'players': [dict(zip(('name', 'char_id', 'honor', 'kills', 'class', 'guild_id'), p),
                                 class_certain=True) for p in players]}

    def test_prime_delta(self):
        start = self.doc('2026-10-17T20:00:00+03:00', [
            ('Я', 1, 1000, 10, 'Аскет', 1085), ('Старыйник', 2, 500, 5, 'Флибустьер', 1085),
            ('Чужой', 3, 9, 9, 'Сказитель', 777), ('Ушёл', 4, 1, 1, 'Ведьмак', 1085),
            ('Сменил', 6, 0, 0, 'Аскет', 1085)])
        end = self.doc('2026-10-17T23:00:00+03:00', [
            ('Я', 1, 1600, 13, 'Аскет', 1085), ('Новыйник', 2, 900, 25, 'Флибустьер', 1085),
            ('Чужой', 3, 99, 19, 'Сказитель', 777), ('Пришёл', 5, 7, 7, 'Ведьмак', 1085),
            ('Сменил', 6, 10, 1, 'Ведьмак?', 1085)])
        res = build_killcount(start, end)
        self.assertEqual([r['userName'] for r in res.rows], ['Новыйник', 'Я', 'Сменил'])  # by kills
        self.assertEqual([r['id'] for r in res.rows], [1, 2, 3])
        renamed = res.rows[0]
        self.assertEqual((renamed['startKills'], renamed['endKills'], renamed['comment']), (5, 25, 'был ник Старыйник'))
        self.assertEqual(renamed['aliases'], ['Старыйник'])
        self.assertNotIn('aliases', res.rows[1])
        self.assertEqual(res.rows[2]['playerClass'], 'Ведьмак')            # '?' is not sent to the site
        self.assertEqual(res.rows[2]['comment'], 'класс в начале: Аскет')
        self.assertEqual((res.only_start, res.only_end, res.other_guild), (['Ушёл'], ['Пришёл'], 1))
        line = res.site_json()
        self.assertNotIn('\n', line)
        self.assertEqual(json.loads(line), res.rows)
        self.assertNotIn('specs', res.rows[0])                          # test docs carry no specs
        everyone = build_killcount(start, end, only_my_guild=False)
        self.assertIn('Чужой', [r['userName'] for r in everyone.rows])

    def test_reversed_order_and_drop(self):
        a = self.doc('2026-10-17T20:00:00+03:00', [('Я', 1, 100, 10, 'Аскет', 1085)])
        b = self.doc('2026-10-17T23:00:00+03:00', [('Я', 1, 90, 12, 'Аскет', 1085)])
        res = build_killcount(b, a)                                     # end given first
        self.assertEqual((res.rows[0]['startKills'], res.rows[0]['endKills']), (10, 12))
        self.assertTrue(any('обратном' in w for w in res.warnings))
        self.assertTrue(any('уменьшились' in w for w in res.warnings))  # honor 100 -> 90

    def test_relogin_duplicate_and_stale_end_record(self):
        start = self.doc('2026-10-17T20:00:00+03:00', [('Вася', 7, 100, 5, 'Аскет', 1085),
                                                      ('Петя', 8, 50, 7, 'Аскет', 1085)])
        end = self.doc('2026-10-17T23:00:00+03:00', [('Вася', 7, 100, 5, 'Аскет', 1085),
                                                    ('Вася', 7, 400, 25, 'Аскет', 1085),
                                                    ('Петя', 8, 50, 7, 'Аскет', 1085)])
        old, new, petya = end['players']
        old['record_age_s'], new['record_age_s'] = 10790, 20     # old object id vs after re-login
        petya['record_age_s'] = 10900                           # never re-sent after the start scan
        res = build_killcount(start, end)
        self.assertEqual([(r['userName'], r['startKills'], r['endKills']) for r in res.rows], [('Вася', 5, 25)])
        self.assertEqual(res.stale_end, ['Петя'])

    def test_same_name_different_ids_are_not_merged(self):
        start = self.doc('2026-10-17T20:00:00+03:00', [('Вася', 10, 100, 10, 'Аскет', 1085)])
        end = self.doc('2026-10-17T23:00:00+03:00', [('Петя', 10, 150, 12, 'Аскет', 1085),
                                                    ('Вася', 20, 5000, 3, 'Аскет', 1085)])
        res = build_killcount(start, end)
        self.assertEqual([(r['userName'], r['startKills'], r['endKills']) for r in res.rows], [('Петя', 10, 12)])
        self.assertEqual(res.only_end, ['Вася'])

    def test_cli_snapshot_uses_capture_time(self):
        import io
        from contextlib import redirect_stdout
        import corvus_scan
        pkts = [(1_700_000_000.0 + i * 0.05, eth_tcp(d, s_)) for i, (s_, d) in
                enumerate(segments(CaptureTests().stream()))]
        with tempfile.TemporaryDirectory() as tmp:
            write_pcap(Path(tmp) / 'a.pcap', pkts)
            with redirect_stdout(io.StringIO()):
                corvus_scan.main(['snapshot', str(Path(tmp) / 'a.pcap'), '--out-dir', tmp])
            doc = load_snapshot(next(Path(tmp).glob('snapshot_*.json')))
        self.assertTrue(doc['taken_at'].startswith('2023-11-1'))      # capture time, not now

    def test_old_start_record_warns(self):
        start = self.doc('2026-10-17T20:00:00+03:00', [('Вася', 7, 100, 5, 'Аскет', 1085)])
        start['players'][0]['record_age_s'] = 3600
        end = self.doc('2026-10-17T23:00:00+03:00', [('Вася', 7, 120, 6, 'Аскет', 1085)])
        res = build_killcount(start, end)
        self.assertEqual(len(res.rows), 1)
        self.assertTrue(any('старше' in w and 'Вася' in w for w in res.warnings))

    def test_unknown_guild_disables_filter(self):
        a = self.doc('2026-10-17T20:00:00+03:00', [('A', 2, 1, 1, '', 5)], me_guild=0)
        b = self.doc('2026-10-17T23:00:00+03:00', [('A', 2, 2, 2, '', 5)], me_guild=0)
        res = build_killcount(a, b)
        self.assertEqual(len(res.rows), 1)
        self.assertIsNone(res.guild_id)

    def test_tracker_relogin_keeps_one_row_and_me(self):
        own = player_record(25005, 'Я', 10, 1, seed=8)
        again = player_record(26000, 'Я', 10, 4, seed=8)            # same char id: 1000 + obj id differs
        again = again.replace((1000 + 26000).to_bytes(4, 'little'), (1000 + 25005).to_bytes(4, 'little'), 1)
        frames = [(0.0, dd04(own + bytes(600), 45)), (60.0, dd04(again + bytes(600), 45))]
        seq, pkts = 1, []
        for t, fr in frames:
            pkts.append(RawPacket(100 + t, 1, eth_tcp(fr, seq)))
            seq += len(fr)
        dec, tr = CaptureDecoder(), WorldTracker()
        for p in pkts:
            for m in dec.add_packet(p):
                tr.feed(m)
        snap = tr.snapshot()
        mine = [r for r in snap['rows'] if r['name'] == 'Я']
        self.assertEqual(len(mine), 1)
        self.assertEqual((mine[0]['obj_id'], mine[0]['kills'], mine[0]['is_me']), (26000, 4, True))

    def test_snapshot_file_from_tracker(self):
        stream = CaptureTests().stream()
        msgs, _ = CaptureTests().decode(segments(stream))
        tr = WorldTracker()
        for m in msgs:
            tr.feed(m)
        doc = snapshot_from(tr.snapshot(), 'test')
        self.assertEqual(doc['me']['name'], 'Я')
        self.assertEqual(sorted(doc['players'][0]['specs']), ['gipnoz', 'isceleine', 'soprotivlenie'])
        self.assertEqual({p['name']: p['kills'] for p in doc['players']}, {'Я': 1, 'Сосед': 22833})
        with tempfile.TemporaryDirectory() as tmp:
            p1, p2 = save_snapshot(doc, Path(tmp)), save_snapshot(doc, Path(tmp))
            self.assertNotEqual(p1, p2)                                  # same second -> no overwrite
            self.assertEqual(load_snapshot(p1), doc)
            bad = Path(tmp) / 'x.json'
            bad.write_text('{}', encoding='utf-8')
            with self.assertRaises(ValueError):
                load_snapshot(bad)


# --------------------------------------------------------------------------- real capture

PCAP = os.environ.get('CORVUS_PCAP')
TRUTH = os.environ.get('CORVUS_TRUTH')


@unittest.skipUnless(PCAP and Path(PCAP).is_file(), 'CORVUS_PCAP не задан - тест на реальном захвате пропущен')
class RealCaptureTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        msgs, cls.diag = messages_from_file(Path(PCAP))
        cls.records = [r for m in msgs if m.kind == 4 and m.status == 'ok'
                       for r in parse_unit_states(m.payload) if r.name]

    def test_every_player_record_is_structurally_confirmed(self):
        self.assertGreater(len(self.records), 0)
        for r in self.records:
            with self.subTest(name=r.name):
                self.assertEqual(r.status, 'OK', r.note)
                self.assertEqual(len(r.candidates), 1)
                t = r.tail
                self.assertTrue(t.tail_confirmed and t.lists_sorted)
                self.assertIsNotNone(r.level)
                self.assertIsNotNone(class_info(t.active_abilities).name)

    @unittest.skipUnless(TRUTH and Path(TRUTH).is_file(), 'CORVUS_TRUTH не задан')
    def test_ground_truth(self):
        with open(TRUTH, encoding='utf-8-sig', newline='') as f:
            truth = {row['name']: (int(row['honor']), int(row['kills'])) for row in csv.DictReader(f)}
        got = {r.name: (r.honor, r.kills) for r in self.records}
        for name, hk in truth.items():
            with self.subTest(name=name):
                self.assertEqual(got.get(name), hk)


if __name__ == '__main__':
    unittest.main(verbosity=2)
