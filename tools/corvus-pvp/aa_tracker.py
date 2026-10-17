#!/usr/bin/env python3
"""World view state built only from received messages.

Evidence used (all measured on login_capture.pcap):
  * 0x00EF unit state inside DD04 = the unit entered the client's view
    (sent once per appearance: world entry, teleport, or walking into range);
  * DD01/0x00AF movement: every unit in view gets a record at least every
    3.0 s even when standing still (stationary players: gaps 2.99-3.05 s);
  * the own character gets the same movement records, so distances can be
    computed from the same coordinates.

A unit whose 3-second heartbeat has stopped is shown as 'ушёл?' - the explicit
despawn message was not present in the 21.7 s login capture, see `discover`.
"""
from __future__ import annotations

import threading
from dataclasses import dataclass, field
from typing import Dict, List, Optional

from aa_capture import GameMessage
from aa_classes import class_info
from aa_unitstate import (MOVEMENT_OPCODE, UNIT_STATE_OPCODE, UnitRecord, distance_m,
                          parse_movements, parse_unit_states)

HEARTBEAT_S = 3.0
PRESENT_S = 7.5          # 2.5 heartbeats: tolerate one lost/late update
WORLD_ENTRY_SUBPACKETS = 40


@dataclass
class Entity:
    obj_id: int
    name: str = ''
    is_player: bool = False
    record: Optional[UnitRecord] = None
    first_seen: float = 0.0
    state_ts: Optional[float] = None
    move_ts: Optional[float] = None
    moves: int = 0
    x: Optional[int] = None
    y: Optional[int] = None
    z: Optional[int] = None
    history: List[tuple] = field(default_factory=list)   # (ts, honor, kills)


