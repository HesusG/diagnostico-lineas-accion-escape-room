#!/usr/bin/env python3
"""
Script para redimensionar las imágenes de furniture a los tamaños finales del juego.
Usa nearest neighbor para preservar los píxeles nítidos del pixel art.
"""

from PIL import Image
from pathlib import Path

FURNITURE_DIR = Path(__file__).parent.parent / "images/furniture"

# Tamaños finales para cada imagen (según IMAGE_PROMPTS.md)
SIZES = {
    "plant": (32, 32),
    "couch": (48, 32),
    "candle": (32, 32),
    "shield": (32, 32),
    "vase": (32, 32),
    "filing-cabinet": (32, 48),
    "cobweb": (32, 32),
    "crate": (32, 32),
    "scroll-decor": (32, 32),
    "alembic": (32, 48),
    "test-tube": (32, 32),
    "ruler": (32, 32),
    "microscope": (32, 48),
    "telescope": (48, 48),
    "dna-helix": (32, 48),
    "abacus": (48, 32),
    "painting": (48, 48),
    "palette": (32, 32),
    "crown": (32, 32),
    "briefcase": (32, 32),
    "trophy": (32, 48),
    "chair": (32, 32),
    "swords": (48, 48),
    "bookshelf": (48, 48),
    "open-book": (32, 32),
    "castle-ornament": (48, 48),
}

def resize_images():
    print("🔧 Redimensionando imágenes de furniture...")
    print(f"   Directorio: {FURNITURE_DIR}\n")

    resized = 0
    skipped = 0

    for img_path in FURNITURE_DIR.glob("*.png"):
        name = img_path.stem

        if name not in SIZES:
            print(f"   ⚠️  {name}.png - tamaño no definido, usando 32x32")
            target_size = (32, 32)
        else:
            target_size = SIZES[name]

        # Cargar imagen
        img = Image.open(img_path)

        # Verificar si ya tiene el tamaño correcto
        if img.size == target_size:
            print(f"   ⏭️  {name}.png - ya tiene tamaño {target_size}")
            skipped += 1
            continue

        # Convertir a RGBA si no lo es
        if img.mode != 'RGBA':
            img = img.convert('RGBA')

        # Redimensionar con nearest neighbor
        resized_img = img.resize(target_size, Image.Resampling.NEAREST)

        # Guardar (sobrescribir)
        resized_img.save(img_path, 'PNG')
        print(f"   ✅ {name}.png: {img.size} → {target_size}")
        resized += 1

    print(f"\n✨ Listo!")
    print(f"   Redimensionadas: {resized}")
    print(f"   Sin cambios: {skipped}")

if __name__ == "__main__":
    resize_images()
