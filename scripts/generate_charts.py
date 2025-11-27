#!/usr/bin/env python3
"""
generate_charts.py - Generador de Gráficos para Escape Room
Genera gráficos correctos y anti-patterns para la sección de Galería

Basado en datos REALES de SERVQUAL Teletón (n=274)
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from pathlib import Path

# Configurar estilo general
plt.style.use('seaborn-v0_8-whitegrid')

# Datos reales del diagnóstico SERVQUAL
DATA = {
    'nps_by_region': {
        'Norte': 51,
        'Sur': 48,
        'Sureste': 44,
        'Centro': 31,
        'Occidente': 30
    },
    'nps_by_organization': {
        'Gubernamental': 57,
        'Persona física': 47,
        'Educación': 40,
        'Teletón': 38,
        'Asoc. Civil': 35,
        'Empresa': 29
    },
    'servqual_dimensions': {
        'Empatía': 3.91,
        'Tangibles': 3.69,
        'Fiabilidad': 3.61,
        'Responsiveness': 3.60
    },
    'satisfaction_metrics': {
        'NPS': 40,
        'Satisfacción': 77,
        'Calidad': 73,
        'SERVQUAL': 74,
        'Información': 79
    }
}

OUTPUT_DIR = Path(__file__).parent.parent / 'images' / 'charts'


def create_output_dir():
    """Crear directorio de salida si no existe"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ============================================
# GRÁFICOS CORRECTOS (Evidencias)
# ============================================

def create_correct_nps_region():
    """
    Gráfico CORRECTO: NPS por Región
    - Barras horizontales ordenadas de mayor a menor
    - Título con insight
    - Colores semáforo
    """
    fig, ax = plt.subplots(figsize=(10, 6))

    # Ordenar datos de mayor a menor
    data = dict(sorted(DATA['nps_by_region'].items(), key=lambda x: x[1], reverse=True))
    regions = list(data.keys())
    values = list(data.values())

    # Colores semáforo
    colors = []
    for v in values:
        if v >= 45:
            colors.append('#2ecc71')  # Verde - bueno
        elif v >= 35:
            colors.append('#f1c40f')  # Amarillo - medio
        else:
            colors.append('#e74c3c')  # Rojo - requiere atención

    # Crear barras horizontales
    bars = ax.barh(regions, values, color=colors, edgecolor='white', linewidth=1.5)

    # Añadir valores
    for bar, val in zip(bars, values):
        ax.text(val + 1, bar.get_y() + bar.get_height()/2, f'+{val}',
                va='center', fontsize=12, fontweight='bold')

    # Título con INSIGHT (no descriptivo)
    ax.set_title('Norte y Sur lideran satisfacción;\nCentro y Occidente requieren acción urgente',
                 fontsize=14, fontweight='bold', pad=20)

    ax.set_xlabel('NPS (Net Promoter Score)', fontsize=11)
    ax.set_xlim(0, 60)
    ax.invert_yaxis()  # Mayor arriba

    # Leyenda
    legend_elements = [
        mpatches.Patch(facecolor='#2ecc71', label='Meta alcanzada (≥45)'),
        mpatches.Patch(facecolor='#f1c40f', label='Cerca de meta (35-44)'),
        mpatches.Patch(facecolor='#e74c3c', label='Requiere atención (<35)')
    ]
    ax.legend(handles=legend_elements, loc='lower right', fontsize=9)

    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / 'correct_nps_region.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Creado: correct_nps_region.png")


