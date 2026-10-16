#!/usr/bin/env python3
"""Passive capture input for ArcheAge game traffic (receive-only, offline or live).

Layers handled here:
  * classic PCAP and PCAPNG files (Npcap, Wireshark/dumpcap, Windows pktmon etl2pcap);
  * link layers: Ethernet(+VLAN), raw IPv4/IPv6, Linux SLL/SLL2, BSD loopback;
  * TCP stream reassembly per flow (out-of-order, retransmits, gaps -> resync);
  * game framing  u16le size | 0xDD | kind | body  and the DD01/DD02/DD04/DD05 bodies.

The DD-framing, the DD05 XOR transform and the DD04 raw-DEFLATE layout are the
ones from the earlier ruru_offline_decode.py (derived from Ruru G.cs). New here:
the 2-byte DD04 prefix is the number of sub-packets in the decompressed blob,
which is reported for diagnostics.

Nothing in this module sends packets or touches the game process.
Python 3.9+, standard library only.
"""
from __future__ import annotations

import struct
import zlib
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, Iterator, List, Optional, Tuple

GAME_PORT = 1239
MAX_DECOMPRESSED = 4_000_000
SEQ_MOD = 1 << 32


# --------------------------------------------------------------------------- files

@dataclass
class RawPacket:
    ts: float
    linktype: int
    data: bytes


def read_capture(path: Path) -> Iterator[RawPacket]:
    """Yield packets from a classic .pcap or a .pcapng file."""
    with Path(path).open('rb') as f:
        magic = f.read(4)
        f.seek(0)
        if magic == b'\x0a\x0d\x0d\x0a':
            yield from _read_pcapng(f)
        else:
            yield from _read_pcap(f)


def _read_pcap(f) -> Iterator[RawPacket]:
    gh = f.read(24)
    if len(gh) != 24:
        raise ValueError('Пустой или повреждённый PCAP')
    formats = {
        b'\xd4\xc3\xb2\xa1': ('<', 1e6), b'\xa1\xb2\xc3\xd4': ('>', 1e6),
        b'\x4d\x3c\xb2\xa1': ('<', 1e9), b'\xa1\xb2\x3c\x4d': ('>', 1e9),
    }
    if gh[:4] not in formats:
        raise ValueError('Неизвестный формат захвата (ожидается .pcap или .pcapng)')
    endian, frac = formats[gh[:4]]
    linktype = struct.unpack(endian + 'I', gh[20:24])[0] & 0x0FFFFFFF
    while True:
        h = f.read(16)
        if not h:
            return
        if len(h) != 16:
            raise ValueError('Обрезанный заголовок пакета')
        sec, sub, caplen, _ = struct.unpack(endian + 'IIII', h)
        if caplen > 10_000_000:
            raise ValueError('Неправдоподобная длина пакета')
        data = f.read(caplen)
        if len(data) != caplen:
            return  # file cut while writing (live capture) - keep what we have
        yield RawPacket(sec + sub / frac, linktype, data)


def _read_pcapng(f) -> Iterator[RawPacket]:
    endian = '<'
    interfaces: List[Tuple[int, float]] = []  # (linktype, seconds per tick)
    while True:
        head = f.read(8)
        if len(head) < 8:
            return
        btype_raw, blen_raw = head[:4], head[4:8]
        if btype_raw == b'\x0a\x0d\x0d\x0a':
            bom = f.read(4)
            endian = '<' if bom == b'\x4d\x3c\x2b\x1a' else '>'
            blen = struct.unpack(endian + 'I', blen_raw)[0]
            f.read(blen - 12)
            interfaces = []
            continue
        btype, blen = struct.unpack(endian + 'II', head)
        if blen < 12:
            raise ValueError('Повреждённый блок PCAPNG')
        body = f.read(blen - 8)
        if len(body) != blen - 8:
            return
        body = body[:-4]
        if btype == 1:  # Interface Description Block
            linktype = struct.unpack(endian + 'H', body[:2])[0]
            tick = 1e-6
            opts = body[8:]
            while len(opts) >= 4:
                code, olen = struct.unpack(endian + 'HH', opts[:4])
                val = opts[4:4 + olen]
                if code == 0:
                    break
                if code == 9 and val:  # if_tsresol
                    r = val[0]
                    tick = 2.0 ** -(r & 0x7F) if r & 0x80 else 10.0 ** -r
                opts = opts[4 + ((olen + 3) & ~3):]
            interfaces.append((linktype, tick))
        elif btype == 6:  # Enhanced Packet Block
            iface, hi, lo, caplen, _ = struct.unpack(endian + 'IIIII', body[:20])
            if iface >= len(interfaces):
                continue
            linktype, tick = interfaces[iface]
            yield RawPacket(((hi << 32) | lo) * tick, linktype, body[20:20 + caplen])
        elif btype == 3:  # Simple Packet Block (no timestamp)
            if interfaces:
                yield RawPacket(0.0, interfaces[0][0], body[4:])


