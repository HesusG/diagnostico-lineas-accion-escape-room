#!/usr/bin/env python3
"""
Script para generar imágenes del juego usando DALL-E 2 API.
Incluye remoción de fondo y redimensionado.

Uso:
    python generate_images.py --dry-run          # Ver qué generaría sin gastar
    python generate_images.py                     # Generar todas las imágenes
    python generate_images.py --category furniture # Solo una categoría
    python generate_images.py --force             # Sobrescribir existentes

Requisitos:
    pip install openai pillow rembg requests
    export OPENAI_API_KEY="sk-..."
"""

import os
import sys
import argparse
import requests
from pathlib import Path
from io import BytesIO

try:
    from openai import OpenAI
except ImportError:
    print("Error: openai no instalado. Ejecuta: pip install openai")
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow no instalado. Ejecuta: pip install pillow")
    sys.exit(1)

try:
    from rembg import remove
except ImportError:
    print("Advertencia: rembg no instalado. No se podrá remover fondos.")
    print("Instalar con: pip install rembg")
    remove = None

# Directorio base (relativo al script)
BASE_DIR = Path(__file__).parent.parent
IMAGES_DIR = BASE_DIR / "images"

# Cargar variables de entorno desde .env si existe
ENV_PATH = BASE_DIR / '.env'
if ENV_PATH.exists():
    with open(ENV_PATH) as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                os.environ[key] = value

# Costo por imagen DALL-E 2
COST_PER_IMAGE = 0.018  # USD para 512x512

# ============================================
# CATÁLOGO DE IMÁGENES
# ============================================

