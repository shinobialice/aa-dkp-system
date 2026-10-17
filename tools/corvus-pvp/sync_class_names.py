#!/usr/bin/env python3
"""Copy the RU class-name table from the site into the scanner folder.

Source of truth: src/widgets/profile/archetype/classCombinations.ts (keys are
the three tree slugs sorted and joined with '+').  The scanner keeps its own
copy (aa_class_names.json) so the folder works when copied out of the repo.

    py -3 sync_class_names.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parent.parent / 'src' / 'widgets' / 'profile' / 'archetype' / 'classCombinations.ts'
TARGET = HERE / 'aa_class_names.json'
ENTRY = re.compile(r'^\s*"([a-z]+\+[a-z]+\+[a-z]+)":\s*"([^"]+)",', re.M)


def read_ts(path: Path = SOURCE) -> dict:
    return dict(ENTRY.findall(path.read_text(encoding='utf-8')))


def main() -> int:
    table = read_ts()
    if len(table) != 364:
        print(f'Ожидалось 364 сочетания, найдено {len(table)} - файл изменился?', file=sys.stderr)
        return 1
    TARGET.write_text(json.dumps(dict(sorted(table.items())), ensure_ascii=False, indent=1) + '\n',
                      encoding='utf-8')
    print(f'{TARGET.name}: {len(table)} классов')
    return 0


if __name__ == '__main__':
    sys.exit(main())
