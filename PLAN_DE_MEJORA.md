# Plan de Embellecimiento y Mejoras - La Misión del Conde Donador

Este documento detalla el estado actual del prototipo y las mejoras propuestas para transformar el proyecto en una experiencia de videojuego "Top Down" pulida y atractiva.

## Tabla Comparativa de Mejoras

| Característica | Implementación Actual | Mejora Propuesta (Embellecimiento) |
| :--- | :--- | :--- |
| **Acceso** | Botón directo "Comenzar Misión" en la pantalla de inicio. | **Pantalla de Login "Top Secret"**: Campo de contraseña que requiere "Teleton25" para iniciar, con estética de terminal o pergamino antiguo digitalizado. |
| **Gráficos del Mundo** | Fondos con gradientes CSS simples (`linear-gradient`) para diferenciar habitaciones. | **Estilo Retro-Moderno**: Mantener el uso creativo de CSS para fondos, pero añadir texturas sutiles (patrones de puntos o líneas) para dar profundidad sin necesitar imágenes pesadas. |
| **Personajes (NPCs y Jugador)** | Emojis estáticos (🧑‍💼, 🧛, 🤵). | **Emojis Animados**: Dar vida a los emojis con animaciones CSS (rebote al caminar, respiración, efectos de estado). |
| **Objetos e Items** | Emojis (📦, 📄) con efectos de brillo CSS básico. | **Efectos Visuales**: Mejorar los "glamours" de los objetos (brillos, auras) usando `box-shadow` y `filter` para que destaquen sobre el fondo oscuro. |
| **Interfaz de Usuario (UI)** | Botones estándar con bordes redondeados y colores planos. Fuentes del sistema (`Segoe UI`). | **UI Temática**: Marcos estilo RPG (bordes dorados/piedra), fuente "Pixel" o "Medieval Fantasy" legible. Botones con estados hover animados y sonidos de click. |
| **Narrativa y Diálogos** | Modales de texto plano sobre fondo oscuro. | **Sistema de Diálogo RPG**: Caja de texto en la parte inferior con retrato del personaje que habla, efecto de "máquina de escribir" para el texto. |
| **Feedback Visual** | Alertas simples y cambios de color en texto. | **Feedback Jugoso ("Juice")**: Shake de pantalla al cometer errores, confeti o partículas al encontrar evidencia correcta, transiciones suaves entre habitaciones. |
| **Audio** | (Asumido) Básico o inexistente. | **Ambiente Inmersivo**: Música de fondo (BGM) misteriosa pero enérgica. Efectos de sonido (SFX) para pasos, recolección de items y UI. |

## Pasos de Implementación

### 1. Sistema de Login (Prioridad Alta)
- Crear una nueva vista inicial que oculte el resto del juego.
- Implementar validación de input: si `input === "Teleton25"`, transición a la pantalla de introducción.
- Estilizar el input para que parezca un sistema de seguridad o un sello mágico.

### 2. Integración de Gráficos (Beautification)
- Reemplazar los contenedores `div` de las habitaciones con un sistema que permita fondos de imagen (o Canvas si se desea mayor complejidad, pero CSS `background-image` con `image-rendering: pixelated` es suficiente para este prototipo).
- Importar fuentes de Google Fonts (ej. 'Press Start 2P' o 'VT323') para textos de interfaz.
- Reemplazar emojis por imágenes (`<img>` o `background-image` en sprites).

### 3. Pulido de UI/UX
- Rediseñar el HUD (Timer, Contadores) para que parezca un panel de control o un pergamino.
- Mejorar los modales de "Documento Encontrado" para que parezcan hojas de papel real en pantalla.

### 4. Animación y Efectos
- Implementar animaciones CSS (`@keyframes`) para los emojis: `float`, `bounce`, `pulse`.
- Crear clases utilitarias para efectos visuales.

## Estructura de Archivos Propuesta

```
/
├── index.html
├── css/
│   ├── styles.css       (Estilos base y tema)
│   └── animations.css   (Efectos y transiciones)
├── js/
│   ├── game.js          (Lógica principal)
│   └── ...
└── assets/
    └── fonts/           (Fuentes locales si es necesario)
```
