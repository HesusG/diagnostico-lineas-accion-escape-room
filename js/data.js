/* ============================================
   DATA.JS - Datos del Juego
   Basado en datos REALES de SERVQUAL Teletón (n=274)
   ============================================ */

// Constantes del juego
const GAME_CONSTANTS = {
    TOTAL_TIME: 30 * 60, // 30 minutos en segundos
    MAX_ERRORS: 3,
    TOTAL_EVIDENCES: 8,
    PLAYER_SIZE: 32,
    PLAYER_SPEED: 4,
    INTERACTION_DISTANCE: 50
};

// ============================================
// DATOS REALES DEL DIAGNÓSTICO SERVQUAL
// ============================================
const REAL_DATA = {
    sample: 274,
    nps: {
        score: 40,
        promoters: 40.5,
        passives: 59.1,
        detractors: 0.4
    },
    servqual: {
        overall: 3.67,
        dimensions: {
            empathy: 3.91,
            tangibles: 3.69,
            reliability: 3.61,
            responsiveness: 3.60
        }
    },
    satisfaction: 77,
    quality: 73,
    transparency: 79,
    byOrganization: {
        governmental: { n: 21, nps: 57 },
        individual: { n: 47, nps: 47 },
        education: { n: 116, nps: 40 },
        teleton_internal: { n: 32, nps: 38 },
        civil_association: { n: 17, nps: 35 },
        enterprise: { n: 41, nps: 29 }
    },
    byRegion: {
        north: { n: 71, nps: 51 },
        south: { n: 40, nps: 48 },
        southeast: { n: 32, nps: 44 },
        center: { n: 105, nps: 31 },
        west: { n: 23, nps: 30 }
    },
    byTenure: {
        established: { n: 63, nps: 48, years: '3-10' },
        veteran: { n: 68, nps: 38, years: '>10' },
        new: { n: 143, nps: 38, years: '<3' }
    },
    lowestItems: [
        { item: 'Puntualidad', score: 3.56, dimension: 'Fiabilidad' },
        { item: 'Documentación', score: 3.58, dimension: 'Tangibles' },
        { item: 'Disposición', score: 3.58, dimension: 'Responsiveness' },
        { item: 'Rapidez', score: 3.60, dimension: 'Responsiveness' },
        { item: 'Flexibilidad', score: 3.62, dimension: 'Responsiveness' }
    ],
    topStatesNormalized: [
        { state: 'Guanajuato', npsNorm: 44.4, nps: 64, n: 11, confidence: 70 },
        { state: 'Tamaulipas', npsNorm: 40.6, nps: 53, n: 19, confidence: 77 },
        { state: 'Sinaloa', npsNorm: 40.4, nps: 62, n: 8, confidence: 65 },
        { state: 'Oaxaca', npsNorm: 39.5, nps: 67, n: 6, confidence: 59 },
        { state: 'Coahuila', npsNorm: 36.6, nps: 50, n: 14, confidence: 73 }
    ]
};

// ============================================
// INTRO / LORE MEDIEVAL
// ============================================
const LORE = {
    title: "La Misión del Conde Donador",
    intro: `En el año de gracia del Señor, en las tierras del Reino de Teletón...

El <strong>Conde Von Donativo</strong>, noble benefactor y protector de los más necesitados, ha convocado una audiencia de emergencia en su castillo.

Los pergaminos del Gran Consejo revelan verdades ocultas sobre la satisfacción de los súbditos benefactores. Pero entre los documentos sagrados se han mezclado <span class="text-error">falsificaciones del Brujo del Sesgo Estadístico</span>.

Tú, joven <strong>Analista de la Orden de los Datos</strong>, debes recorrer las cámaras del castillo y separar la verdad de la mentira.

El Conde necesita un reporte digno para presentar ante la <strong>Junta de los Doce Sabios</strong>. Si fallas, la donación de <span class="text-warning">10 millones de monedas de oro</span> se perderá, y con ella, la esperanza de miles.

<em>Tienes hasta que la arena del reloj se agote...</em>`,
    controls: `<strong>Pergamino de Instrucciones</strong>

🗝️ <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> o <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd> — Caminar por el castillo
🗝️ <kbd>E</kbd> o <kbd>Espacio</kbd> — Examinar pergaminos y hablar con sabios
🗝️ Evita los documentos falsos — 3 errores y perderás la confianza del Conde`,
    startButton: "⚔️ Iniciar Misión"
};

