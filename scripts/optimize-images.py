#!/usr/bin/env python3
"""
Optimiza imágenes a WebP (con downscale opcional) para la web de Premoldeados M.A.

Uso:
    python scripts/optimize-images.py images/gallery-5.jpg
    python scripts/optimize-images.py images/gallery-5.jpg --max-width 1000 --quality 80
    python scripts/optimize-images.py images/*.jpg          # varias de una

Genera un .webp al lado de cada archivo, manteniendo el original como fallback.
Requiere Pillow:  pip install pillow
"""
import argparse
import glob
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Falta Pillow. Instalalo con:  pip install pillow")


def optimize(path, max_width, quality):
    if not os.path.isfile(path):
        print(f"  ✗ no existe: {path}")
        return
    out = os.path.splitext(path)[0] + ".webp"
    im = Image.open(path).convert("RGB")
    w, h = im.size
    if max_width and w > max_width:
        im = im.resize((max_width, round(h * max_width / w)), Image.LANCZOS)
    im.save(out, "WEBP", quality=quality, method=6)
    before = os.path.getsize(path) // 1024
    after = os.path.getsize(out) // 1024
    print(f"  ✓ {out}  {before}KB -> {after}KB  ({im.size[0]}x{im.size[1]})")


def main():
    ap = argparse.ArgumentParser(description="Convierte imágenes a WebP optimizado.")
    ap.add_argument("paths", nargs="+", help="Archivos o patrones (ej: images/*.jpg)")
    ap.add_argument("--max-width", type=int, default=1200,
                    help="Ancho máximo en px; imágenes más anchas se reducen (default 1200)")
    ap.add_argument("--quality", type=int, default=80, help="Calidad WebP 0-100 (default 80)")
    args = ap.parse_args()

    files = []
    for p in args.paths:
        files.extend(glob.glob(p))
    if not files:
        sys.exit("No se encontraron archivos.")

    print(f"Optimizando {len(files)} imagen(es)...")
    for f in files:
        optimize(f, args.max_width, args.quality)
    print("Listo.")


if __name__ == "__main__":
    main()