class WorldTracker:
    def __init__(self, me_name: Optional[str] = None):
        self.me_name = (me_name or '').strip() or None
        self.me_obj: Optional[int] = None
        self.me_char_id: Optional[int] = None
        self.me_how = ''
        self.entities: Dict[int, Entity] = {}
        self.last_ts = 0.0
        self.lock = threading.RLock()
        self.counts = {'unit_state_records': 0, 'player_records': 0, 'pvp_ok': 0,
                       'pvp_unresolved': 0, 'movement_records': 0, 'movement_bad_layout': 0}

    # ------------------------------------------------------------- input
    def feed(self, msg: GameMessage) -> List[UnitRecord]:
        if msg.status != 'ok':
            return []
        with self.lock:
            self.last_ts = max(self.last_ts, msg.ts)
            if msg.kind == 4:
                return self._on_states(msg.ts, parse_unit_states(msg.payload), msg.subpacket_count or 0)
            if msg.kind == 5 and msg.opcode == UNIT_STATE_OPCODE:
                # Not observed yet: a lone unit state sent outside DD04.
                return self._on_states(msg.ts, parse_unit_states(b'\x00\x00\xef\x00' + msg.payload), 1)
            if msg.kind == 1 and msg.opcode == MOVEMENT_OPCODE:
                moves, status = parse_movements(msg.payload)
                if moves is None:
                    self.counts['movement_bad_layout'] += 1
                    return []
                for m in moves:
                    e = self._entity(m.obj_id, msg.ts)
                    e.move_ts, e.moves = msg.ts, e.moves + 1
                    e.x, e.y, e.z = m.x, m.y, m.z
                    self.counts['movement_records'] += 1
        return []

    def _entity(self, obj_id: int, ts: float) -> Entity:
        e = self.entities.get(obj_id)
        if e is None:
            e = self.entities[obj_id] = Entity(obj_id, first_seen=ts)
        return e

    def _on_states(self, ts: float, records: List[UnitRecord], subpackets: int) -> List[UnitRecord]:
        for r in records:
            self.counts['unit_state_records'] += 1
            e = self._entity(r.obj_id, ts)
            e.state_ts, e.name = ts, r.name
            if not r.is_player:
                continue
            self.counts['player_records'] += 1
            e.is_player, e.record = True, r
            if r.x is not None:
                e.x, e.y, e.z = r.x, r.y, r.z
            if r.has_values:
                self.counts['pvp_ok'] += 1
                if not e.history or e.history[-1][1:] != (r.honor, r.kills):
                    e.history.append((ts, r.honor, r.kills))
            else:
                self.counts['pvp_unresolved'] += 1
            if self.me_name and r.name == self.me_name:
                self.me_obj, self.me_how = r.obj_id, 'по нику из настроек'
            elif not self.me_name and self.me_obj is None and subpackets >= WORLD_ENTRY_SUBPACKETS:
                self.me_obj, self.me_how = r.obj_id, f'авто: запись входа в мир ({subpackets} подпакетов)'
                self.me_char_id = r.char_id
            elif not self.me_name and r.char_id is not None and r.char_id == self.me_char_id:
                self.me_obj = r.obj_id   # re-entered the world: same character, new object id
        return records

    # ------------------------------------------------------------- output
    def snapshot(self, now: Optional[float] = None, radius_m: Optional[float] = None,
                 include_stale: bool = True) -> Dict:
        with self.lock:
            now = self.last_ts if now is None else now
            me = self.entities.get(self.me_obj) if self.me_obj is not None else None
            rows, unnamed_fresh = [], 0
            for e in self.entities.values():
                fresh = e.move_ts is not None and now - e.move_ts <= PRESENT_S
                just_spawned = (e.state_ts is not None and now - e.state_ts <= PRESENT_S
                                and (e.move_ts is None or e.move_ts < e.state_ts))
                if not e.is_player:
                    if fresh and e.state_ts is None:
                        unnamed_fresh += 1   # loaded before the capture started
                    continue
                if fresh:
                    presence = 'рядом'
                elif just_spawned:
                    presence = 'появился'
                else:
                    presence = 'ушёл?'
                    if not include_stale:
                        continue
                dist = None
                if me is not None and me.x is not None and e.x is not None:
                    dist = distance_m(e.x, e.y, me.x, me.y)
                if radius_m is not None and dist is not None and dist > radius_m and e.obj_id != self.me_obj:
                    continue
                r = e.record
                last = max(t for t in (e.move_ts, e.state_ts) if t is not None)
                cls = class_info(r.tail.active_abilities) if r and r.has_values else None
                rows.append({
                    'obj_id': e.obj_id, 'name': e.name, 'is_me': e.obj_id == self.me_obj,
                    'char_id': r.char_id if r else None,
                    'honor': r.honor if r else None, 'kills': r.kills if r else None,
                    'pvp_status': r.status if r else 'NO_RECORD',
                    'guild_id': r.tail.expedition_id if r and r.has_values else None,
                    'family_id': r.tail.family_id if r and r.has_values else None,
                    'faction_id': r.tail.faction_id if r and r.has_values else None,
                    'race': r.tail.race if r and r.has_values else None,
                    'class': cls.label if cls else None,
                    'class_trees': ' + '.join(cls.trees) if cls else None,
                    'class_certain': cls.certain if cls else False,
                    'class_specs': cls.slugs if cls and len(cls.slugs) == 3 else None,
                    'level': r.level if r else None, 'heir_level': r.heir_level if r else None,
                    'distance_m': None if dist is None else round(dist, 1),
                    'presence': presence, 'seen_ago_s': round(now - last, 1),
                    'record_age_s': round(now - e.state_ts, 1) if e.state_ts is not None else None,
                    'stats_changed': len(e.history) > 1,
                })
            newest: Dict[int, dict] = {}
            for row in rows:
                cid = row['char_id']
                if cid is None:
                    continue
                cur = newest.get(cid)
                if cur is None or (row['record_age_s'] or 0) < (cur['record_age_s'] or 0):
                    newest[cid] = row
            # Re-login gives a character a new object id; show it once, newest record.
            rows = [row for row in rows if row['char_id'] is None or newest[row['char_id']] is row]
            rows.sort(key=lambda x: (not x['is_me'], x['presence'] != 'рядом',
                                     x['distance_m'] if x['distance_m'] is not None else 1e9, x['name']))
            return {'now': now, 'me_obj': self.me_obj, 'me_how': self.me_how,
                    'rows': rows, 'unnamed_in_view': unnamed_fresh, 'counts': dict(self.counts)}