def create_correct_servqual():
    """
    Gráfico CORRECTO: Dimensiones SERVQUAL
    - Barras verticales con escala desde 0
    - Highlight en extremos
    """
    fig, ax = plt.subplots(figsize=(10, 6))

    dimensions = list(DATA['servqual_dimensions'].keys())
    values = list(DATA['servqual_dimensions'].values())

    # Colores destacando extremos
    colors = ['#2ecc71' if v == max(values) else '#e74c3c' if v == min(values) else '#3498db'
              for v in values]

    bars = ax.bar(dimensions, values, color=colors, edgecolor='white', linewidth=2)

    # Añadir valores encima de las barras
    for bar, val in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width()/2, val + 0.05, f'{val:.2f}',
                ha='center', fontsize=12, fontweight='bold')

    # Línea de meta
    ax.axhline(y=4.0, color='#27ae60', linestyle='--', linewidth=2, alpha=0.7)
    ax.text(len(dimensions) - 0.5, 4.05, 'Meta: 4.0', fontsize=10, color='#27ae60')

    ax.set_title('Empatía es la fortaleza; Responsiveness necesita mejora\n(Escala 1-5)',
                 fontsize=14, fontweight='bold', pad=20)
    ax.set_ylabel('Puntuación SERVQUAL', fontsize=11)
    ax.set_ylim(0, 5)  # Escala COMPLETA desde 0

    # Leyenda
    legend_elements = [
        mpatches.Patch(facecolor='#2ecc71', label='Más alta'),
        mpatches.Patch(facecolor='#e74c3c', label='Más baja'),
        mpatches.Patch(facecolor='#3498db', label='Intermedia')
    ]
    ax.legend(handles=legend_elements, loc='lower right', fontsize=9)

    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / 'correct_servqual.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Creado: correct_servqual.png")


def create_correct_organization():
    """
    Gráfico CORRECTO: NPS por Tipo de Organización
    - Barras horizontales ordenadas
    - Highlight en el problema (Empresas)
    """
    fig, ax = plt.subplots(figsize=(10, 6))

    data = dict(sorted(DATA['nps_by_organization'].items(), key=lambda x: x[1], reverse=True))
    orgs = list(data.keys())
    values = list(data.values())

    # Destacar Empresa (el problema)
    colors = ['#e74c3c' if 'Empresa' in org else '#3498db' for org in orgs]

    bars = ax.barh(orgs, values, color=colors, edgecolor='white', linewidth=1.5)

    for bar, val in zip(bars, values):
        ax.text(val + 1, bar.get_y() + bar.get_height()/2, f'+{val}',
                va='center', fontsize=11, fontweight='bold')

    ax.set_title('Empresas son el segmento menos satisfecho;\nrequieren programa especial de atención',
                 fontsize=14, fontweight='bold', pad=20)
    ax.set_xlabel('NPS', fontsize=11)
    ax.set_xlim(0, 70)
    ax.invert_yaxis()

    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / 'correct_nps_organization.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Creado: correct_nps_organization.png")


# ============================================
# GRÁFICOS INCORRECTOS (Distractores / Anti-patterns)
# ============================================

def create_wrong_pie_chart():
    """
    ANTI-PATTERN: Pie chart con 6+ categorías
    - Imposible comparar segmentos similares
    - Colores rainbow sin propósito
    """
    fig, ax = plt.subplots(figsize=(10, 8))

    data = DATA['nps_by_organization']
    labels = list(data.keys())
    values = list(data.values())

    # Colores rainbow (mal uso del color)
    colors = plt.cm.rainbow(np.linspace(0, 1, len(values)))

    # Explode aleatorio (más ruido visual)
    explode = [0.05] * len(values)

    wedges, texts, autotexts = ax.pie(values, labels=labels, colors=colors,
                                       explode=explode, autopct='%1.1f%%',
                                       shadow=True, startangle=90)

    # Título descriptivo (malo)
    ax.set_title('Gráfico circular de NPS por tipo de organización\n(Datos de encuesta Q4 2024)',
                 fontsize=12)

    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / 'wrong_pie_organizations.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Creado: wrong_pie_organizations.png (Anti-pattern: Pie chart 6+ categorías)")


