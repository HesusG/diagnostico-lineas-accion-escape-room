#!/usr/bin/env python3
"""Test de generación de imagen con DALL-E 2"""

import sys
sys.path.insert(0, '/home/d3r/.local/lib/python3.10/site-packages')

from openai import OpenAI
from PIL import Image
from io import BytesIO
import requests
import os
from pathlib import Path

# Leer API key desde .env
env_path = Path(__file__).parent.parent / '.env'
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                os.environ[key] = value

client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

prompt = 'Pixel art bookshelf segment, 16-bit SNES style. Wooden shelf filled with colorful book spines. Library furniture. Solid color background. Front view. Color palette: dark wood, multicolored books red blue green brown. Clean pixels.'

print('Generando imagen con DALL-E 2...')
response = client.images.generate(
    model='dall-e-2',
    prompt=prompt,
    size='512x512',
    n=1,
)
url = response.data[0].url
print(f'URL: {url[:80]}...')

print('Descargando...')
img_response = requests.get(url)
img = Image.open(BytesIO(img_response.content))

print(f'Tamaño original: {img.size}')

# Redimensionar
img_resized = img.resize((48, 48), Image.Resampling.NEAREST)

# Guardar
output_dir = Path(__file__).parent.parent / 'images/furniture'
output_dir.mkdir(parents=True, exist_ok=True)
output_path = output_dir / 'bookshelf.png'
img_resized.save(output_path, 'PNG')
print(f'Guardado: {output_path}')
print(f'Tamaño final: {img_resized.size}')
print('Listo!')