# --------------------------------------------------------------------------- IP/TCP

@dataclass
class TcpSegment:
    ts: float
    src: bytes
    sport: int
    dst: bytes
    dport: int
    seq: int
    payload: bytes


def tcp_segment(pkt: RawPacket) -> Optional[TcpSegment]:
    d, lt = pkt.data, pkt.linktype
    if lt == 1:  # Ethernet
        if len(d) < 14:
            return None
        typ = int.from_bytes(d[12:14], 'big')
        pos = 14
        while typ in (0x8100, 0x88A8) and len(d) >= pos + 4:
            typ = int.from_bytes(d[pos + 2:pos + 4], 'big')
            pos += 4
    elif lt in (101, 12, 14):  # raw IP
        typ, pos = None, 0
    elif lt == 228:
        typ, pos = 0x0800, 0
    elif lt == 229:
        typ, pos = 0x86DD, 0
    elif lt == 113:  # Linux SLL
        if len(d) < 16:
            return None
        typ, pos = int.from_bytes(d[14:16], 'big'), 16
    elif lt == 276:  # Linux SLL2
        if len(d) < 20:
            return None
        typ, pos = int.from_bytes(d[0:2], 'big'), 20
    elif lt == 0:  # BSD loopback
        if len(d) < 4:
            return None
        fam = int.from_bytes(d[:4], 'little')
        typ, pos = (0x0800 if fam == 2 else 0x86DD if fam in (24, 28, 30) else -1), 4
    else:
        return None
    if pos >= len(d):
        return None
    version = d[pos] >> 4
    if typ is None:
        typ = 0x0800 if version == 4 else 0x86DD if version == 6 else -1
    if typ == 0x0800 and version == 4:
        if len(d) < pos + 20:
            return None
        ihl = (d[pos] & 15) * 4
        if d[pos + 9] != 6 or int.from_bytes(d[pos + 6:pos + 8], 'big') & 0x1FFF:
            return None
        ip_end = min(len(d), pos + int.from_bytes(d[pos + 2:pos + 4], 'big'))
        src, dst = d[pos + 12:pos + 16], d[pos + 16:pos + 20]
        tcp = pos + ihl
    elif typ == 0x86DD and version == 6:
        if len(d) < pos + 40 or d[pos + 6] != 6:
            return None  # extension headers are not expected on this path
        ip_end = min(len(d), pos + 40 + int.from_bytes(d[pos + 4:pos + 6], 'big'))
        src, dst = d[pos + 8:pos + 24], d[pos + 24:pos + 40]
        tcp = pos + 40
    else:
        return None
    if ip_end < tcp + 20:
        return None
    thl = (d[tcp + 12] >> 4) * 4
    if thl < 20 or tcp + thl > ip_end:
        return None
    payload = d[tcp + thl:ip_end]
    if not payload:
        return None
    return TcpSegment(pkt.ts, bytes(src), int.from_bytes(d[tcp:tcp + 2], 'big'), bytes(dst),
                      int.from_bytes(d[tcp + 2:tcp + 4], 'big'),
                      int.from_bytes(d[tcp + 4:tcp + 8], 'big'), bytes(payload))


