#!/usr/bin/env python3
"""Structural decoder for ArcheAge (Corvus) unit-state records and movement.

PISC - the general integer packing used all over these records
-------------------------------------------------------------
One flag byte followed by up to four little-endian integers.  Value i uses
bits (2*i, 2*i+1) of the flag:

    00 -> 1 byte    01 -> 2 bytes    10 -> 3 bytes    11 -> 4 bytes

Bits of values that are not present must be zero.  This is what the earlier
"COMPACT_16 / FULL_24" layouts and the "low3 width flag" were seeing: the byte
before honor is the PISC flag of a 4-value block [honor, kills, ?, ?].
Code 11 (4 bytes) did not occur in the sample; its width is taken from the
emulator's PacketStream.ReadPisc and is reported as an unverified width.

Unit state = DD04 sub-packet with header  00 ?? EF 00
-------------------------------------------------------
    u24  object id (runtime world object; the same id is used by DD01/0x00AF)
    u16  name length, UTF-8 name (empty for NPCs, mounts, pets)
    ...  player header: u8 0x2A, 3 bytes, u32 character id, 14 bytes,
         u32 x, u32 y, u24 z, f32 scale, u8 level, u8 heir level ...
    ...  equipment, appearance, HP/MP (variable, not parsed here)
    CHARACTER TAIL (parsed here, located by its own structure):
        u8   n_skills, u8 n_buffs, 13 opaque bytes
        n_skills  ascending ids as PISC chunks of min(4, remaining)
        n_buffs   ascending ids as PISC chunks
        i8 rot_x, i8 rot_y, i8 rot_z, u8 race_gender (16*gender + race)
        PISC4  [?, ?, a2, ?]                      (a2 looks like a title id)
        PISC3  [faction, expedition(guild), family]
        PISC4  [PvP honor, PvP kills, ?, ?]       <- the requested values
        u16  flags; bit 8 -> 7 extra bytes follow the next byte
        u8   ?
        [7 bytes if flags & 0x100]
        29 x (u32 ability exp, u8 slot order or 0xFF)
        u8   n_active, n_active ability ids  ( == {index+1 : order != 0xFF} )

The ability block after the PvP block is an independent consistency check that
does not depend on any known name or number.

Nothing here sends traffic; it only parses bytes that were already received.
"""
from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Dict, List, Optional, Tuple

UNIT_STATE_OPCODE = 0x00EF
MOVEMENT_OPCODE = 0x00AF          # DD01
PISC_WIDTHS = (1, 2, 3, 4)
UNVERIFIED_WIDTH_CODE = 3

TAIL_GAP = 13                     # opaque bytes between the two counts and the skill list
ABILITY_SLOTS = 29                # observed in all records of this client version
FLAG_EXT_BIT = 0x0100             # u16 flags bit that adds 7 bytes
FLAG_EXT_LEN = 7
MAX_LIST = 200
MAX_ABILITY_EXP = 50_000_000
PLAYER_KIND_BYTE = 0x2A
UNITS_PER_METER = 512.0           # inferred: legacy 3-byte coords use 1/512 m, speeds fit

RACES = {1: 'нуи', 2: 'фея', 3: 'гном', 4: 'эльф', 5: 'харниец', 6: 'ферре',
         7: 'возрождённый', 8: 'варборн', 9: 'дварф?'}
GENDERS = {1: 'м', 2: 'ж'}


class PiscError(ValueError):
    pass


@dataclass
class Pisc:
    values: List[int]
    widths: List[int]
    flag: int
    start: int
    end: int


def read_pisc(data: bytes, pos: int, count: int) -> Pisc:
    if not 1 <= count <= 4:
        raise PiscError('count')
    if pos >= len(data):
        raise PiscError('eof')
    flag = data[pos]
    if flag >> (2 * count):
        raise PiscError('unused flag bits set')
    q = pos + 1
    values, widths = [], []
    for i in range(count):
        w = PISC_WIDTHS[(flag >> (2 * i)) & 3]
        if q + w > len(data):
            raise PiscError('eof')
        values.append(int.from_bytes(data[q:q + w], 'little'))
        widths.append(w)
        q += w
    return Pisc(values, widths, flag, pos, q)