def create_wrong_3d_chart():
    """
    ANTI-PATTERN: Gráfico 3D
    - Distorsiona percepción de valores
    - Efectos que no comunican datos
    """
    from mpl_toolkits.mplot3d import Axes3D

    fig = plt.figure(figsize=(10, 8))
    ax = fig.add_subplot(111, projection='3d')

    dimensions = list(DATA['servqual_dimensions'].keys())
    values = list(DATA['servqual_dimensions'].values())

    x = np.arange(len(dimensions))
    colors = plt.cm.viridis(np.linspace(0.3, 0.9, len(values)))

    ax.bar3d(x, [0]*len(x), [0]*len(x),
             [0.8]*len(x), [0.8]*len(x), values,
             color=colors, alpha=0.8, shade=True)

    ax.set_xticks(x + 0.4)
    ax.set_xticklabels(dimensions, rotation=15)
    ax.set_zlabel('Puntuación')
    ax.set_title('Dashboard SERVQUAL Premium 3D\n(Elaborado con efectos avanzados)', fontsize=12)

    # Vista que distorsiona
    ax.view_init(elev=20, azim=45)

    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / 'wrong_3d_servqual.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Creado: wrong_3d_servqual.png (Anti-pattern: 3D distorsiona)")


def create_wrong_truncated_axis():
    """
    ANTI-PATTERN: Eje truncado
    - Exagera diferencias pequeñas
    - Engañoso visualmente
    """
    fig, ax = plt.subplots(figsize=(10, 6))

    metrics = list(DATA['satisfaction_metrics'].keys())
    values = list(DATA['satisfaction_metrics'].values())

    colors = ['#3498db'] * len(values)
    bars = ax.bar(metrics, values, color=colors, edgecolor='white', linewidth=2)

    # EJE TRUNCADO - empieza en 70 en vez de 0
    ax.set_ylim(70, 85)  # ¡Esto es el problema!

    for bar, val in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width()/2, val + 0.3, f'{val}%',
                ha='center', fontsize=11, fontweight='bold')

    ax.set_title('Métricas de satisfacción - Diferencias significativas\n(Escala optimizada para visualización)',
                 fontsize=12)
    ax.set_ylabel('Porcentaje (%)')

    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / 'wrong_truncated_axis.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Creado: wrong_truncated_axis.png (Anti-pattern: Eje truncado)")


def create_wrong_rainbow_colors():
    """
    ANTI-PATTERN: Colores rainbow sin propósito
    - Los colores no comunican nada
    - Agregan ruido visual
    """
    fig, ax = plt.subplots(figsize=(10, 6))

    data = dict(sorted(DATA['nps_by_region'].items(), key=lambda x: x[1], reverse=True))
    regions = list(data.keys())
    values = list(data.values())

    # Colores rainbow aleatorios (MAL - no comunican nada)
    colors = ['#e74c3c', '#9b59b6', '#3498db', '#2ecc71', '#f39c12']

    bars = ax.barh(regions, values, color=colors, edgecolor='black', linewidth=1)

    for bar, val in zip(bars, values):
        ax.text(val + 1, bar.get_y() + bar.get_height()/2, f'+{val}',
                va='center', fontsize=11)

    # Título descriptivo
    ax.set_title('Gráfico de NPS por región Q4 2024', fontsize=12)
    ax.set_xlabel('NPS')
    ax.invert_yaxis()

    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / 'wrong_rainbow_colors.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Creado: wrong_rainbow_colors.png (Anti-pattern: Colores sin propósito)")


