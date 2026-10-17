#!/usr/bin/env python3
"""Prime-time killcount from two scanner snapshots.

Workflow: at the start of prime and again at the end a person opens the
scanner on the character select screen, enters the location and presses
«Сканировать рядом».  Each press writes a snapshot (snapshots/*.json).  The
killcount is end - start for every player present in both snapshots, in the
JSON format that the site accepts in «Киллкаунт → Добавить вручную».  Rows carry
the three tree ids (`specs`); the site keeps only its own users whose role for
that build is a DPS role (src/shared/config/killcountRoles.ts).

Players are matched by the persistent character id from the unit state
(falls back to the name when an id is missing), so a rename during prime does
not split a player in two.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

SNAPSHOT_FORMAT = 'corvus-snapshot/1'
STALE_START_S = 600   # start record older than this: kills made before the scan may be counted


def snapshot_from(snap: Dict, source: str, taken_at: Optional[datetime] = None) -> Dict:
    """Build a snapshot document from WorldTracker.snapshot(...) output.

    Every player with decoded PvP values is kept (not only the ones inside the
    radius shown on screen): values come from the unit state received when the
    player appeared, `record_age_s` says how old they are.
    """
    taken_at = taken_at or datetime.now().astimezone()
    me = next((r for r in snap['rows'] if r['is_me']), None)
    players = [{
        'name': r['name'], 'char_id': r['char_id'], 'obj_id': r['obj_id'],
        'honor': r['honor'], 'kills': r['kills'],
        'class': r['class'], 'class_certain': r['class_certain'], 'specs': r['class_specs'],
        'guild_id': r['guild_id'], 'presence': r['presence'],
        'distance_m': r['distance_m'], 'record_age_s': r['record_age_s'],
        'record_at': None if r['record_age_s'] is None else
        (taken_at - timedelta(seconds=r['record_age_s'])).isoformat(timespec='seconds'),
    } for r in snap['rows'] if r['honor'] is not None and r['kills'] is not None]
    return {
        'format': SNAPSHOT_FORMAT,
        'taken_at': taken_at.isoformat(timespec='seconds'),
        'source': source,
        'me': None if me is None else {'name': me['name'], 'char_id': me['char_id'], 'guild_id': me['guild_id']},
        'players': players,
    }


def save_snapshot(doc: Dict, folder: Path) -> Path:
    folder.mkdir(parents=True, exist_ok=True)
    stamp = datetime.fromisoformat(doc['taken_at']).strftime('%Y-%m-%d_%H-%M-%S')
    path = folder / f'snapshot_{stamp}.json'
    n = 1
    while path.exists():
        n += 1
        path = folder / f'snapshot_{stamp}_{n}.json'
    path.write_text(json.dumps(doc, ensure_ascii=False, indent=1), encoding='utf-8')
    return path


def load_snapshot(path: Path) -> Dict:
    doc = json.loads(Path(path).read_text(encoding='utf-8'))
    if doc.get('format') != SNAPSHOT_FORMAT:
        raise ValueError(f'{Path(path).name}: это не снимок сканера ({SNAPSHOT_FORMAT})')
    return doc


def list_snapshots(folder: Path) -> List[Path]:
    return sorted(folder.glob('snapshot_*.json')) if folder.is_dir() else []


@dataclass
class KillcountResult:
    rows: List[Dict]                      # site format, sorted by kills
    only_start: List[str] = field(default_factory=list)
    only_end: List[str] = field(default_factory=list)
    stale_end: List[str] = field(default_factory=list)
    other_guild: int = 0
    warnings: List[str] = field(default_factory=list)
    guild_id: Optional[int] = None

    def site_json(self) -> str:
        """One line: the site field is a single-line input."""
        return json.dumps(self.rows, ensure_ascii=False, separators=(',', ':'))


def _key(p: Dict) -> str:
    return f"c{p['char_id']}" if p.get('char_id') else f"n{p['name']}"


def _record_time(doc: Dict, p: Dict) -> Optional[datetime]:
    """When the unit state behind these values was received."""
    if p.get('record_at'):
        return datetime.fromisoformat(p['record_at'])
    if p.get('record_age_s') is not None:
        return datetime.fromisoformat(doc['taken_at']) - timedelta(seconds=p['record_age_s'])
    return None


def _age(p: Dict) -> float:
    return p['record_age_s'] if p.get('record_age_s') is not None else float('inf')


def _class_name(p: Dict) -> str:
    # The site stores plain text; '?' (tree not confirmed) is only for the scanner UI.
    return (p.get('class') or '').rstrip('?')


def build_killcount(start: Dict, end: Dict, only_my_guild: bool = True) -> KillcountResult:
    res = KillcountResult(rows=[])
    if datetime.fromisoformat(end['taken_at']) < datetime.fromisoformat(start['taken_at']):
        start, end = end, start
        res.warnings.append('Снимки были выбраны в обратном порядке — поменяла местами.')
    me = end.get('me') or start.get('me') or {}
    guild = me.get('guild_id') if only_my_guild else None
    if only_my_guild and not guild:
        res.warnings.append('Гильдия сканирующего неизвестна (или 0) — фильтр по гильдии не применён.')
        guild = None
    res.guild_id = guild

    skipped = set()

    def members(doc):
        out = {}
        for p in doc['players']:
            if guild is not None and p.get('guild_id') != guild:
                skipped.add(_key(p))
                continue
            k = _key(p)
            # The same character twice (re-login gave it a new object id): the
            # freshest unit state is the one with current values.
            if k not in out or _age(p) < _age(out[k]):
                out[k] = p
        return out

    a, b = members(start), members(end)
    res.other_guild = len(skipped)
    # A character seen with an id in one snapshot and only by name in the other.
    # Two different ids are two different characters, even with the same name.
    by_name_a = {p['name']: k for k, p in a.items()}
    for k, p in list(b.items()):
        t = by_name_a.get(p['name'])
        if k not in a and t and t not in b and (k[0] == 'n') != (t[0] == 'n'):
            b[t] = b.pop(k)

    start_at = datetime.fromisoformat(start['taken_at'])
    old_start = sorted(p['name'] for p in a.values() if _age(p) > STALE_START_S)
    if old_start:
        res.warnings.append(f'Анкеты в начале старше {STALE_START_S // 60} мин (перед сканом начала стоило '
                            'перезайти в мир) — в разницу могут попасть убийства до начала прайма: '
                            + ', '.join(old_start))
    for k in sorted(set(a) & set(b), key=lambda k: b[k]['name']):
        s, e = a[k], b[k]
        e_at = _record_time(end, e)
        if e_at is not None and e_at <= start_at:
            res.stale_end.append(e['name'])   # values from before the prime, not the end
            continue
        notes = []
        if s['name'] != e['name']:
            notes.append(f"был ник {s['name']}")
        cs, ce = _class_name(s), _class_name(e)
        if cs and ce and cs != ce:
            notes.append(f'класс в начале: {cs}')
        dk, dh = e['kills'] - s['kills'], e['honor'] - s['honor']
        if dk < 0 or dh < 0:
            res.warnings.append(f"{e['name']}: значения уменьшились (убийства {dk:+}, честь {dh:+}) — проверь снимки")
        row = {'id': 0, 'userName': e['name'], 'playerClass': ce,
               'startHonor': s['honor'], 'endHonor': e['honor'],
               'startKills': s['kills'], 'endKills': e['kills']}
        if e.get('specs'):
            row['specs'] = e['specs']        # lets the site pick the role slot (Милик/Лук/Маг/...)
        if s['name'] != e['name']:
            row['aliases'] = [s['name']]       # the site may still know the old name
        if notes:
            row['comment'] = '; '.join(notes)
        res.rows.append(row)
    res.rows.sort(key=lambda r: (-(r['endKills'] - r['startKills']), -(r['endHonor'] - r['startHonor']),
                                 r['userName']))
    for i, r in enumerate(res.rows, 1):
        r['id'] = i
    res.stale_end.sort()
    res.only_start = sorted(a[k]['name'] for k in set(a) - set(b))
    res.only_end = sorted(b[k]['name'] for k in set(b) - set(a))
    return res


def describe(res: KillcountResult, start: Dict, end: Dict) -> str:
    lines = [f"Начало: {start['taken_at']}  ({len(start['players'])} игроков в снимке)",
             f"Конец:  {end['taken_at']}  ({len(end['players'])} игроков в снимке)",
             f"Гильдия: {res.guild_id if res.guild_id is not None else 'все'}"
             + (f"; других гильдий пропущено: {res.other_guild}" if res.other_guild else ''),
             f"В киллкаунт попадают: {len(res.rows)}"]
    for r in res.rows:
        lines.append(f"  {r['userName']:16s} убийства +{r['endKills'] - r['startKills']:<5} "
                     f"честь +{r['endHonor'] - r['startHonor']:<8} {r['playerClass']}"
                     + (f"  ({r['comment']})" if r.get('comment') else ''))
    if res.only_start:
        lines.append('Только в начале (нет в конце, не посчитаны): ' + ', '.join(res.only_start))
    if res.stale_end:
        lines.append('Нет свежей анкеты в конце (анкета получена ещё до начала прайма; перед сканом конца '
                     'нужно перезайти в мир), не посчитаны: ' + ', '.join(res.stale_end))
    if res.only_end:
        lines.append('Только в конце (нет в начале, не посчитаны): ' + ', '.join(res.only_end))
    lines += [f'ВНИМАНИЕ: {w}' for w in res.warnings]
    return '\n'.join(lines)
