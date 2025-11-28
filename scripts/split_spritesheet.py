#!/usr/bin/env python3
"""
Script para separar el sprite sheet de adornos en imágenes individuales.
"""

from PIL import Image
from pathlib import Path

# Ruta del sprite sheet
SPRITESHEET_PATH = Path(__file__).parent.parent / "images/objects/ChatGPT Image Nov 27, 2025, 08_33_00 AM.png"
OUTPUT_DIR = Path(__file__).parent.parent / "images/furniture"

# Configuración del sprite sheet (4 columnas x 6 filas = 24 sprites)
COLS = 4
ROWS = 6

# Nombres de los sprites en orden (izquierda a derecha, arriba a abajo)
SPRITE_NAMES = [
    # Fila 1
    "plant",           # 🪴 Planta
    "couch",           # 🛋️ Sofá
    "shield",          # 🛡️ Escudo
    "vase",            # 🏺 Jarrón
    # Fila 2
    "filing-cabinet",  # 🗄️ Archivero
    "cobweb",          # 🕸️ Telaraña
    "crate",           # 📦 Caja
    "alembic",         # ⚗️ Matraz
    # Fila 3
    "ruler",           # 📐 Regla
    "palette",         # 🎨 Paleta (parece estar aquí)
    "microscope",      # 🔬 Microscopio
    "telescope",       # 🔭 Telescopio
    # Fila 4
    "abacus",          # 🧮 Ábaco
    "test-tube",       # 🧪 Tubo de ensayo (paleta?)
    "crown",           # 👑 Corona
    "dna-helix",       # 🧬 ADN
    # Fila 5
    "trophy",          # 🏆 Trofeo
    "scroll-decor",    # 📜 Pergamino
    "candle",          # 🕯️ Vela/Candelabro
    "briefcase",       # 💼 Maletín
    # Fila 6
    "chair",           # 🪑 Silla
    "swords",          # ⚔️ Espadas
    "painting",        # 🖼️ Cuadro
    "castle-ornament", # 🏰 Castillo
]

def split_spritesheet():
    # Crear directorio de salida
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Cargar sprite sheet
    print(f"📂 Cargando: {SPRITESHEET_PATH}")
    img = Image.open(SPRITESHEET_PATH)

    # Convertir a RGBA si no lo es
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    width, height = img.size
    print(f"   Tamaño: {width}x{height}")

    # Calcular tamaño de cada sprite
    sprite_width = width // COLS
    sprite_height = height // ROWS
    print(f"   Tamaño de sprite: {sprite_width}x{sprite_height}")
    print(f"   Grid: {COLS}x{ROWS} = {COLS * ROWS} sprites")

    # Extraer cada sprite
    print(f"\n🔪 Separando sprites...")

    for row in range(ROWS):
        for col in range(COLS):
            idx = row * COLS + col
            if idx >= len(SPRITE_NAMES):
                break

            name = SPRITE_NAMES[idx]

            # Calcular coordenadas
            left = col * sprite_width
            top = row * sprite_height
            right = left + sprite_width
            bottom = top + sprite_height

            # Recortar sprite
            sprite = img.crop((left, top, right, bottom))

            # Guardar
            output_path = OUTPUT_DIR / f"{name}.png"
            sprite.save(output_path, 'PNG')
            print(f"   ✅ {name}.png ({sprite_width}x{sprite_height})")

    print(f"\n✨ Listo! {len(SPRITE_NAMES)} sprites guardados en {OUTPUT_DIR}")

if __name__ == "__main__":
    split_spritesheet()