def read_pisc_list(data: bytes, pos: int, count: int,
                   nonzero: bool = False) -> Tuple[List[int], int, List[Pisc]]:
    """`count` integers written as PISC chunks of min(4, remaining)."""
    values: List[int] = []
    blocks: List[Pisc] = []
    while len(values) < count:
        b = read_pisc(data, pos, min(4, count - len(values)))
        if nonzero and 0 in b.values:
            raise PiscError('zero id in list')
        blocks.append(b)
        values.extend(b.values)
        pos = b.end
    return values, pos, blocks


def encode_pisc(values: List[int]) -> bytes:
    """Inverse of read_pisc (used by tests and for documentation)."""
    flag, body = 0, bytearray()
    for i, v in enumerate(values):
        if v < 0:
            raise ValueError('negative')
        code = 0 if v <= 0xFF else 1 if v <= 0xFFFF else 2 if v <= 0xFFFFFF else 3
        flag |= code << (2 * i)
        body += v.to_bytes(PISC_WIDTHS[code], 'little')
    return bytes([flag]) + bytes(body)


def encode_pisc_list(values: List[int]) -> bytes:
    out = bytearray()
    for i in range(0, len(values), 4):
        out += encode_pisc(values[i:i + 4])
    return bytes(out)


# --------------------------------------------------------------------------- tail

@dataclass
class CharacterTail:
    offset: int                   # offset of n_skills inside the DD04 blob
    gap: int
    skills: List[int]
    buffs: List[int]
    rotation: Tuple[int, int, int]
    race_gender: int
    block_a: List[int]
    faction_id: int
    expedition_id: int
    family_id: int
    pvp_honor: int
    pvp_kills: int
    pvp_extra: List[int]          # two more values of the same PISC block (meaning unknown)
    pvp_widths: List[int]
    pvp_flag: int
    pvp_offset: int               # offset of the PvP PISC flag byte
    flags: int
    ext: Optional[bytes]
    abilities: List[Tuple[int, int]] = field(default_factory=list)
    active_abilities: List[int] = field(default_factory=list)
    tail_confirmed: bool = False
    tail_problem: str = ''
    lists_sorted: bool = True
    end: int = 0

    @property
    def race(self) -> str:
        r, g = self.race_gender & 0x0F, self.race_gender >> 4
        return f"{RACES.get(r, '?')}/{GENDERS.get(g, '?')}"

    @property
    def unverified_width(self) -> bool:
        return 4 in self.pvp_widths


def _race_gender_ok(rg: int) -> bool:
    return (rg >> 4) in GENDERS and 1 <= (rg & 0x0F) <= 9


def _strictly_ascending(vals: List[int]) -> bool:
    return all(a < b for a, b in zip(vals, vals[1:]))


def _abilities_at(data: bytes, pos: int, slots: int):
    """Return (abilities, active, end) or a reason string."""
    if pos + slots * 5 + 1 > len(data):
        return 'eof'
    abil, used = [], set()
    for i in range(slots):
        exp = int.from_bytes(data[pos + 5 * i:pos + 5 * i + 4], 'little')
        order = data[pos + 5 * i + 4]
        if exp > MAX_ABILITY_EXP:
            return 'ability exp out of range'
        if order != 0xFF:
            if order >= 8 or order in used:
                return 'ability order invalid'
            used.add(order)
        abil.append((exp, order))
    q = pos + slots * 5
    n_active = data[q]
    if n_active > 8 or q + 1 + n_active > len(data):
        return 'active count invalid'
    active = list(data[q + 1:q + 1 + n_active])
    expected = {i + 1 for i, (_, o) in enumerate(abil) if o != 0xFF}
    if set(active) != expected or len(active) != len(expected):
        return 'active ability ids do not match slot orders'
    return abil, active, q + 1 + n_active


