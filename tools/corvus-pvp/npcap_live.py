#!/usr/bin/env python3
"""Receive-only live capture on Windows through Npcap (wpcap.dll), via ctypes.

Opens every active non-loopback adapter with the BPF filter 'tcp src port 1239'
so the user does not have to pick a network card.  Packets are only read:
nothing is injected, modified or sent, and the game process is not touched.

Also a tiny classic-PCAP writer for experiments (Npcap packets -> file).
"""
from __future__ import annotations

import ctypes
import os
import struct
import threading
import time
from ctypes import POINTER, Structure, c_char_p, c_int, c_long, c_uint, c_uint32, c_ubyte, c_void_p
from pathlib import Path
from typing import Callable, List, Optional

from aa_capture import GAME_PORT, RawPacket

PCAP_IF_LOOPBACK = 0x1
AF_INET = 2


class _SockAddr(Structure):
    _fields_ = [('family', ctypes.c_ushort), ('data', ctypes.c_ubyte * 14)]


class _PcapAddr(Structure):
    pass


_PcapAddr._fields_ = [('next', POINTER(_PcapAddr)), ('addr', POINTER(_SockAddr)),
                      ('netmask', POINTER(_SockAddr)), ('broadaddr', POINTER(_SockAddr)),
                      ('dstaddr', POINTER(_SockAddr))]


class _PcapIf(Structure):
    pass


_PcapIf._fields_ = [('next', POINTER(_PcapIf)), ('name', c_char_p), ('description', c_char_p),
                    ('addresses', POINTER(_PcapAddr)), ('flags', c_uint)]


class _Timeval(Structure):
    _fields_ = [('tv_sec', c_long), ('tv_usec', c_long)]   # 32-bit longs on Windows


class _PktHdr(Structure):
    _fields_ = [('ts', _Timeval), ('caplen', c_uint32), ('len', c_uint32)]


class _Bpf(Structure):
    _fields_ = [('bf_len', c_uint), ('bf_insns', c_void_p)]


_lib = None


def load_npcap():
    global _lib
    if _lib is not None:
        return _lib
    if os.name != 'nt':
        raise RuntimeError('Живой захват работает только в Windows с Npcap. Офлайн-разбор PCAP работает везде.')
    root = Path(os.environ.get('SystemRoot', r'C:\Windows'))
    npcap_dir = root / 'System32' / 'Npcap'
    if npcap_dir.is_dir():
        os.add_dll_directory(str(npcap_dir))
    lib = None
    for cand in (npcap_dir / 'wpcap.dll', root / 'System32' / 'wpcap.dll'):
        if cand.is_file():
            try:
                lib = ctypes.CDLL(str(cand))
                break
            except OSError:
                continue
    if lib is None:
        raise RuntimeError('Не найден wpcap.dll. Установи Npcap (https://npcap.com) с опцией '
                           '"WinPcap API-compatible Mode".')
    sig = {
        'pcap_findalldevs': (c_int, [POINTER(POINTER(_PcapIf)), c_char_p]),
        'pcap_freealldevs': (None, [POINTER(_PcapIf)]),
        'pcap_create': (c_void_p, [c_char_p, c_char_p]),
        'pcap_set_snaplen': (c_int, [c_void_p, c_int]),
        'pcap_set_promisc': (c_int, [c_void_p, c_int]),
        'pcap_set_timeout': (c_int, [c_void_p, c_int]),
        'pcap_set_buffer_size': (c_int, [c_void_p, c_int]),
        'pcap_activate': (c_int, [c_void_p]),
        'pcap_compile': (c_int, [c_void_p, POINTER(_Bpf), c_char_p, c_int, c_uint32]),
        'pcap_setfilter': (c_int, [c_void_p, POINTER(_Bpf)]),
        'pcap_freecode': (None, [POINTER(_Bpf)]),
        'pcap_next_ex': (c_int, [c_void_p, POINTER(POINTER(_PktHdr)), POINTER(POINTER(c_ubyte))]),
        'pcap_datalink': (c_int, [c_void_p]),
        'pcap_geterr': (c_char_p, [c_void_p]),
        'pcap_close': (None, [c_void_p]),
    }
    for name, (res, args) in sig.items():
        fn = getattr(lib, name)
        fn.restype, fn.argtypes = res, args
    _lib = lib
    return lib


def _text(b: Optional[bytes]) -> str:
    if not b:
        return ''
    for enc in ('utf-8', 'mbcs'):
        try:
            return b.decode(enc)
        except (UnicodeError, LookupError):
            pass
    return b.decode('latin-1', 'replace')


def list_adapters() -> List[dict]:
    lib = load_npcap()
    head = POINTER(_PcapIf)()
    err = ctypes.create_string_buffer(512)
    if lib.pcap_findalldevs(ctypes.byref(head), err) != 0:
        raise RuntimeError('Npcap: ' + _text(err.value))
    out = []
    try:
        cur = head
        while cur:
            dev = cur.contents
            ips = []
            addr = dev.addresses
            while addr:
                a = addr.contents
                if a.addr and a.addr.contents.family == AF_INET:
                    ips.append('.'.join(str(x) for x in a.addr.contents.data[2:6]))
                addr = a.next
            out.append({'name': dev.name, 'description': _text(dev.description) or _text(dev.name),
                        'ips': ips, 'loopback': bool(dev.flags & PCAP_IF_LOOPBACK)})
            cur = dev.next
    finally:
        lib.pcap_freealldevs(head)
    return out


