#!/usr/bin/env python3
"""Receive-only capture through the Windows built-in raw socket (SIO_RCVALL).

Needs no Npcap, only administrator rights (the installed scanner asks for them
at start).  One socket per local IPv4 address; each receives every IP packet of
that interface, and only TCP packets from/to the game port are passed on, as
raw IPv4 (link type 101) so the normal decoder handles them.

Windows Firewall can hide incoming packets from raw sockets unless the program
is allowed inbound; the installer adds that rule.  Nothing is sent.
"""
from __future__ import annotations

import os
import socket
import threading
import time
from typing import Callable, List

from aa_capture import GAME_PORT, RawPacket

RAW_IPV4 = 101
RECV_BUFFER = 16 * 1024 * 1024


def available() -> bool:
    return os.name == 'nt' and hasattr(socket, 'SIO_RCVALL')


def local_ipv4() -> List[str]:
    ips = set()
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(('192.0.2.1', 9))      # route lookup only, no packet is sent
            ips.add(s.getsockname()[0])
    except OSError:
        pass
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ips.add(info[4][0])
    except OSError:
        pass
    return sorted(ip for ip in ips if not ip.startswith(('127.', '169.254.', '0.')))


def _game_tcp(data: bytes, port: int) -> bool:
    if len(data) < 24 or data[0] >> 4 != 4 or data[9] != 6:
        return False
    ihl = (data[0] & 15) * 4
    if len(data) < ihl + 4:
        return False
    sport = int.from_bytes(data[ihl:ihl + 2], 'big')
    dport = int.from_bytes(data[ihl + 2:ihl + 4], 'big')
    return sport == port or dport == port


class RawSocketCapture:
    """Same interface as npcap_live.LiveCapture."""

    def __init__(self, on_packet: Callable[[RawPacket], None], port: int = GAME_PORT,
                 on_error: Callable[[str], None] = print):
        self.on_packet, self.port, self.on_error = on_packet, port, on_error
        self.stop_event = threading.Event()
        self.sockets: List[socket.socket] = []
        self.threads: List[threading.Thread] = []
        self.counts = {}

    def start(self) -> List[str]:
        if not available():
            raise RuntimeError('Встроенный захват Windows недоступен в этой системе.')
        opened, errors = [], []
        for ip in local_ipv4():
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_IP)
                s.bind((ip, 0))
                s.setsockopt(socket.IPPROTO_IP, socket.IP_HDRINCL, 1)
                s.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, RECV_BUFFER)
                s.ioctl(socket.SIO_RCVALL, socket.RCVALL_ON)
                s.settimeout(0.5)
            except OSError as e:
                errors.append(f'{ip}: {e}')
                continue
            self.sockets.append(s)
            self.counts[ip] = 0
            t = threading.Thread(target=self._read, args=(s, ip), daemon=True, name=f'rawsock-{ip}')
            t.start()
            self.threads.append(t)
            opened.append(f'встроенный захват Windows ({ip})')
        if not opened:
            hint = ' Запусти программу от имени администратора.' if any('10013' in e for e in errors) else ''
            raise RuntimeError('Не удалось открыть встроенный захват Windows: ' + '; '.join(errors or ['нет адресов IPv4'])
                               + hint)
        return opened

    def _read(self, s: socket.socket, ip: str):
        while not self.stop_event.is_set():
            try:
                data = s.recv(65535)
            except socket.timeout:
                continue
            except OSError as e:
                if not self.stop_event.is_set():
                    self.on_error(f'{ip}: {e}')
                return
            if _game_tcp(data, self.port):
                self.counts[ip] += 1
                self.on_packet(RawPacket(time.time(), RAW_IPV4, data))

    def stop(self):
        self.stop_event.set()
        for s in self.sockets:
            try:
                s.ioctl(socket.SIO_RCVALL, socket.RCVALL_OFF)
            except OSError:
                pass
            s.close()
        for t in self.threads:
            t.join(timeout=2)

    def active_adapters(self) -> List[str]:
        return [ip for ip, n in self.counts.items() if n]


def start_any_capture(on_packet, port: int = GAME_PORT, on_error=print):
    """Npcap if it is installed, otherwise the built-in Windows raw socket.

    Returns (capture, adapter_names).
    """
    problems = []
    try:
        from npcap_live import LiveCapture, load_npcap
        load_npcap()
        cap = LiveCapture(on_packet, port, on_error)
        return cap, cap.start()
    except Exception as e:  # no Npcap: fall back to the raw socket
        problems.append(f'Npcap: {e}')
    try:
        cap = RawSocketCapture(on_packet, port, on_error)
        return cap, cap.start()
    except Exception as e:
        problems.append(str(e))
    raise RuntimeError(' | '.join(problems))