class StreamAssembler:
    """In-order byte stream of one TCP direction.

    Handles retransmits/overlaps and out-of-order segments.  A hole that is not
    filled within `gap_bytes` of later data (or `gap_seconds`) is given up: the
    stream jumps over it and `gaps` is incremented, so the framer must resync.
    """

    def __init__(self, gap_bytes: int = 1_500_000, gap_seconds: float = 3.0):
        self.next_seq: Optional[int] = None
        self.pending: Dict[int, Tuple[float, bytes]] = {}
        self.pending_bytes = 0
        self.gap_bytes = gap_bytes
        self.gap_seconds = gap_seconds
        self.gaps = 0
        self.duplicates = 0

    def add(self, seq: int, payload: bytes, ts: float) -> List[Tuple[float, bytes, bool]]:
        """Return list of (ts, contiguous_bytes, gap_before) chunks ready for framing."""
        out: List[Tuple[float, bytes, bool]] = []
        if self.next_seq is None:
            self.next_seq = seq
        ahead = (seq - self.next_seq) % SEQ_MOD
        if ahead >= SEQ_MOD // 2:  # starts before next_seq: old data or overlap
            behind = SEQ_MOD - ahead
            if behind >= len(payload):
                self.duplicates += 1
                return out
            payload = payload[behind:]
            seq = self.next_seq
            ahead = 0
        if ahead == 0:
            out.append((ts, payload, False))
            self.next_seq = (seq + len(payload)) % SEQ_MOD
            self._drain(out)
        else:
            if seq not in self.pending or len(self.pending[seq][1]) < len(payload):
                self.pending_bytes += len(payload) - len(self.pending.get(seq, (0, b''))[1])
                self.pending[seq] = (ts, payload)
            oldest = min(t for t, _ in self.pending.values())
            if self.pending_bytes > self.gap_bytes or ts - oldest > self.gap_seconds:
                self._skip_gap(out)
        return out

    def _offset(self, seq: int) -> int:
        """Signed distance of `seq` from the next expected byte."""
        a = (seq - self.next_seq) % SEQ_MOD
        return a - SEQ_MOD if a >= SEQ_MOD // 2 else a

    def _drain(self, out, gap_before=False):
        while self.pending:
            s = min(self.pending, key=self._offset)
            o = self._offset(s)
            if o > 0:
                return  # still a hole before the earliest pending segment
            t, p = self.pending.pop(s)
            self.pending_bytes -= len(p)
            if -o >= len(p):
                continue  # entirely old data
            p = p[-o:]
            out.append((t, p, gap_before))
            gap_before = False
            self.next_seq = (self.next_seq + len(p)) % SEQ_MOD

    def _skip_gap(self, out):
        if not self.pending:
            return
        self.gaps += 1
        self.next_seq = min(self.pending, key=self._offset)
        self._drain(out, gap_before=True)


# --------------------------------------------------------------------------- DD framing

@dataclass
class GameMessage:
    ts: float
    kind: int                 # 1, 2, 4, 5 (DDxx)
    opcode: Optional[int]     # None for DD04 (container)
    payload: bytes            # decoded payload (DD04: decompressed sub-packet stream)
    status: str               # ok | short | deflate_fail | checksum_fail | opaque
    subpacket_count: Optional[int] = None  # DD04 only
    flow: Tuple = ()