// ============================================
// EVIDENCIAS CORRECTAS (8)
// ============================================
const EVIDENCES = [
    {
        id: 'nps-composition',
        name: 'Pergamino de Composición NPS',
        icon: '📊',
        room: 'laboratorio',
        position: { x: 200, y: 150 },
        content: `<strong>📜 Pergamino Sagrado: Composición del NPS</strong>

Muestra de benefactores consultados: <strong>n = 274</strong>

<strong>Net Promoter Score: +40</strong>

Distribución de lealtad:
• <span class="text-success">Promotores (9-10): 40.5%</span>
• <span class="text-warning">Pasivos (7-8): 59.1%</span>
• <span class="text-error">Detractores (1-6): 0.4%</span>

<strong>Hallazgo clave:</strong> La gran mayoría son pasivos.
La oportunidad está en <em>convertir pasivos en promotores</em>, no en reducir detractores (ya son mínimos).

<em>Este pergamino revela dónde está el verdadero potencial de mejora.</em>`,
        concept: 'Análisis de composición NPS'
    },
    {
        id: 'servqual-dimensions',
        name: 'Códice SERVQUAL',
        icon: '📈',
        room: 'laboratorio',
        position: { x: 550, y: 280 },
        content: `<strong>📜 Códice Antiguo: Dimensiones SERVQUAL</strong>

Evaluación de calidad percibida (escala 1-5):

| Dimensión | Puntuación | Estado |
|-----------|------------|--------|
| <span class="text-success">Empatía</span> | 3.91/5 | ✓ Más fuerte |
| Tangibles | 3.69/5 | ~ Intermedio |
| Fiabilidad | 3.61/5 | ⚠️ Bajo |
| <span class="text-error">Responsiveness</span> | 3.60/5 | ✗ Más débil |

<strong>Promedio SERVQUAL: 3.67/5 (74%)</strong>

<strong>Diagnóstico:</strong> Responsiveness (rapidez, disposición, flexibilidad) es la dimensión más débil. Los benefactores perciben lentitud.`,
        concept: 'Dimensiones SERVQUAL'
    },
    {
        id: 'regional-analysis',
        name: 'Mapa Regional del Reino',
        icon: '🗺️',
        room: 'sala-juntas',
        position: { x: 150, y: 200 },
        content: `<strong>📜 Mapa del Reino: NPS por Región</strong>

Comparación de satisfacción entre las 5 regiones:

| Región | n | NPS |
|--------|---|-----|
| <span class="text-success">Norte</span> | 71 | <strong>+51</strong> ✓ Líder |
| <span class="text-success">Sur</span> | 40 | +48 ✓ |
| Sureste | 32 | +44 |
| <span class="text-warning">Centro</span> | 105 | +31 ⚠️ |
| <span class="text-error">Occidente</span> | 23 | <strong>+30</strong> ✗ |

<strong>Hallazgo:</strong> Norte lidera en satisfacción. Centro y Occidente requieren atención urgente.

<strong>Acción:</strong> Investigar y replicar prácticas del Norte.`,
        concept: 'Análisis comparativo regional'
    },
    {
        id: 'organization-segmentation',
        name: 'Libro de Segmentación',
        icon: '📚',
        room: 'sala-juntas',
        position: { x: 550, y: 150 },
        content: `<strong>📜 Libro de los Gremios: NPS por Tipo de Organización</strong>

| Organización | n | NPS | Observación |
|--------------|---|-----|-------------|
| <span class="text-success">Gubernamental</span> | 21 | <strong>+57</strong> | Más satisfechos |
| Persona física | 47 | +47 | Sobre promedio |
| Educación | 116 | +40 | En promedio |
| Teletón (interno) | 32 | +38 | Bajo promedio |
| Asociación civil | 17 | +35 | Bajo promedio |
| <span class="text-error">Empresa</span> | 41 | <strong>+29</strong> | Menos satisfechos |

<strong>Hallazgo crítico:</strong> Las empresas son el segmento menos satisfecho. Requieren programa especial de atención.`,
        concept: 'Segmentación por tipo de organización'
    },
    {
        id: 'foda-data',
        name: 'Pergamino FODA con Datos',
        icon: '📋',
        room: 'biblioteca',
        position: { x: 400, y: 250 },
        content: `<strong>📜 Pergamino Estratégico: FODA Basado en Evidencia</strong>

<span class="text-success"><strong>FORTALEZAS</strong></span>
• NPS positivo (+40) — lejos de negativo
• Empatía 3.91/5 — dimensión más alta
• Solo 0.4% detractores — casi inexistentes
• Norte como benchmark (+51)

<span class="text-warning"><strong>DEBILIDADES</strong></span>
• Responsiveness 3.60/5 — más baja
• Empresas NPS +29 — 28 pts bajo gobierno
• Puntualidad 3.56/5 — ítem más bajo

<span class="text-success"><strong>OPORTUNIDADES</strong></span>
• 59.1% pasivos convertibles a promotores
• Replicar prácticas del Norte en Centro

<span class="text-error"><strong>AMENAZAS</strong></span>
• Centro y Occidente rezagados
• Percepción de lentitud generalizada`,
        concept: 'FODA con evidencia cuantitativa'
    },
    {
        id: 'lowest-items',
        name: 'Lista de Áreas Críticas',
        icon: '📝',
        room: 'archivo',
        position: { x: 300, y: 180 },
        content: `<strong>📜 Registro Secreto: Ítems con Menor Puntuación</strong>

Los 5 aspectos peor evaluados del servicio:

| Rank | Ítem | Score | Dimensión |
|------|------|-------|-----------|
| 1 | <span class="text-error">Puntualidad</span> | 3.56/5 | Fiabilidad |
| 2 | Documentación | 3.58/5 | Tangibles |
| 3 | Disposición | 3.58/5 | Responsiveness |
| 4 | Rapidez | 3.60/5 | Responsiveness |
| 5 | Flexibilidad | 3.62/5 | Responsiveness |

<strong>Patrón identificado:</strong> 3 de 5 ítems más bajos son de Responsiveness.

<strong>Recomendación prioritaria:</strong> Mejorar puntualidad y tiempos de respuesta.`,
        concept: 'Identificación de áreas de mejora'
    },
    {
        id: 'kpis-dashboard',
        name: 'Dashboard de KPIs',
        icon: '🎯',
        room: 'oficina',
        position: { x: 500, y: 200 },
        content: `<strong>📜 Tablero del Consejo: KPIs Principales</strong>

<strong>Métricas de Satisfacción:</strong>
| Indicador | Valor | Estado |
|-----------|-------|--------|
| NPS | +40 | Bueno (>0) |
| Satisfacción | 77% | Aceptable |
| Calidad | 73% | Aceptable |
| SERVQUAL | 74% | Aceptable |
| Información | 79% | Bueno |

<strong>Meta SMART propuesta:</strong>
"Aumentar NPS de +40 a +50 en 12 meses mediante mejora de tiempos de respuesta (Responsiveness de 3.60 a 4.0)"

<em>KPIs accionables con metas medibles y plazos definidos.</em>`,
        concept: 'KPIs y objetivos SMART'
    },
    {
        id: 'dataviz-correct',
        name: 'Gráfico de Barras Regional',
        icon: '📊',
        room: 'galeria',
        position: { x: 350, y: 200 },
        isChart: true,
        chartImage: 'images/charts/correct_nps_region.png',
        content: `<strong>📜 Visualización Efectiva: NPS por Región</strong>

<div class="chart-container">
    <img src="images/charts/correct_nps_region.png" alt="Gráfico NPS por Región" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
    <div class="chart-placeholder" style="display:none;">
        [Gráfico: Barras horizontales ordenadas de mayor a menor]
        Norte: ████████████ +51
        Sur:   ███████████  +48
        SE:    ██████████   +44
        Centro:████████     +31
        Oeste: ████████     +30
    </div>
</div>

✓ Barras ordenadas de mayor a menor
✓ Título con insight: "Norte lidera; Centro requiere acción"
✓ Escala desde 0 (no truncada)
✓ Color destacando extremos
✓ Sin 3D, sin efectos innecesarios

<em>El lector entiende el mensaje en 3 segundos.</em>`,
        concept: 'Storytelling with Data - Gráfico efectivo'
    }
];