def try_tail(data: bytes, pos: int, gap: int = TAIL_GAP) -> Optional[CharacterTail]:
    """Parse the character tail assuming n_skills is at `pos`. None if invalid."""
    if pos + 2 + gap >= len(data):
        return None
    n_skills, n_buffs = data[pos], data[pos + 1]
    if not 1 <= n_skills <= MAX_LIST or n_buffs > MAX_LIST:
        return None
    try:
        skills, q, _ = read_pisc_list(data, pos + 2 + gap, n_skills, nonzero=True)
        variants = []
        if n_buffs:
            buffs, q2, _ = read_pisc_list(data, q, n_buffs, nonzero=True)
            variants.append((buffs, q2))
        else:
            variants.append(([], q))
            if q < len(data) and data[q] == 0:
                variants.append(([], q + 1))  # empty list may still carry one flag byte
    except PiscError:
        return None
    fallback = None
    for buffs, q in variants:
        if q + 4 > len(data):
            continue
        rot = tuple(int.from_bytes(data[q + i:q + i + 1], 'little', signed=True) for i in range(3))
        rg = data[q + 3]
        if not _race_gender_ok(rg):
            continue
        try:
            a = read_pisc(data, q + 4, 4)
            b = read_pisc(data, a.end, 3)
            hk = read_pisc(data, b.end, 4)
        except PiscError:
            continue
        r = hk.end
        if r + 3 > len(data):
            continue
        flags = int.from_bytes(data[r:r + 2], 'little')
        r += 3
        ext = None
        if flags & FLAG_EXT_BIT:
            ext = bytes(data[r:r + FLAG_EXT_LEN])
            r += FLAG_EXT_LEN
        tail = CharacterTail(
            offset=pos, gap=gap, skills=skills, buffs=buffs, rotation=rot, race_gender=rg,
            block_a=a.values, faction_id=b.values[0], expedition_id=b.values[1],
            family_id=b.values[2], pvp_honor=hk.values[0], pvp_kills=hk.values[1],
            pvp_extra=hk.values[2:], pvp_widths=hk.widths, pvp_flag=hk.flag,
            pvp_offset=hk.start, flags=flags, ext=ext,
            lists_sorted=_strictly_ascending(skills) and _strictly_ascending(buffs),
            end=r,
        )
        res = _abilities_at(data, r, ABILITY_SLOTS)
        if isinstance(res, str):
            tail.tail_problem = res
            fallback = fallback or tail
            continue
        tail.abilities, tail.active_abilities, tail.end = res
        tail.tail_confirmed = True
        return tail
    return fallback


MAX_TAIL_BEFORE_ABILITIES = 1500  # n_skills..abilities: 15 + lists + ~40 bytes


def ability_block_starts(data: bytes, start: int, end: int) -> List[int]:
    """Cheap pre-filter: positions whose 29 'order' bytes are all 0xFF or < 8."""
    out = []
    span = ABILITY_SLOTS * 5
    for r in range(start, max(start, end - span)):
        orders = data[r + 4:r + span:5]
        if orders.count(0xFF) >= ABILITY_SLOTS - 8 and all(o == 0xFF or o < 8 for o in orders) \
                and not isinstance(_abilities_at(data, r, ABILITY_SLOTS), str):
            out.append(r)
    return out


def find_confirmed_tails(data: bytes, start: int, end: int, gap: int = TAIL_GAP,
                         anchors: Optional[List[int]] = None) -> List[CharacterTail]:
    """Fast path: anchor on ability blocks, then parse the chain that must end there."""
    found: Dict[int, CharacterTail] = {}
    for r in ability_block_starts(data, start, end) if anchors is None else anchors:
        for pos in range(max(start, r - MAX_TAIL_BEFORE_ABILITIES), r - 20):
            if pos in found or not 1 <= data[pos] <= MAX_LIST:
                continue
            t = try_tail(data, pos, gap)
            if t is not None and t.tail_confirmed:
                found[pos] = t
    return [found[p] for p in sorted(found)]


def find_tails(data: bytes, start: int, end: int, gap: int = TAIL_GAP) -> List[CharacterTail]:
    """Exhaustive scan (confirmed and unconfirmed chains), used for diagnostics."""
    out = []
    first_skill = 2 + gap
    for pos in range(start, max(start, end - 40)):
        n = data[pos]
        if not 1 <= n <= MAX_LIST:
            continue
        p = pos + first_skill
        if p >= len(data) or data[p] >> (2 * min(4, n)):
            continue  # quick reject: first skill chunk flag invalid
        t = try_tail(data, pos, gap)
        if t is not None:
            out.append(t)
    return out