class AdapterReader(threading.Thread):
    def __init__(self, adapter: dict, bpf: str, on_packet: Callable[[RawPacket], None],
                 stop: threading.Event, on_error: Callable[[str], None]):
        super().__init__(daemon=True, name='npcap-' + adapter['description'][:20])
        self.adapter, self.bpf, self.on_packet, self.stop, self.on_error = adapter, bpf, on_packet, stop, on_error
        self.packets = 0
        self.linktype = None

    def run(self):
        lib = load_npcap()
        err = ctypes.create_string_buffer(512)
        h = lib.pcap_create(self.adapter['name'], err)
        if not h:
            self.on_error(f"{self.adapter['description']}: {_text(err.value)}")
            return
        try:
            lib.pcap_set_snaplen(h, 65535)
            lib.pcap_set_promisc(h, 0)
            lib.pcap_set_timeout(h, 200)
            lib.pcap_set_buffer_size(h, 16 * 1024 * 1024)   # login bursts are ~0.5 MB/s
            if lib.pcap_activate(h) < 0:
                self.on_error(f"{self.adapter['description']}: {_text(lib.pcap_geterr(h))}")
                return
            prog = _Bpf()
            if lib.pcap_compile(h, ctypes.byref(prog), self.bpf.encode('ascii'), 1, 0xFFFFFFFF) != 0:
                self.on_error('BPF: ' + _text(lib.pcap_geterr(h)))
                return
            try:
                lib.pcap_setfilter(h, ctypes.byref(prog))
            finally:
                lib.pcap_freecode(ctypes.byref(prog))
            self.linktype = lib.pcap_datalink(h)
            hdr = POINTER(_PktHdr)()
            data = POINTER(c_ubyte)()
            while not self.stop.is_set():
                rc = lib.pcap_next_ex(h, ctypes.byref(hdr), ctypes.byref(data))
                if rc == 1:
                    hd = hdr.contents
                    self.packets += 1
                    self.on_packet(RawPacket(hd.ts.tv_sec + hd.ts.tv_usec / 1e6, self.linktype,
                                             ctypes.string_at(data, hd.caplen)))
                elif rc < 0:
                    if rc == -1:
                        self.on_error(f"{self.adapter['description']}: {_text(lib.pcap_geterr(h))}")
                    return
        finally:
            lib.pcap_close(h)


class LiveCapture:
    """Capture on all usable adapters at once; packets go to `on_packet`."""

    def __init__(self, on_packet: Callable[[RawPacket], None], port: int = GAME_PORT,
                 on_error: Callable[[str], None] = print):
        self.on_packet, self.port, self.on_error = on_packet, port, on_error
        self.stop_event = threading.Event()
        self.readers: List[AdapterReader] = []

    def start(self) -> List[str]:
        bpf = f'tcp src port {self.port} or tcp dst port {self.port}'
        adapters = [a for a in list_adapters() if not a['loopback'] and a['ips']]
        if not adapters:
            raise RuntimeError('Npcap не нашёл активных сетевых адаптеров с IPv4.')
        for a in adapters:
            r = AdapterReader(a, bpf, self.on_packet, self.stop_event, self.on_error)
            r.start()
            self.readers.append(r)
        return [a['description'] for a in adapters]

    def stop(self):
        self.stop_event.set()
        for r in self.readers:
            r.join(timeout=2)

    def active_adapters(self) -> List[str]:
        return [r.adapter['description'] for r in self.readers if r.packets]


class PcapWriter:
    """Classic PCAP (microseconds).  Packets of a different link type are skipped."""

    def __init__(self, path: Path):
        self.path, self.f, self.linktype, self.lock = Path(path), None, None, threading.Lock()

    def write(self, pkt: RawPacket):
        with self.lock:
            if self.f is None:
                self.path.parent.mkdir(parents=True, exist_ok=True)
                self.f = self.path.open('wb')
                self.linktype = pkt.linktype
                self.f.write(struct.pack('<IHHiIII', 0xA1B2C3D4, 2, 4, 0, 0, 65535, pkt.linktype))
            if pkt.linktype != self.linktype:
                return
            sec = int(pkt.ts)
            self.f.write(struct.pack('<IIII', sec, int((pkt.ts - sec) * 1e6), len(pkt.data), len(pkt.data)))
            self.f.write(pkt.data)

    def close(self):
        with self.lock:
            if self.f:
                self.f.close()
                self.f = None


def capture_to_file(path: Path, seconds: float, port: int = GAME_PORT) -> int:
    """Command-line experiment helper: write a PCAP for `seconds`."""
    writer = PcapWriter(path)
    count = [0]

    def on_packet(p):
        writer.write(p)
        count[0] += 1

    cap = LiveCapture(on_packet, port)
    names = cap.start()
    print('Захват на адаптерах:', '; '.join(names))
    t_end = time.time() + seconds
    try:
        while time.time() < t_end:
            time.sleep(1)
            print(f'\r  пакетов: {count[0]}  осталось {int(t_end - time.time())} c   ', end='', flush=True)
    except KeyboardInterrupt:
        print('\nОстановлено пользователем')
    cap.stop()
    writer.close()
    print(f'\nСохранено: {path} ({count[0]} пакетов)')
    return count[0]