// ============================================
// DISTRACTORES (10)
// ============================================
const DISTRACTORS = [
    {
        id: 'dist-only-mean',
        name: 'Post-it "Resumen Ejecutivo"',
        icon: '📝',
        room: 'laboratorio',
        position: { x: 450, y: 350 },
        content: `<strong>📌 Post-it: Resumen Ejecutivo</strong>

"NPS = +40. ¡Excelente! Estamos bien.

No hay nada que mejorar. 👍"`,
        feedback: `<span class="text-error">❌ DOCUMENTO FALSO</span>

El análisis es incompleto y la conclusión es incorrecta.

<strong>Problemas:</strong>
• Ignora que 59.1% son pasivos (oportunidad enorme)
• +40 es "bueno" pero no "excelente" (>50 sería excelente)
• Sí hay mucho que mejorar: Responsiveness, empresas, Centro/Occidente

<strong>Lección:</strong> Un número aislado sin contexto lleva a conclusiones erróneas. Siempre desagrega los datos.`,
        error: 'Conclusión sin análisis de composición'
    },
    {
        id: 'dist-mean-confusion',
        name: 'Nota "Todos Satisfechos"',
        icon: '📄',
        room: 'laboratorio',
        position: { x: 650, y: 180 },
        content: `<strong>📄 Nota: Análisis de Satisfacción</strong>

"Promedio de satisfacción: 77%.

Como el promedio es alto, TODOS los benefactores están satisfechos y no hay nadie insatisfecho."`,
        feedback: `<span class="text-error">❌ DOCUMENTO FALSO</span>

El promedio oculta la variabilidad.

<strong>Realidad:</strong>
• Empresas tienen NPS +29 (muy por debajo)
• Centro y Occidente están rezagados
• 59.1% son pasivos, no promotores

<strong>Lección:</strong> El promedio puede ocultar segmentos problemáticos. Siempre analiza por segmentos antes de concluir que "todos" están bien.`,
        error: 'Generalización incorrecta del promedio'
    },
    {
        id: 'dist-small-sample',
        name: 'Reporte "Puebla es #1"',
        icon: '📋',
        room: 'sala-juntas',
        position: { x: 350, y: 350 },
        content: `<strong>📋 Reporte: Ranking Estatal</strong>

"¡GRAN NOTICIA! Puebla tiene NPS de +100.

Debemos replicar el modelo de Puebla en todo el país inmediatamente."`,
        feedback: `<span class="text-error">❌ DOCUMENTO FALSO</span>

¡Muestra insuficiente!

<strong>Realidad:</strong>
• Puebla tiene n=1 (¡UNA sola respuesta!)
• +100 con n=1 no es estadísticamente confiable
• Estados con n<5 no permiten conclusiones

<strong>Lección:</strong> Siempre verifica el tamaño de muestra antes de celebrar. Un NPS de +100 con n=1 es anécdota, no evidencia.`,
        error: 'Ignorar tamaño de muestra'
    },
    {
        id: 'dist-causation',
        name: 'Memo "Causa Encontrada"',
        icon: '✉️',
        room: 'sala-juntas',
        position: { x: 650, y: 280 },
        content: `<strong>✉️ Memo Ejecutivo: Descubrimiento</strong>

"Encontré que los estados del Norte tienen más sol que los del Centro.

Norte tiene NPS +51, Centro +31.

CONCLUSIÓN: El sol causa mayor satisfacción. Propongo instalar lámparas de bronceado en los CRITs del Centro."`,
        feedback: `<span class="text-error">❌ DOCUMENTO FALSO</span>

¡Correlación NO es causalidad!

<strong>Error:</strong> Que dos cosas coincidan no significa que una cause la otra.

<strong>Explicación real probable:</strong>
• Diferentes prácticas operativas
• Diferente composición de benefactores
• Diferentes recursos o capacitación

<strong>Lección:</strong> Nunca concluyas causalidad sin un diseño experimental o análisis riguroso.`,
        error: 'Confundir correlación con causalidad'
    },
    {
        id: 'dist-foda-opinion',
        name: 'Servilleta "Mi FODA"',
        icon: '🧻',
        room: 'biblioteca',
        position: { x: 150, y: 150 },
        content: `<strong>🧻 Servilleta del Almuerzo</strong>

<em>"Mi FODA personal de Teletón"</em>

FORTALEZAS: Somos buena onda 😊
DEBILIDADES: A veces llegamos tarde
OPORTUNIDADES: La gente nos quiere
AMENAZAS: Hay mucha competencia, creo...`,
        feedback: `<span class="text-error">❌ DOCUMENTO FALSO</span>

Un FODA sin datos es pura opinión.

<strong>Compare:</strong>
❌ "Somos buena onda"
✓ "Empatía 3.91/5, la más alta de SERVQUAL"

❌ "A veces llegamos tarde"
✓ "Puntualidad 3.56/5, el ítem más bajo"

<strong>Lección:</strong> Cada elemento del FODA debe estar respaldado por evidencia cuantitativa o cualitativa verificable.`,
        error: 'FODA sin datos, solo opiniones'
    },
    {
        id: 'dist-cherry-picking',
        name: 'Informe "Solo lo Bueno"',
        icon: '📑',
        room: 'archivo',
        position: { x: 550, y: 300 },
        content: `<strong>📑 Informe para la Junta</strong>

"Resultados destacados del diagnóstico:

✓ Empatía: 3.91/5 - ¡Excelente!
✓ Gobierno: NPS +57 - ¡Increíble!
✓ Norte: NPS +51 - ¡Líderes!

Conclusión: El diagnóstico muestra resultados excepcionales."

<em>Nota: Se omitieron datos no relevantes.</em>`,
        feedback: `<span class="text-error">❌ DOCUMENTO FALSO</span>

¡Cherry-picking! Solo muestra datos favorables.

<strong>Datos omitidos "no relevantes":</strong>
• Responsiveness: 3.60/5 (más bajo)
• Empresas: NPS +29 (peor segmento)
• Centro: NPS +31 (muy bajo)
• 59.1% pasivos (oportunidad ignorada)

<strong>Lección:</strong> Un análisis honesto presenta TODOS los hallazgos, no solo los convenientes. El cherry-picking destruye credibilidad.`,
        error: 'Cherry-picking de datos favorables'
    },
    {
        id: 'dist-non-smart',
        name: 'Plan "Visión Inspiradora"',
        icon: '📋',
        room: 'oficina',
        position: { x: 200, y: 320 },
        content: `<strong>📋 Plan Estratégico 2025</strong>

<strong>Nuestra Visión:</strong>
"Ser los mejores en satisfacción, brindando un servicio de excelencia mundial, lo más pronto posible."

<strong>Objetivo:</strong>
"Mejorar mucho la satisfacción de todos los benefactores."`,
        feedback: `<span class="text-error">❌ DOCUMENTO FALSO</span>

Objetivo NO es SMART:

• ❌ <strong>S</strong>pecific: ¿"Mejorar mucho" cuánto?
• ❌ <strong>M</strong>easurable: ¿"Los mejores" según qué métrica?
• ❌ <strong>A</strong>chievable: Sin análisis de factibilidad
• ❌ <strong>R</strong>elevant: Muy genérico
• ❌ <strong>T</strong>ime-bound: ¿"Lo más pronto posible" es cuándo?

<strong>Objetivo SMART correcto:</strong>
"Aumentar NPS de +40 a +50 en 12 meses mejorando Responsiveness de 3.60 a 4.0"`,
        error: 'Objetivo vago, no SMART'
    },
    {
        id: 'dist-wrong-metric',
        name: 'Reporte "Detractores Cero"',
        icon: '📊',
        room: 'oficina',
        position: { x: 650, y: 120 },
        content: `<strong>📊 Reporte de Éxito</strong>

"¡Misión cumplida! Solo tenemos 0.4% de detractores.

Prácticamente CERO detractores = satisfacción perfecta.

No hay necesidad de invertir en mejoras. El diagnóstico confirma que somos excelentes."`,
        feedback: `<span class="text-error">❌ DOCUMENTO FALSO</span>

¡Métrica incorrecta para la conclusión!

<strong>Error:</strong> Pocos detractores ≠ satisfacción perfecta

<strong>Realidad ignorada:</strong>
• 59.1% son PASIVOS (no promotores)
• Los pasivos son vulnerables a irse con la competencia
• La oportunidad está en convertir pasivos → promotores

<strong>Lección:</strong> Elegir la métrica correcta para el diagnóstico correcto. Aquí el problema no son los detractores, son los pasivos.`,
        error: 'Enfocarse en la métrica equivocada'
    },
    {
        id: 'dist-pie-chart',
        name: 'Gráfico Circular Colorido',
        icon: '🥧',
        room: 'galeria',
        position: { x: 150, y: 300 },
        isChart: true,
        chartImage: 'images/charts/wrong_pie_organizations.png',
        content: `<strong>🎨 Visualización: NPS por Organización</strong>

<div class="chart-container">
    <img src="images/charts/wrong_pie_organizations.png" alt="Pie Chart" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
    <div class="chart-placeholder" style="display:none;">
        [Pie Chart con 6 segmentos de colores rainbow]
        - Cada segmento representa un tipo de organización
        - Leyenda a un lado con 6 items
        - Difícil comparar tamaños de segmentos similares
    </div>
</div>

"Gráfico circular con los 6 tipos de organización.
¡Muy colorido y ejecutivo!"`,
        feedback: `<span class="text-error">❌ VISUALIZACIÓN INCORRECTA</span>

Pie charts NO funcionan para comparar 6+ categorías.

<strong>Problemas:</strong>
• Imposible comparar segmentos de tamaño similar
• ¿+57 vs +47 vs +40? No se puede ver la diferencia
• Los colores rainbow no comunican nada
• El ojo humano no compara ángulos con precisión

<strong>Alternativa correcta:</strong>
Barras horizontales ordenadas de mayor a menor.

<strong>Regla:</strong> Pie charts solo para 2-3 categorías con diferencias grandes.`,
        error: 'Pie chart con muchas categorías'
    },
    {
        id: 'dist-3d-chart',
        name: 'Gráfico 3D Ejecutivo',
        icon: '📊',
        room: 'galeria',
        position: { x: 600, y: 150 },
        isChart: true,
        chartImage: 'images/charts/wrong_3d_servqual.png',
        content: `<strong>🎨 Dashboard Premium: SERVQUAL 3D</strong>

<div class="chart-container">
    <img src="images/charts/wrong_3d_servqual.png" alt="3D Chart" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
    <div class="chart-placeholder" style="display:none;">
        [Gráfico de barras 3D con sombras y gradientes]
        - Las barras se ven con perspectiva
        - Difícil ver valores exactos
        - Efectos de sombra y brillo
    </div>
</div>

"Gráfico 3D con efectos profesionales.
Sombras, gradientes y perspectiva para impactar a la junta."`,
        feedback: `<span class="text-error">❌ VISUALIZACIÓN INCORRECTA</span>

El 3D distorsiona la percepción de valores.

<strong>Problemas:</strong>
• Empatía (3.91) parece similar a Responsiveness (3.60)
• La perspectiva oculta diferencias reales
• Los gradientes agregan ruido visual
• Las sombras no comunican datos

<strong>Impacto:</strong>
La diferencia de 0.31 puntos (8%) entre dimensiones se pierde visualmente.

<strong>Regla:</strong> NUNCA uses 3D para datos. La decoración NO es comunicación.`,
        error: '3D distorsiona percepción'
    }
];

