# Walkthrough - Embellecimiento y Login

Se han implementado las mejoras visuales y funcionales solicitadas, manteniendo el uso de emojis pero elevando la estética a un estilo "Retro Pixel Art".

## Cambios Realizados

### 1. Pantalla de Login (Seguridad)
- Se añadió una nueva pantalla inicial que bloquea el acceso.
- **Contraseña**: `Teleton25`
- **Estética**: Terminal de hacker / Sistema de seguridad retro con efectos de "glitch".

### 2. Estilo Visual (Embellecimiento)
- **Fuentes**: Se integraron `Press Start 2P` (títulos) y `VT323` (textos) de Google Fonts.
- **UI**:
  - Botones con bordes sólidos y sombras duras (pixel style).
  - Ventanas modales con bordes gruesos y sombras.
  - HUD y Inventario con estilo de consola retro.
  - **Nuevo Minimapa**: Radar en la esquina superior derecha que muestra la ubicación actual en el castillo.
- **Fondos y Paredes**:
  - **Paredes Visibles**: Ahora las colisiones se renderizan visualmente como muros de ladrillo oscuro.
  - **Suelos**: Patrones CSS complejos (rayas, cuadrículas, radiales) para dar textura a cada habitación.
  - **Decoración**: Se añadieron más objetos decorativos (muebles, antorchas, escudos) a cada habitación para darles más personalidad.
- **Resolución**: Se implementó escalado automático CSS (`transform: scale()`) para que el juego se vea bien en pantallas grandes (1920x1080) sin perder su relación de aspecto.
- **Pantalla de Inicio**: Se ajustó para ser responsiva y permitir scroll si el texto es muy largo.

### 3. Mecánicas y Layout
- **Nuevo Layout "Palanca de Cambios"**:
  - El mapa del castillo ahora sigue un patrón de palanca de cambios de 6 velocidades.
  - **R (Vestíbulo)**: Punto de inicio.
  - **H (Pasillo Central)**: Eje conector.
  - **1-6 (Salas)**: Oficina, Laboratorio, Sala de Juntas, Archivo, Biblioteca, Galería.
  - **Minimapa**: Se actualizó para reflejar este diseño específico con líneas de conexión.
- **Colisiones**: Se refinó el sistema de movimiento para evitar que el jugador se quede atascado en las paredes al deslizarse.
- **Interacción**:
  - **Click**: Ahora puedes hacer click en objetos y NPCs para interactuar con ellos si estás cerca, además de usar la tecla [E].
  - **NPCs**: Se añadieron etiquetas con nombres sobre los personajes para identificarlos fácilmente.

## Cómo Probar

1. **Abrir `index.html`** en el navegador.
2. **Login**:
   - Ingresar `Teleton25` -> Acceder al juego.
3. **Exploración**:
   - Verificar el **Minimapa**: Debe mostrar el patrón de palanca de cambios (R, H, 1-6).
   - Navegar por el **Pasillo Central** y entrar a las diferentes salas numeradas.
   - Probar en pantalla completa (F11) o resolución 1920x1080 para verificar el escalado.
   - **Click**: Intentar hacer click en un objeto cercano para recogerlo o en un NPC para hablar.

## Archivos Modificados
- `index.html`: Estructura del login, fuentes y contenedor del minimapa.
- `css/styles.css`: Estilos retro, animaciones, patrones de fondo, textura de muros, estilos del minimapa, escalado responsivo y scroll en inicio.
- `js/game.js`: Lógica de validación de contraseña.
- `js/rooms.js`: Renderizado dinámico de paredes, minimapa (layout palanca), etiquetas de NPCs y eventos de click.
- `js/player.js`: Lógica de colisión mejorada (sliding).
- `js/data.js`: Nueva estructura de habitaciones (Pasillo) y conexiones.