def _xor_dd05(data: bytes) -> bytes:
    out = bytearray(len(data))
    state = (len(data) ^ 0x1F2175A0) & 0xFFFFFFFF
    four = (len(data) // 4) * 4
    for i in list(range(four - 1, -1, -1)) + list(range(four, len(data))):
        state = (state + 3132373) & 0xFFFFFFFF
        key = (state >> 16) & 0xF7
        out[i] = data[i] ^ (key or 254)
    return bytes(out)


def _checksum(data: bytes) -> int:
    value = 0
    for c in data:
        value = (value * 19 + c) & 0xFFFFFFFF
    return value & 0xFF


def _inflate(data: bytes) -> bytes:
    obj = zlib.decompressobj(-zlib.MAX_WBITS)
    result = obj.decompress(data, MAX_DECOMPRESSED + 1)
    if len(result) > MAX_DECOMPRESSED or not obj.eof:
        raise ValueError('invalid/oversized deflate stream')
    return result


def decode_body(kind: int, body: bytes, ts: float = 0.0, flow: Tuple = ()) -> GameMessage:
    if kind == 1:
        if len(body) < 4:
            return GameMessage(ts, kind, None, b'', 'short', flow=flow)
        return GameMessage(ts, kind, int.from_bytes(body[2:4], 'little'), body[4:], 'ok', flow=flow)
    if kind == 2:
        if len(body) < 2:
            return GameMessage(ts, kind, None, b'', 'short', flow=flow)
        return GameMessage(ts, kind, int.from_bytes(body[:2], 'little'), body[2:], 'ok', flow=flow)
    if kind == 4:
        if len(body) < 3:
            return GameMessage(ts, kind, None, b'', 'short', flow=flow)
        try:
            return GameMessage(ts, kind, None, _inflate(body[2:]), 'ok',
                               int.from_bytes(body[:2], 'little'), flow=flow)
        except (zlib.error, ValueError):
            return GameMessage(ts, kind, None, b'', 'deflate_fail', flow=flow)
    if kind == 5:
        if len(body) < 4:
            return GameMessage(ts, kind, None, b'', 'short', flow=flow)
        dec = _xor_dd05(body)
        if dec[0] != _checksum(dec[1:]):
            return GameMessage(ts, kind, None, b'', 'checksum_fail', flow=flow)
        return GameMessage(ts, kind, int.from_bytes(dec[2:4], 'little'), dec[4:], 'ok', flow=flow)
    return GameMessage(ts, kind, None, body, 'opaque', flow=flow)


class Framer:
    """Incremental DD-frame splitter for one server->client stream.

    After a TCP gap (or at a capture that starts mid-session) the framer is
    'unsynced' and only accepts self-validating frames (DD05 checksum or DD04
    deflate) before trusting DD01/DD02 headers again.
    """

    def __init__(self, flow: Tuple = ()):
        self.buf = bytearray()
        self.buf_ts = 0.0
        self.synced = False
        self.flow = flow
        self.skipped_bytes = 0
        self.resyncs = 0

    MAX_FRAME = 2 + 0xFFFF

    def feed(self, ts: float, data: bytes, gap_before: bool = False) -> List[GameMessage]:
        if gap_before:
            self.buf.clear()
            self.synced = False
            self.resyncs += 1
        self.buf += data
        self.buf_ts = ts
        out: List[GameMessage] = []
        pos = 0
        buf = self.buf
        while pos + 4 <= len(buf):
            if not self.synced:
                found = self._find_sync(buf, pos, ts)
                if found is None:
                    # Keep enough bytes for a real frame that is still incomplete.
                    keep_from = max(pos, len(buf) - self.MAX_FRAME)
                    self.skipped_bytes += keep_from - pos
                    pos = keep_from
                    break
                start, msg = found
                self.skipped_bytes += start - pos
                out.append(msg)
                pos = start + 2 + (buf[start] | (buf[start + 1] << 8))
                self.synced = True
                continue
            size = buf[pos] | (buf[pos + 1] << 8)
            if buf[pos + 2] != 0xDD or size < 2:
                self.synced = False
                continue
            stop = pos + 2 + size
            if stop > len(buf):
                break  # wait for the rest of this frame
            out.append(decode_body(buf[pos + 3], bytes(buf[pos + 4:stop]), ts, self.flow))
            pos = stop
        del buf[:pos]
        return out

    def _find_sync(self, buf, pos, ts):
        """First self-validating frame (DD04 inflates / DD05 checksum) that is
        followed by another plausible header or by the end of the buffer."""
        while pos + 4 <= len(buf):
            p = buf.find(b'\xdd', pos + 2)
            if p < 0:
                return None
            pos = p - 2
            size = buf[pos] | (buf[pos + 1] << 8)
            stop = pos + 2 + size
            kind = buf[pos + 3] if pos + 3 < len(buf) else None
            if size >= 2 and kind in (4, 5) and stop <= len(buf):
                nxt_ok = stop + 3 > len(buf) or buf[stop + 2] == 0xDD
                if nxt_ok:
                    msg = decode_body(kind, bytes(buf[pos + 4:stop]), ts, self.flow)
                    if msg.status == 'ok':
                        return pos, msg
            pos += 1
        return None


class CaptureDecoder:
    """Packets -> GameMessages for every server->client flow on `ports`."""

    def __init__(self, ports: Iterable[int] = (GAME_PORT,)):
        self.ports = set(ports)
        self.streams: Dict[Tuple, StreamAssembler] = {}
        self.framers: Dict[Tuple, Framer] = {}
        self.stats = defaultdict(int)

    def add_packet(self, pkt: RawPacket) -> List[GameMessage]:
        self.stats['packets'] += 1
        seg = tcp_segment(pkt)
        if seg is None:
            return []
        if seg.sport not in self.ports:
            if seg.dport in self.ports:
                self.stats['client_segments'] += 1
            return []
        self.stats['server_segments'] += 1
        key = (seg.src, seg.sport, seg.dst, seg.dport)
        asm = self.streams.get(key)
        if asm is None:
            asm = self.streams[key] = StreamAssembler()
            self.framers[key] = Framer(key)
        out = []
        for ts, chunk, gap in asm.add(seg.seq, seg.payload, seg.ts):
            out.extend(self.framers[key].feed(ts, chunk, gap))
        for m in out:
            self.stats[f'DD{m.kind:02X}_{m.status}'] += 1
        return out

    def diagnostics(self) -> Dict[str, int]:
        d = dict(self.stats)
        d['tcp_flows'] = len(self.streams)
        d['tcp_gaps'] = sum(a.gaps for a in self.streams.values())
        d['tcp_duplicate_segments'] = sum(a.duplicates for a in self.streams.values())
        d['framer_skipped_bytes'] = sum(f.skipped_bytes for f in self.framers.values())
        d['framer_resyncs'] = sum(f.resyncs for f in self.framers.values())
        return d


def messages_from_file(path: Path, ports: Iterable[int] = (GAME_PORT,)):
    """Decode a whole capture file. Returns (messages, diagnostics)."""
    dec = CaptureDecoder(ports)
    msgs: List[GameMessage] = []
    packets = list(read_capture(path))
    # Files from pktmon/dumpcap are time ordered; sorting keeps reassembly stable.
    packets.sort(key=lambda p: p.ts)
    for pkt in packets:
        msgs.extend(dec.add_packet(pkt))
    return msgs, dec.diagnostics()