// ============================================
// NPCs CON DIÁLOGOS
// ============================================
const NPCS = {
    mayordomo: {
        id: 'mayordomo',
        name: 'Sir Bartholomew',
        title: 'Mayordomo del Castillo',
        icon: '🤵',
        room: 'vestibulo',
        position: { x: 600, y: 350 },
        hasImage: true,
        imagePath: 'images/npcs/mayordomo.png',
        dialog: `Bienvenido al Castillo Von Donativo, joven analista.

El Conde os espera en sus aposentos, pero primero debéis reunir la evidencia necesaria para el Gran Consejo.

<strong>Vuestra misión:</strong>
• Recolectad los 8 pergaminos con evidencia verdadera
• Evitad los documentos falsos del Brujo del Sesgo
• Regresad aquí antes de que la arena se agote

<strong>Controles del reino:</strong>
🗝️ WASD o flechas — Caminar
🗝️ E o Espacio — Examinar/Hablar

<em>Que la sabiduría estadística os acompañe...</em>`
    },
    cientifica: {
        id: 'cientifica',
        name: 'Dama Alquimia',
        title: 'Alquimista de Números',
        icon: '👩‍🔬',
        room: 'laboratorio',
        position: { x: 100, y: 350 },
        hasImage: true,
        imagePath: 'images/npcs/alquimista.png',
        dialog: `Ah, otro buscador de verdades numéricas.

En mi laboratorio aprenderás que <strong>un número solo cuenta una parte de la historia</strong>.

El NPS de +40 parece bueno... pero ¿sabéis que el 59% son pasivos?

<strong>Consejo de la Alquimista:</strong>
Siempre preguntad: "¿Cómo se distribuyen los datos?"
Un promedio puede ocultar problemas graves en segmentos específicos.

El Brujo del Sesgo adora los resúmenes simples que ocultan la complejidad...`
    },
    ejecutiva: {
        id: 'ejecutiva',
        name: 'Lady Hipótesis',
        title: 'Consejera de Pruebas',
        icon: '👔',
        room: 'sala-juntas',
        position: { x: 400, y: 100 },
        hasImage: true,
        imagePath: 'images/npcs/ejecutiva.png',
        dialog: `En esta sala se toman las decisiones importantes.

Pero cuidado: el Brujo del Sesgo ha dejado documentos que confunden <strong>correlación con causalidad</strong>.

<strong>Lección de la Consejera:</strong>
Que dos cosas ocurran juntas NO significa que una cause la otra.

El Norte tiene más sol Y más satisfacción... ¿El sol causa satisfacción? ¡Por supuesto que no!

Buscad las comparaciones válidas entre regiones y segmentos.`
    },
    bibliotecario: {
        id: 'bibliotecario',
        name: 'Maestro Estrategio',
        title: 'Guardián de los FODA',
        icon: '📚',
        room: 'biblioteca',
        position: { x: 600, y: 350 },
        hasImage: true,
        imagePath: 'images/npcs/bibliotecario.png',
        dialog: `En estos estantes reposan mil FODAs... pero solo los basados en datos tienen valor.

<strong>Un FODA sin evidencia es poesía, no estrategia.</strong>

Compare estos dos enunciados:
❌ "Somos buena onda" — ¿Según quién?
✓ "Empatía 3.91/5, más alta en SERVQUAL" — Medible

El Conde no puede presentar sentimientos ante el Gran Consejo. Necesita números.`
    },
    detective: {
        id: 'detective',
        name: 'Inspector Fuentes',
        title: 'Verificador de Evidencia',
        icon: '🕵️',
        room: 'archivo',
        position: { x: 150, y: 350 },
        hasImage: true,
        imagePath: 'images/npcs/detective.png',
        dialog: `Este archivo contiene secretos del reino y del mundo exterior.

Pero <strong>cuidado con las fuentes no verificables</strong>.

El Brujo del Sesgo dejó documentos con:
• "Fuentes cercanas dicen..." — ¿Quién? Anónimo.
• "Se rumorea que..." — Chisme, no dato.
• "Podría ser que..." — Especulación.

<strong>Solo los hechos verificables sirven al Conde.</strong>
Documentos oficiales. Estadísticas públicas. Fuentes citables.`
    },
    curadora: {
        id: 'curadora',
        name: 'Maestra Visualia',
        title: 'Artista de Datos',
        icon: '👩‍🎨',
        room: 'galeria',
        position: { x: 100, y: 150 },
        hasImage: true,
        imagePath: 'images/npcs/curadora.png',
        dialog: `¡Bienvenido a mi galería de visualizaciones!

Aquí aprenderás que <strong>un buen gráfico comunica en 3 segundos</strong>.

El Brujo del Sesgo dejó abominaciones:
🚫 Gráficos 3D que distorsionan
🚫 Pie charts con 6+ categorías
🚫 Colores rainbow sin propósito
🚫 Títulos que describen en vez de iluminar

<strong>El arte de los datos no decora. COMUNICA.</strong>

Buscad el gráfico que cuente una historia clara.`
    },
    conde: {
        id: 'conde',
        name: 'Conde Von Donativo',
        title: 'Noble Benefactor',
        icon: '🧛',
        room: 'vestibulo',
        position: { x: 400, y: 100 },
        hasImage: true,
        imagePath: 'images/npcs/conde.png',
        dialog: `Ah, mi joven analista de la Orden de los Datos.

El Gran Consejo se reúne pronto y necesito evidencia irrefutable.

<strong>¿Tenéis los 8 pergaminos de verdad?</strong>

Recordad:
• Datos sólidos, no opiniones
• Comparaciones válidas, no correlaciones espurias
• Visualizaciones que iluminen, no que decoren

La donación de <strong>10 millones de monedas de oro</strong> depende de vuestro trabajo.

<em>Cuando tengáis todo, regresad a mí.</em>`,
        isCondeForDelivery: true
    }
};