# --------------------------------------------------------------------------- records

@dataclass
class UnitRecord:
    blob_offset: int
    obj_id: int
    name: str
    kind_byte: Optional[int]
    char_id: Optional[int] = None
    x: Optional[int] = None
    y: Optional[int] = None
    z: Optional[int] = None
    level: Optional[int] = None
    heir_level: Optional[int] = None
    window_end: int = 0
    status: str = 'NO_PVP_STRUCTURE'
    tail: Optional[CharacterTail] = None
    candidates: List[CharacterTail] = field(default_factory=list)
    note: str = ''

    @property
    def is_player(self) -> bool:
        return bool(self.name) and self.kind_byte == PLAYER_KIND_BYTE

    @property
    def has_values(self) -> bool:
        return self.tail is not None and self.status in ('OK', 'OK_RELAXED_GAP')

    @property
    def honor(self) -> Optional[int]:
        return self.tail.pvp_honor if self.has_values else None

    @property
    def kills(self) -> Optional[int]:
        return self.tail.pvp_kills if self.has_values else None


def _header_at(data: bytes, p: int) -> Optional[Tuple[int, str, int, bool]]:
    """Validate a unit-state header at p (00 ?? EF 00).

    Returns (obj_id, name, name_end, strong).  Random bytes inside equipment or
    other sub-packets also form '00 00 EF 00'; only 'strong' headers (player:
    name + kind byte 0x2A, nameless unit: FF FF right after the empty name) are
    used as record boundaries.
    """
    if p + 9 > len(data) or data[p] != 0 or data[p + 2:p + 4] != b'\xef\x00':
        return None
    obj_id = int.from_bytes(data[p + 4:p + 7], 'little')
    n = int.from_bytes(data[p + 7:p + 9], 'little')
    if obj_id == 0 or n > 64 or p + 9 + n + 2 > len(data):
        return None
    try:
        name = data[p + 9:p + 9 + n].decode('utf-8')
    except UnicodeDecodeError:
        return None
    if n and not (name.isprintable() and name.strip() == name):
        return None
    after = data[p + 9 + n:p + 11 + n]
    strong = after[0] == PLAYER_KIND_BYTE if n else after == b'\xff\xff'
    return obj_id, name, p + 9 + n, strong


def unit_headers(blob: bytes, strong_only: bool = True) -> List[Tuple[int, int, str, int]]:
    out = []
    p = blob.find(b'\xef\x00', 2)
    while p >= 0:
        h = _header_at(blob, p - 2)
        if h and (h[3] or not strong_only):
            out.append((p - 2,) + h[:3])
        p = blob.find(b'\xef\x00', p + 1)
    return out


def parse_unit_states(blob: bytes) -> List[UnitRecord]:
    """All unit-state records in one decompressed DD04 blob (or a DD05 payload)."""
    heads = unit_headers(blob)
    records = []
    for i, (p, obj_id, name, name_end) in enumerate(heads):
        window_end = heads[i + 1][0] if i + 1 < len(heads) else len(blob)
        kind = blob[name_end] if name_end < len(blob) else None
        rec = UnitRecord(p, obj_id, name, kind, window_end=window_end)
        if rec.is_player and name_end + 39 <= len(blob):
            h = name_end
            rec.char_id = int.from_bytes(blob[h + 4:h + 8], 'little')
            rec.x = int.from_bytes(blob[h + 22:h + 26], 'little')
            rec.y = int.from_bytes(blob[h + 26:h + 30], 'little')
            rec.z = int.from_bytes(blob[h + 30:h + 33], 'little')
            scale = blob[h + 33:h + 37]
            if scale == b'\x00\x00\x80\x3f':  # f32 1.0 confirms the fixed header layout
                rec.level, rec.heir_level = blob[h + 37], blob[h + 38]
            else:
                rec.note = 'header layout differs (scale != 1.0); position may be wrong'
        if name:
            _attach_tail(blob, rec, name_end)
        else:
            rec.status = 'NOT_A_CHARACTER'
        records.append(rec)
    return records