def create_wrong_chart_junk():
    """
    ANTI-PATTERN: Chart junk
    - Decoraciones innecesarias
    - Ruido visual que distrae
    """
    fig, ax = plt.subplots(figsize=(10, 8))

    dimensions = list(DATA['servqual_dimensions'].keys())
    values = list(DATA['servqual_dimensions'].values())

    # Gradientes falsos con barras apiladas
    colors_base = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12']

    for i, (dim, val, col) in enumerate(zip(dimensions, values, colors_base)):
        # Múltiples capas para "efecto"
        ax.bar(i, val, color=col, alpha=0.3, width=0.8)
        ax.bar(i, val * 0.9, color=col, alpha=0.5, width=0.7)
        ax.bar(i, val * 0.8, color=col, alpha=0.7, width=0.6)
        ax.bar(i, val * 0.7, color=col, alpha=1.0, width=0.5)

    # Grid excesivo
    ax.grid(True, which='both', linestyle='-', linewidth=0.5, alpha=0.5)
    ax.minorticks_on()

    # Anotaciones innecesarias
    ax.annotate('¡Importante!', xy=(0, 3.91), xytext=(0.5, 4.5),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=12, color='red', fontweight='bold')

    ax.annotate('Área de\noportunidad', xy=(3, 3.6), xytext=(2.5, 2.8),
                arrowprops=dict(arrowstyle='fancy', color='purple', lw=2),
                fontsize=10, color='purple')

    # Caja decorativa
    ax.add_patch(plt.Rectangle((2.5, 3.4), 1, 0.4, fill=False,
                                edgecolor='red', linestyle='--', linewidth=2))

    ax.set_xticks(range(len(dimensions)))
    ax.set_xticklabels(dimensions)
    ax.set_ylim(0, 5)

    # Título con decoración excesiva
    ax.set_title('★★★ DASHBOARD SERVQUAL PREMIUM ★★★\n' +
                 '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                 'Análisis Ejecutivo de Alta Calidad',
                 fontsize=12, fontweight='bold')

    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / 'wrong_chart_junk.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Creado: wrong_chart_junk.png (Anti-pattern: Chart junk)")


def create_wrong_descriptive_title():
    """
    ANTI-PATTERN: Título descriptivo sin insight
    - El título dice qué ES el gráfico, no qué SIGNIFICA
    """
    fig, ax = plt.subplots(figsize=(10, 6))

    data = dict(sorted(DATA['nps_by_region'].items(), key=lambda x: x[1], reverse=True))
    regions = list(data.keys())
    values = list(data.values())

    colors = ['#3498db'] * len(values)
    bars = ax.barh(regions, values, color=colors, edgecolor='white', linewidth=1.5)

    for bar, val in zip(bars, values):
        ax.text(val + 1, bar.get_y() + bar.get_height()/2, f'+{val}',
                va='center', fontsize=11)

    # Título DESCRIPTIVO (malo) en vez de con insight
    ax.set_title('Gráfico de barras horizontales de NPS por región\n' +
                 '(Datos procesados con Python - Fuente: Encuesta SERVQUAL)',
                 fontsize=11)

    # Subtítulo innecesario
    ax.text(0.5, -0.12, 'Elaborado por el Departamento de Análisis de Datos - Todos los derechos reservados',
            transform=ax.transAxes, fontsize=8, ha='center', style='italic')

    ax.set_xlabel('Net Promoter Score (NPS)')
    ax.invert_yaxis()

    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / 'wrong_descriptive_title.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    print("✓ Creado: wrong_descriptive_title.png (Anti-pattern: Título sin insight)")


def main():
    """Generar todos los gráficos"""
    print("=" * 50)
    print("Generando gráficos para Escape Room...")
    print("=" * 50)

    create_output_dir()

    print("\n📊 GRÁFICOS CORRECTOS (Evidencias):")
    print("-" * 40)
    create_correct_nps_region()
    create_correct_servqual()
    create_correct_organization()

    print("\n⚠️ GRÁFICOS INCORRECTOS (Distractores):")
    print("-" * 40)
    create_wrong_pie_chart()
    create_wrong_3d_chart()
    create_wrong_truncated_axis()
    create_wrong_rainbow_colors()
    create_wrong_chart_junk()
    create_wrong_descriptive_title()

    print("\n" + "=" * 50)
    print(f"✅ Todos los gráficos guardados en: {OUTPUT_DIR}")
    print("=" * 50)


if __name__ == '__main__':
    main()
