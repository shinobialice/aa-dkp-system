#!/usr/bin/env python3
"""Program icons from the site logo: corvus.ico (exe, shortcut, installer) and
corvus.png (window icon).  Needs Pillow; used only when building the installer.

    python packaging/make_icons.py ../../public/images/logo.png build
"""
import sys
from pathlib import Path

from PIL import Image

SIZES = [16, 20, 24, 32, 40, 48, 64, 128, 256]


def main(logo: str, out_dir: str) -> None:
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    img = Image.open(logo).convert('RGBA')
    side = max(img.size)
    square = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    square.paste(img, ((side - img.width) // 2, (side - img.height) // 2))
    square.resize((256, 256), Image.LANCZOS).save(out / 'corvus.ico', sizes=[(s, s) for s in SIZES])
    square.resize((64, 64), Image.LANCZOS).save(out / 'corvus.png')
    print(f'{out / "corvus.ico"}, {out / "corvus.png"}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