// ============================================
// DEFINICIÓN DE HABITACIONES
// ============================================
const ROOMS = {
    vestibulo: {
        id: 'vestibulo',
        name: 'Gran Vestíbulo',
        description: 'La entrada principal del Castillo Von Donativo',
        cssClass: 'room-vestibulo',
        hasImage: true,
        imagePath: 'images/rooms/vestibulo.png',
        doors: {
            north: null,
            south: 'archivo',
            east: null,
            west: null
        },
        doorPositions: {
            south: { x: 384, y: 460, width: 80, height: 40 }
        },
        walls: [
            { x: 0, y: 0, width: 800, height: 40 },
            { x: 0, y: 0, width: 40, height: 500 },
            { x: 760, y: 0, width: 40, height: 500 },
            { x: 0, y: 460, width: 350, height: 40 },
            { x: 450, y: 460, width: 350, height: 40 }
        ],
        furniture: [
            { icon: '🪴', x: 60, y: 60 },
            { icon: '🪴', x: 700, y: 60 },
            { icon: '🛋️', x: 200, y: 200 },
            { icon: '🕯️', x: 60, y: 200 },
            { icon: '🕯️', x: 700, y: 200 },
            { icon: '🏰', x: 380, y: 50 }
        ],
        spawnPoint: { x: 384, y: 300 },
        isDeliveryRoom: true
    },
    archivo: {
        id: 'archivo',
        name: 'Archivo Secreto',
        description: 'Cámara de documentos clasificados del reino',
        cssClass: 'room-archivo',
        hasImage: true,
        imagePath: 'images/rooms/archivo.png',
        doors: {
            north: 'vestibulo',
            south: null,
            east: 'laboratorio',
            west: 'galeria'
        },
        doorPositions: {
            north: { x: 384, y: 0, width: 80, height: 40 },
            east: { x: 760, y: 230, width: 40, height: 80 },
            west: { x: 0, y: 230, width: 40, height: 80 }
        },
        walls: [
            { x: 0, y: 0, width: 350, height: 40 },
            { x: 450, y: 0, width: 350, height: 40 },
            { x: 0, y: 0, width: 40, height: 230 },
            { x: 0, y: 310, width: 40, height: 190 },
            { x: 760, y: 0, width: 40, height: 230 },
            { x: 760, y: 310, width: 40, height: 190 },
            { x: 0, y: 460, width: 800, height: 40 }
        ],
        furniture: [
            { icon: '🗄️', x: 100, y: 100 },
            { icon: '🗄️', x: 150, y: 100 },
            { icon: '🗄️', x: 600, y: 100 },
            { icon: '🗄️', x: 650, y: 100 },
            { icon: '🕯️', x: 400, y: 400 }
        ],
        spawnPoint: { x: 384, y: 80 }
    },
    laboratorio: {
        id: 'laboratorio',
        name: 'Laboratorio de Estadísticas',
        description: 'Taller de la Alquimista de Números',
        cssClass: 'room-laboratorio',
        hasImage: true,
        imagePath: 'images/rooms/laboratorio.png',
        doors: {
            north: 'oficina',
            south: null,
            east: null,
            west: 'archivo'
        },
        doorPositions: {
            north: { x: 384, y: 0, width: 80, height: 40 },
            west: { x: 0, y: 230, width: 40, height: 80 }
        },
        walls: [
            { x: 0, y: 0, width: 350, height: 40 },
            { x: 450, y: 0, width: 350, height: 40 },
            { x: 0, y: 0, width: 40, height: 230 },
            { x: 0, y: 310, width: 40, height: 190 },
            { x: 760, y: 0, width: 40, height: 500 },
            { x: 0, y: 460, width: 800, height: 40 }
        ],
        furniture: [
            { icon: '⚗️', x: 100, y: 80 },
            { icon: '🧪', x: 300, y: 80 },
            { icon: '📐', x: 600, y: 80 },
            { icon: '🔬', x: 650, y: 350 }
        ],
        spawnPoint: { x: 80, y: 270 }
    },
    galeria: {
        id: 'galeria',
        name: 'Galería de Visualizaciones',
        description: 'Salón de arte y gráficos del castillo',
        cssClass: 'room-galeria',
        hasImage: true,
        imagePath: 'images/rooms/galeria.png',
        doors: {
            north: 'biblioteca',
            south: null,
            east: 'archivo',
            west: null
        },
        doorPositions: {
            north: { x: 384, y: 0, width: 80, height: 40 },
            east: { x: 760, y: 230, width: 40, height: 80 }
        },
        walls: [
            { x: 0, y: 0, width: 350, height: 40 },
            { x: 450, y: 0, width: 350, height: 40 },
            { x: 0, y: 0, width: 40, height: 500 },
            { x: 760, y: 0, width: 40, height: 230 },
            { x: 760, y: 310, width: 40, height: 190 },
            { x: 0, y: 460, width: 800, height: 40 }
        ],
        furniture: [
            { icon: '🖼️', x: 60, y: 80 },
            { icon: '🖼️', x: 200, y: 80 },
            { icon: '🖼️', x: 500, y: 80 },
            { icon: '🖼️', x: 650, y: 80 },
            { icon: '🎨', x: 400, y: 380 }
        ],
        spawnPoint: { x: 720, y: 270 }
    },
    oficina: {
        id: 'oficina',
        name: 'Oficina del Conde',
        description: 'Aposentos privados del Conde Von Donativo',
        cssClass: 'room-oficina',
        hasImage: true,
        imagePath: 'images/rooms/oficina.png',
        doors: {
            north: null,
            south: 'laboratorio',
            east: null,
            west: 'sala-juntas'
        },
        doorPositions: {
            south: { x: 384, y: 460, width: 80, height: 40 },
            west: { x: 0, y: 230, width: 40, height: 80 }
        },
        walls: [
            { x: 0, y: 0, width: 800, height: 40 },
            { x: 0, y: 0, width: 40, height: 230 },
            { x: 0, y: 310, width: 40, height: 190 },
            { x: 760, y: 0, width: 40, height: 500 },
            { x: 0, y: 460, width: 350, height: 40 },
            { x: 450, y: 460, width: 350, height: 40 }
        ],
        furniture: [
            { icon: '👑', x: 400, y: 80 },
            { icon: '💼', x: 600, y: 200 },
            { icon: '📜', x: 100, y: 80 },
            { icon: '🏆', x: 680, y: 80 }
        ],
        spawnPoint: { x: 384, y: 420 }
    },
    'sala-juntas': {
        id: 'sala-juntas',
        name: 'Sala del Gran Consejo',
        description: 'Donde se reúnen los Doce Sabios',
        cssClass: 'room-sala-juntas',
        hasImage: true,
        imagePath: 'images/rooms/sala-juntas.png',
        doors: {
            north: null,
            south: 'archivo',
            east: 'oficina',
            west: 'biblioteca'
        },
        doorPositions: {
            south: { x: 384, y: 460, width: 80, height: 40 },
            east: { x: 760, y: 230, width: 40, height: 80 },
            west: { x: 0, y: 230, width: 40, height: 80 }
        },
        walls: [
            { x: 0, y: 0, width: 800, height: 40 },
            { x: 0, y: 0, width: 40, height: 230 },
            { x: 0, y: 310, width: 40, height: 190 },
            { x: 760, y: 0, width: 40, height: 230 },
            { x: 760, y: 310, width: 40, height: 190 },
            { x: 0, y: 460, width: 350, height: 40 },
            { x: 450, y: 460, width: 350, height: 40 }
        ],
        furniture: [
            { icon: '🪑', x: 200, y: 180 },
            { icon: '🪑', x: 300, y: 180 },
            { icon: '🪑', x: 400, y: 180 },
            { icon: '🪑', x: 500, y: 180 },
            { icon: '🪑', x: 600, y: 180 },
            { icon: '⚔️', x: 400, y: 60 }
        ],
        spawnPoint: { x: 384, y: 420 }
    },
    biblioteca: {
        id: 'biblioteca',
        name: 'Biblioteca del Saber',
        description: 'Repositorio de conocimiento estratégico',
        cssClass: 'room-biblioteca',
        hasImage: true,
        imagePath: 'images/rooms/biblioteca.png',
        doors: {
            north: null,
            south: 'galeria',
            east: 'sala-juntas',
            west: null
        },
        doorPositions: {
            south: { x: 384, y: 460, width: 80, height: 40 },
            east: { x: 760, y: 230, width: 40, height: 80 }
        },
        walls: [
            { x: 0, y: 0, width: 800, height: 40 },
            { x: 0, y: 0, width: 40, height: 500 },
            { x: 760, y: 0, width: 40, height: 230 },
            { x: 760, y: 310, width: 40, height: 190 },
            { x: 0, y: 460, width: 350, height: 40 },
            { x: 450, y: 460, width: 350, height: 40 }
        ],
        furniture: [
            { icon: '📚', x: 60, y: 80 },
            { icon: '📚', x: 60, y: 150 },
            { icon: '📚', x: 60, y: 220 },
            { icon: '📚', x: 60, y: 290 },
            { icon: '🕯️', x: 300, y: 250 },
            { icon: '📖', x: 300, y: 300 }
        ],
        spawnPoint: { x: 384, y: 420 }
    }
};

// Mapa de conexiones para navegación
const ROOM_CONNECTIONS = {
    vestibulo: { north: null, south: 'archivo', east: null, west: null },
    archivo: { north: 'vestibulo', south: null, east: 'laboratorio', west: 'galeria' },
    laboratorio: { north: 'oficina', south: null, east: null, west: 'archivo' },
    galeria: { north: 'biblioteca', south: null, east: 'archivo', west: null },
    oficina: { north: null, south: 'laboratorio', east: null, west: 'sala-juntas' },
    'sala-juntas': { north: null, south: 'archivo', east: 'oficina', west: 'biblioteca' },
    biblioteca: { north: null, south: 'galeria', east: 'sala-juntas', west: null }
};