IMAGES = {
    "furniture": {
        "plant": {
            "prompt": "Pixel art potted plant, 16-bit SNES style. Green leafy plant in decorative clay pot. Medieval fantasy style planter. Solid color background. Top-down 3/4 view. Color palette: various greens, terracotta pot, soil brown. Clean pixels, no anti-aliasing.",
            "size": (32, 32),
            "transparent": True
        },
        "couch": {
            "prompt": "Pixel art medieval couch or settee, 16-bit SNES style. Ornate wooden frame with red velvet cushions. Royal elegant design. Solid color background. Top-down 3/4 view. Color palette: dark wood, deep red velvet, gold trim. Clean pixels.",
            "size": (48, 32),
            "transparent": True
        },
        "candle": {
            "prompt": "Pixel art candelabra with lit candles, 16-bit SNES style. Medieval brass candlestick holder with flickering flame. Warm glow effect. Solid color background. Top-down 3/4 view. Color palette: gold brass, cream candle, orange flame. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "shield": {
            "prompt": "Pixel art medieval heraldic shield, 16-bit SNES style. Decorative wall-mounted shield with coat of arms design. Knight's shield with metallic trim. Solid color background. Front view. Color palette: silver metal, red and blue heraldry, gold accents. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "vase": {
            "prompt": "Pixel art ancient decorative vase, 16-bit SNES style. Ornate ceramic amphora with painted designs. Medieval style. Solid color background. Top-down 3/4 view. Color palette: terracotta, cream, blue patterns. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "filing-cabinet": {
            "prompt": "Pixel art wooden filing cabinet, 16-bit SNES style. Medieval wooden chest of drawers for documents. Metal handles, aged wood. Solid color background. Top-down 3/4 view. Color palette: dark wood browns, brass handles. Clean pixels.",
            "size": (32, 48),
            "transparent": True
        },
        "cobweb": {
            "prompt": "Pixel art spider web in corner, 16-bit SNES style. Dusty abandoned cobweb decoration. Spooky atmosphere. Solid color background. Corner perspective. Color palette: white gray web strands. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "crate": {
            "prompt": "Pixel art wooden storage crate, 16-bit SNES style. Medieval wooden box with metal reinforcements. Solid color background. Top-down 3/4 view. Color palette: light wood, dark metal bands. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "scroll-decor": {
            "prompt": "Pixel art decorative scroll on stand, 16-bit SNES style. Rolled parchment on wooden holder. Medieval document display. Solid color background. Top-down 3/4 view. Color palette: cream parchment, dark wood, red wax seal. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "alembic": {
            "prompt": "Pixel art alchemist alembic flask, 16-bit SNES style. Glass vessel with bubbling colored liquid. Magical scientific equipment. Solid color background. Top-down 3/4 view. Color palette: clear glass, purple green glowing liquid, brass. Clean pixels.",
            "size": (32, 48),
            "transparent": True
        },
        "test-tube": {
            "prompt": "Pixel art test tube in holder, 16-bit SNES style. Glass tube with colorful potion. Laboratory equipment. Solid color background. Top-down 3/4 view. Color palette: clear glass, blue green liquid, wooden rack. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "ruler": {
            "prompt": "Pixel art drafting tools, 16-bit SNES style. Medieval measuring instruments ruler and set square. Mathematical tools. Solid color background. Top-down view. Color palette: wood brown, brass edges. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "microscope": {
            "prompt": "Pixel art antique microscope, 16-bit SNES style. Brass and glass scientific instrument. Victorian steampunk aesthetic. Solid color background. Top-down 3/4 view. Color palette: brass gold, black metal, glass. Clean pixels.",
            "size": (32, 48),
            "transparent": True
        },
        "telescope": {
            "prompt": "Pixel art telescope on tripod, 16-bit SNES style. Brass spyglass on wooden stand. Astronomical instrument. Solid color background. Top-down 3/4 view. Color palette: brass gold, dark wood tripod. Clean pixels.",
            "size": (48, 48),
            "transparent": True
        },
        "dna-helix": {
            "prompt": "Pixel art DNA double helix model, 16-bit SNES style. Decorative molecular structure display. Scientific decoration. Solid color background. Top-down 3/4 view. Color palette: blue red base pairs, white backbone, metallic stand. Clean pixels.",
            "size": (32, 48),
            "transparent": True
        },
        "abacus": {
            "prompt": "Pixel art wooden abacus, 16-bit SNES style. Traditional counting frame with colored beads. Mathematical instrument. Solid color background. Top-down 3/4 view. Color palette: dark wood, colorful beads red blue yellow. Clean pixels.",
            "size": (48, 32),
            "transparent": True
        },
        "painting": {
            "prompt": "Pixel art framed painting on wall, 16-bit SNES style. Ornate gold frame with landscape inside. Art gallery decoration. Solid color background. Front view. Color palette: gold frame, colorful painting. Clean pixels.",
            "size": (48, 48),
            "transparent": True
        },
        "palette": {
            "prompt": "Pixel art artist palette with brushes, 16-bit SNES style. Wooden palette with paint dabs and brushes. Art supplies. Solid color background. Top-down view. Color palette: wood brown, rainbow paint colors. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "crown": {
            "prompt": "Pixel art royal crown on cushion, 16-bit SNES style. Golden jeweled crown on velvet pillow. Royal symbol. Solid color background. Top-down 3/4 view. Color palette: gold, red blue jewels, purple velvet. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "briefcase": {
            "prompt": "Pixel art leather briefcase, 16-bit SNES style. Professional document case with brass clasps. Medieval satchel. Solid color background. Top-down 3/4 view. Color palette: brown leather, brass buckles. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "trophy": {
            "prompt": "Pixel art golden trophy cup, 16-bit SNES style. Championship goblet with handles on pedestal. Award decoration. Solid color background. Top-down 3/4 view. Color palette: shiny gold, dark pedestal. Clean pixels.",
            "size": (32, 48),
            "transparent": True
        },
        "chair": {
            "prompt": "Pixel art medieval wooden chair, 16-bit SNES style. High-backed council chair with carved details. Noble seating. Solid color background. Top-down 3/4 view. Color palette: dark wood, leather seat, brass studs. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "swords": {
            "prompt": "Pixel art crossed swords wall decoration, 16-bit SNES style. Two medieval swords mounted in X pattern. Heraldic ornament. Solid color background. Front view. Color palette: silver blades, gold hilts. Clean pixels.",
            "size": (48, 48),
            "transparent": True
        },
        "bookshelf": {
            "prompt": "Pixel art bookshelf segment, 16-bit SNES style. Wooden shelf filled with colorful book spines. Library furniture. Solid color background. Front view. Color palette: dark wood, multicolored books red blue green brown. Clean pixels.",
            "size": (48, 48),
            "transparent": True
        },
        "open-book": {
            "prompt": "Pixel art open book on lectern, 16-bit SNES style. Ancient tome displayed open with visible text. Study decoration. Solid color background. Top-down 3/4 view. Color palette: cream pages, dark ink, wood stand. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "castle-ornament": {
            "prompt": "Pixel art miniature castle model, 16-bit SNES style. Decorative castle sculpture wall emblem. Heraldic symbol. Solid color background. Front view. Color palette: gray stone, red banners, gold accents. Clean pixels.",
            "size": (48, 48),
            "transparent": True
        }
    },
    "npcs": {
        "mayordomo": {
            "prompt": "Pixel art full body character sprite of elderly butler, 16-bit SNES RPG style. Distinguished older gentleman standing, gray hair and mustache. Formal black tailcoat with white shirt and bow tie. Monocle over one eye. Hands clasped in front. Full body from head to feet visible. Solid green background for easy removal. Color palette: black suit, white accents, warm skin tones. Clean pixels, no anti-aliasing.",
            "size": (128, 192),
            "transparent": True
        },
        "alquimista": {
            "prompt": "Pixel art full body character sprite of data alchemist scientist, 16-bit SNES RPG style. Middle-aged woman standing, wild gray-purple hair. Round spectacles. Purple wizard robe with mathematical symbols reaching to feet. Holding bubbling flask with glowing green liquid. Full body from head to feet visible. Solid green background for easy removal. Color palette: purple robe, green potion, gray hair. Clean pixels, no anti-aliasing.",
            "size": (128, 192),
            "transparent": True
        },
        "ejecutiva": {
            "prompt": "Pixel art full body character sprite of medieval businesswoman, 16-bit SNES RPG style. Confident woman standing in her 40s with hair in elegant bun. Long noble blue dress with structured shoulders rich fabric reaching to feet. Holding scroll with plans. Pearl necklace. Full body from head to feet visible. Solid green background for easy removal. Color palette: deep blue dress, gold trim, pearls. Clean pixels, no anti-aliasing.",
            "size": (128, 192),
            "transparent": True
        },
        "bibliotecario": {
            "prompt": "Pixel art full body character sprite of elderly librarian sage, 16-bit SNES RPG style. Very old man standing with long white beard reaching chest. Reading glasses on nose. Brown monk robe with hood down reaching to feet. Holding ancient tome. Full body from head to feet visible. Solid green background for easy removal. Color palette: brown robe, white beard, aged book. Clean pixels, no anti-aliasing.",
            "size": (128, 192),
            "transparent": True
        },
        "detective": {
            "prompt": "Pixel art full body character sprite of medieval detective, 16-bit SNES RPG style. Sharp-featured man standing in 30s with deerstalker cap. Long dark brown cloak with high collar reaching to feet. Holding magnifying glass. Full body from head to feet visible. Solid green background for easy removal. Color palette: dark brown cloak, tan cap, brass magnifying glass. Clean pixels, no anti-aliasing.",
            "size": (128, 192),
            "transparent": True
        },
        "curadora": {
            "prompt": "Pixel art full body character sprite of art curator woman, 16-bit SNES RPG style. Elegant woman standing in her 50s with silver-streaked black hair in artistic updo. Long flowing colorful artistic dress reaching to feet. Holding artist palette. Full body from head to feet visible. Solid green background for easy removal. Color palette: colorful dress, silver-black hair. Clean pixels, no anti-aliasing.",
            "size": (128, 192),
            "transparent": True
        },
        "conde": {
            "prompt": "Pixel art full body character sprite of noble vampire count, 16-bit SNES RPG style. Pale aristocratic man standing with pointed features. Slicked back dark hair with widows peak. Red eyes. Long black cape with red lining reaching to feet. Gold medallion on chest. Fangs visible in slight smile. Full body from head to feet visible. Solid green background for easy removal. Color palette: pale skin, black red clothing, gold medallion. Clean pixels, no anti-aliasing.",
            "size": (128, 192),
            "transparent": True
        }
    },
    "rooms": {
        "vestibulo": {
            "prompt": "Pixel art castle entrance hall, 16-bit SNES style. Large medieval stone walls with gothic arched doorways. Red carpet leading to main doors. Torch sconces on walls with warm orange glow. Suits of armor as decoration. Stained glass windows. Banners with heraldic symbols. Top-down 3/4 view. Color palette: gray stones, red carpet, warm torchlight. 800x500 pixels aspect ratio. Clean pixels.",
            "size": (800, 500),
            "transparent": False
        },
        "laboratorio": {
            "prompt": "Pixel art alchemist laboratory mixed with data science theme, 16-bit SNES style. Medieval stone room with wooden tables covered in scrolls showing charts. Bubbling potions in glass flasks. Chalkboard with formulas. Shelves with books and crystal orbs. Candles dim light. Purple green ambient glow. Top-down 3/4 view. Color palette: stone gray, wood brown, magical purple green. Clean pixels.",
            "size": (800, 500),
            "transparent": False
        },
        "sala-juntas": {
            "prompt": "Pixel art medieval council chamber, 16-bit SNES style. Long wooden table in center with ornate chairs. Stone walls with tapestries showing organizational charts as heraldry. Large fireplace with roaring fire. Chandelier with candles. Windows with heavy curtains. Top-down 3/4 view. Color palette: warm wood, rich reds golds, stone gray. Clean pixels.",
            "size": (800, 500),
            "transparent": False
        },
        "biblioteca": {
            "prompt": "Pixel art grand medieval library, 16-bit SNES style. Tall wooden bookshelves reaching ceiling filled with ancient tomes. Rolling ladder on rails. Reading desks with open books showing graphs. Globe on pedestal. Candelabras warm light. Cozy reading nook. Top-down 3/4 view. Color palette: warm wood browns, colorful book spines, soft candlelight. Clean pixels.",
            "size": (800, 500),
            "transparent": False
        },
        "archivo": {
            "prompt": "Pixel art secret archive room, 16-bit SNES style. Underground stone chamber with filing cabinets like wooden chests. Cobwebs in corners. Dim torch lighting dramatic shadows. Mysterious locked chest. Stacks of old documents. Investigation board with strings connecting papers. Top-down 3/4 view. Color palette: dark grays, dusty browns, dim orange torchlight. Clean pixels.",
            "size": (800, 500),
            "transparent": False
        },
        "oficina": {
            "prompt": "Pixel art medieval treasury office, 16-bit SNES style. Elegant wood-paneled room with large desk covered in ledgers and coins. Abacus and scales. Safe treasure chest. Portraits on walls. Quill and inkwell. Charts on scrolls pinned to wall. Top-down 3/4 view. Color palette: rich mahogany, gold accents, deep green, cream parchment. Clean pixels.",
            "size": (800, 500),
            "transparent": False
        },
        "galeria": {
            "prompt": "Pixel art medieval art gallery, 16-bit SNES style. Long hall with framed charts and graphs displayed like paintings. Marble columns between displays. Red velvet ropes as barriers. Polished floor. Decorative plants in urns. Skylights natural light. Exhibition pedestals. Top-down 3/4 view. Color palette: white marble, gold frames, red velvet. Clean pixels.",
            "size": (800, 500),
            "transparent": False
        }
    },
    "objects": {
        "evidencia": {
            "prompt": "Pixel art golden scroll parchment, 16-bit style. Rolled scroll with golden glow effect. Wax seal visible. Sparkle effect. Medieval document aesthetic. Solid color background. Color palette: cream parchment, gold edges, red wax seal. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        },
        "distractor": {
            "prompt": "Pixel art damaged scroll parchment, 16-bit style. Torn crumpled scroll with dark stains. Broken wax seal. Slightly smoking purple wisps cursed appearance. Suspicious dangerous looking. Solid color background. Color palette: aged brown parchment, dark stains, broken seal, purple curse. Clean pixels.",
            "size": (32, 32),
            "transparent": True
        }
    },
    "ui": {
        "heart": {
            "prompt": "Pixel art heart icon, 16-bit style. Classic video game heart, red with highlight. Solid color background. Clean pixels.",
            "size": (24, 24),
            "transparent": True
        },
        "hourglass": {
            "prompt": "Pixel art hourglass clock, 16-bit style. Medieval hourglass with sand flowing. Gold frame. Solid color background. Clean pixels.",
            "size": (24, 24),
            "transparent": True
        },
        "inventory": {
            "prompt": "Pixel art medieval pouch bag, 16-bit style. Brown leather bag with drawstring. Solid color background. Clean pixels.",
            "size": (24, 24),
            "transparent": True
        }
    },
    "frames": {
        "frame-correct": {
            "prompt": "Pixel art ornate golden picture frame, 16-bit style. Decorative corners with flourishes. Royal prestigious appearance. White center area for chart placement. Color palette: gold, bronze highlights. Clean pixels.",
            "size": (400, 300),
            "transparent": False
        },
        "frame-incorrect": {
            "prompt": "Pixel art damaged wooden picture frame, 16-bit style. Cracked and worn. Warning symbols in corners. Slightly crooked. Cobwebs. White center area for chart placement. Color palette: dark wood, red warning accents. Clean pixels.",
            "size": (400, 300),
            "transparent": False
        }
    },
    "start": {
        "start-screen": {
            "prompt": "Pixel art portrait scene, 16-bit SNES RPG style. Noble vampire count standing in gothic castle study. Elegant black cape with red lining and golden medallion. Welcoming but mysterious pose, one hand gesturing toward scrolls and charts on desk. Large stained glass window with moonlight. Desk with documents showing graphs. Candelabras with flickering flames. Banner with charity crest on wall. Vertical composition. Color palette: deep purples, blacks, gold accents, red cape, warm candlelight, cool moonlight blue. Clean pixels.",
            "size": (350, 450),
            "transparent": False
        }
    },
    "player": {
        "player": {
            "prompt": "Pixel art full body character sprite of young data analyst apprentice, 16-bit SNES RPG style. Young person standing with medieval scholar robes in blue and silver. Holding quill and small notebook. Determined curious expression. Adventurer satchel at side. Full body from head to feet visible. Solid green background for easy removal. Color palette: blue robes, silver trim, brown leather satchel, warm skin tones. Clean pixels, no anti-aliasing.",
            "size": (32, 48),
            "transparent": True
        }
    }
}


def generate_image(client, prompt: str) -> str:
    """Genera una imagen con DALL-E 2 y retorna la URL."""
    response = client.images.generate(
        model="dall-e-2",
        prompt=prompt,
        size="512x512",
        n=1,
    )
    return response.data[0].url


def download_image(url: str) -> Image.Image:
    """Descarga una imagen desde URL y retorna objeto PIL."""
    response = requests.get(url)
    response.raise_for_status()
    return Image.open(BytesIO(response.content))


def remove_background(img: Image.Image) -> Image.Image:
    """Remueve el fondo de una imagen usando rembg."""
    if remove is None:
        print("    ⚠️  rembg no disponible, saltando remoción de fondo")
        return img

    # Convertir a bytes para rembg
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)

    # Remover fondo
    output_bytes = remove(img_bytes.read())
    return Image.open(BytesIO(output_bytes))


