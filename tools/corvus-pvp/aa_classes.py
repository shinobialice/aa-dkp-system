#!/usr/bin/env python3
"""Class (3 active skill trees) from the ability block of a character record.

The unit-state tail ends with 29 ability slots and the ids of the 3 active
abilities (see aa_unitstate.py).  The class name is the combination of those
three trees; RU names come from the site table (aa_class_names.json, a copy of
src/widgets/profile/archetype/classCombinations.ts made by sync_class_names.py).

ABILITY_TREES maps the packet ability id to the site's tree slug.  `status`
says how each id was established; anything but 'confirmed' is shown with '?'.
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple

HERE = Path(__file__).resolve().parent

# ability id -> (site slug, RU tree name, internal enum name, status)
ABILITY_TREES: Dict[int, Tuple[str, str, str, str]] = {
    1: ('napadenie', 'Нападение', 'Fight', 'pending'),
    2: ('gipnoz', 'Гипноз', 'Illusion', 'pending'),
    3: ('oborona', 'Оборона', 'Adamant', 'pending'),
    4: ('soprotivlenie', 'Сопротивление', 'Will', 'pending'),
    5: ('misticizm', 'Мистицизм', 'Death', 'pending'),
    6: ('presledovanie', 'Преследование', 'Wild', 'pending'),
    7: ('volshebstvo', 'Волшебство', 'Magic', 'pending'),
    8: ('skritnost', 'Скрытность', 'Vocation', 'pending'),
    9: ('voodush', 'Воодушевление', 'Romance', 'pending'),
    10: ('isceleine', 'Исцеление', 'Love', 'pending'),
    11: ('gnev', 'Гнев', 'Hatred', 'pending'),
    12: ('kovarstvo', 'Коварство', 'Assassin', 'pending'),
    13: ('strelba', 'Стрельба', 'Madness', 'pending'),
    14: ('tanec', 'Танец', 'Pleasure', 'pending'),
}


def _load_names() -> Dict[str, str]:
    try:
        return json.loads((HERE / 'aa_class_names.json').read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return {}


CLASS_NAMES = _load_names()


@dataclass
class ClassInfo:
    ability_ids: List[int]
    trees: List[str]            # RU tree names, '?' for unknown ids
    name: Optional[str]         # RU class name, None if not determinable
    certain: bool               # every id 'confirmed' and the name found

    @property
    def label(self) -> str:
        if self.name:
            return self.name if self.certain else self.name + '?'
        return ' + '.join(self.trees) if self.trees else '—'


def class_info(active: List[int]) -> ClassInfo:
    trees, slugs, certain = [], [], True
    for a in sorted(active):
        t = ABILITY_TREES.get(a)
        if t is None:
            trees.append(f'?{a}')
            certain = False
            continue
        slugs.append(t[0])
        trees.append(t[1])
        certain &= t[3] == 'confirmed'
    name = None
    if len(slugs) == 3 and len(set(slugs)) == 3:
        name = CLASS_NAMES.get('+'.join(sorted(slugs)))
    return ClassInfo(sorted(active), trees, name, certain and name is not None)