def _attach_tail(blob: bytes, rec: UnitRecord, name_end: int) -> None:
    anchors = ability_block_starts(blob, name_end, rec.window_end)
    cands = find_confirmed_tails(blob, name_end, rec.window_end, anchors=anchors)
    relaxed = False
    if not cands and anchors:
        # Fallback 1: tolerate a different opaque gap, still only confirmed tails.
        for gap in range(0, 49):
            if gap != TAIL_GAP:
                cands += find_confirmed_tails(blob, name_end, rec.window_end, gap, anchors)
        relaxed = bool(cands)
    if not cands:
        # Fallback 2: unconfirmed chains, for diagnostics only (no values shown).
        cands = find_tails(blob, name_end, rec.window_end)
    rec.candidates = cands
    strong = [c for c in cands if c.tail_confirmed]
    distinct = {(c.pvp_honor, c.pvp_kills) for c in (strong or cands)}
    if len(strong) == 1:
        rec.tail, rec.status = strong[0], ('OK_RELAXED_GAP' if relaxed else 'OK')
    elif len(strong) > 1:
        rec.status = 'AMBIGUOUS'
        rec.note = f'{len(strong)} confirmed tails, values {sorted(distinct)}'
    elif cands:
        # Pre-PvP chains without the ability-block confirmation are common in
        # unrelated bytes (149 of 164 in login_capture), so no values are given.
        rec.tail = cands[0] if len(cands) == 1 else None
        rec.status = 'UNCONFIRMED'
        rec.note = (f'{len(cands)} unconfirmed tail(s), values {sorted(distinct)}; '
                    f'first problem: {cands[0].tail_problem}')
    else:
        rec.status = 'NO_PVP_STRUCTURE'
        if rec.kind_byte != PLAYER_KIND_BYTE:
            rec.note = f'kind byte {rec.kind_byte!r} is not a player record'


# --------------------------------------------------------------------------- movement

@dataclass
class Movement:
    obj_id: int
    type: int
    time_ms: int
    flags: int
    x: int
    y: int
    z: int
    vx: int
    vy: int
    vz: int


MOVE_SIZE = 36


def _movement(r: bytes) -> Movement:
    s16 = lambda o: int.from_bytes(r[o:o + 2], 'little', signed=True)
    return Movement(int.from_bytes(r[0:3], 'little'), r[3], int.from_bytes(r[4:8], 'little'), r[8],
                    int.from_bytes(r[9:13], 'little'), int.from_bytes(r[13:17], 'little'),
                    int.from_bytes(r[17:20], 'little'), s16(20), s16(22), s16(24))


def parse_movements(payload: bytes) -> Tuple[Optional[List[Movement]], str]:
    """DD01/0x00AF: u16 count + count * 36-byte records.

    Some captures had one extra 5-byte block after a record (seen by the earlier
    v2.3 tool, not in login_capture); it is accepted only if its place is unique.
    """
    if len(payload) < 2:
        return None, 'short'
    n = int.from_bytes(payload[:2], 'little')
    extra = len(payload) - 2 - n * MOVE_SIZE
    if n == 0 or n > 512 or extra not in (0, 5):
        return None, 'layout'
    cuts = [n] if extra == 0 else range(n + 1)
    found = []
    for cut in cuts:
        recs = []
        for j in range(n):
            o = 2 + j * MOVE_SIZE + (5 if j >= cut else 0)
            r = payload[o:o + MOVE_SIZE]
            if len(r) < MOVE_SIZE or r[3] != 1 or r[0:3] == b'\0\0\0':
                break
            recs.append(_movement(r))
        if len(recs) == n:
            found.append(recs)
    if len({tuple(m.obj_id for m in f) for f in found}) == 1:
        return found[0], 'extension' if extra else 'ok'
    return None, 'ambiguous' if found else 'layout'


def distance_m(ax, ay, bx, by, az=None, bz=None) -> float:
    dx, dy = (ax - bx) / UNITS_PER_METER, (ay - by) / UNITS_PER_METER
    dz = 0.0 if az is None or bz is None else (az - bz) / UNITS_PER_METER
    return (dx * dx + dy * dy + dz * dz) ** 0.5


def tail_dict(t: Optional[CharacterTail]) -> Optional[Dict]:
    if t is None:
        return None
    d = asdict(t)
    d['ext'] = t.ext.hex() if t.ext else None
    d['race'] = t.race
    return d