def resize_image(img: Image.Image, size: tuple) -> Image.Image:
    """Redimensiona imagen usando nearest neighbor para preservar píxeles."""
    return img.resize(size, Image.Resampling.NEAREST)


def process_image(client, name: str, config: dict, output_path: Path, dry_run: bool = False) -> bool:
    """Procesa una imagen completa: genera, descarga, procesa y guarda."""
    print(f"  📷 {name}")
    print(f"     Tamaño: {config['size']}, Transparente: {config['transparent']}")

    if dry_run:
        print(f"     [DRY-RUN] Se generaría: {output_path}")
        return True

    try:
        # 1. Generar con DALL-E
        print("     Generando con DALL-E 2...")
        url = generate_image(client, config['prompt'])

        # 2. Descargar
        print("     Descargando...")
        img = download_image(url)

        # 3. Remover fondo si es necesario
        if config['transparent']:
            print("     Removiendo fondo...")
            img = remove_background(img)

        # 4. Redimensionar
        print(f"     Redimensionando a {config['size']}...")
        img = resize_image(img, config['size'])

        # 5. Guardar
        output_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(output_path, 'PNG')
        print(f"     ✅ Guardado: {output_path}")

        return True

    except Exception as e:
        print(f"     ❌ Error: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description='Genera imágenes del juego con DALL-E')
    parser.add_argument('--dry-run', action='store_true', help='Mostrar qué se generaría sin ejecutar')
    parser.add_argument('--category', type=str, help='Solo generar una categoría (furniture, npcs, rooms, etc.)')
    parser.add_argument('--force', action='store_true', help='Sobrescribir imágenes existentes')
    parser.add_argument('--single', type=str, help='Generar solo una imagen específica (ej: furniture/plant)')
    parser.add_argument('--yes', '-y', action='store_true', help='Saltar confirmación')
    args = parser.parse_args()

    # Verificar API key
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key and not args.dry_run:
        print("❌ Error: OPENAI_API_KEY no configurada")
        print("   Ejecuta: export OPENAI_API_KEY='sk-...'")
        sys.exit(1)

    # Inicializar cliente
    client = None
    if not args.dry_run:
        client = OpenAI(api_key=api_key)

    # Filtrar categorías si se especificó
    categories = IMAGES
    if args.category:
        if args.category not in IMAGES:
            print(f"❌ Categoría '{args.category}' no existe")
            print(f"   Categorías disponibles: {', '.join(IMAGES.keys())}")
            sys.exit(1)
        categories = {args.category: IMAGES[args.category]}

    # Contar imágenes
    total_images = sum(len(imgs) for imgs in categories.values())
    print(f"\n🎨 Generador de Imágenes - Escape Room")
    print(f"=" * 50)
    print(f"Imágenes a generar: {total_images}")
    print(f"Costo estimado: ${total_images * COST_PER_IMAGE:.2f} USD")
    print(f"Modo: {'DRY-RUN' if args.dry_run else 'GENERACIÓN REAL'}")
    print(f"=" * 50)

    if not args.dry_run and not args.yes:
        response = input("\n¿Continuar? (s/N): ")
        if response.lower() != 's':
            print("Cancelado.")
            sys.exit(0)

    # Procesar imágenes
    generated = 0
    skipped = 0
    failed = 0
    cost = 0.0

    for category, images in categories.items():
        print(f"\n📁 Categoría: {category}")
        print("-" * 40)

        for name, config in images.items():
            # Determinar ruta de salida
            if category == "start":
                output_path = IMAGES_DIR / f"{name}.png"
            else:
                output_path = IMAGES_DIR / category / f"{name}.png"

            # Verificar si ya existe
            if output_path.exists() and not args.force:
                print(f"  ⏭️  {name} - ya existe, saltando")
                skipped += 1
                continue

            # Filtrar por --single si se especificó
            if args.single:
                single_path = f"{category}/{name}"
                if single_path != args.single:
                    continue

            # Procesar
            success = process_image(client, name, config, output_path, args.dry_run)

            if success:
                generated += 1
                cost += COST_PER_IMAGE
            else:
                failed += 1

    # Resumen
    print(f"\n{'=' * 50}")
    print(f"📊 Resumen:")
    print(f"   Generadas: {generated}")
    print(f"   Saltadas:  {skipped}")
    print(f"   Fallidas:  {failed}")
    if not args.dry_run:
        print(f"   Costo:     ${cost:.2f} USD")
    print(f"{'=' * 50}")


if __name__ == "__main__":
    main()
