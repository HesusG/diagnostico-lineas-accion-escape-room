# Guía de Solución de Problemas - Bugs Corregidos

## Resumen de Correcciones

Se corrigieron 4 bugs críticos en el juego. A continuación se explica cada uno y cómo ajustarlo si es necesario.

---

## 1. ✅ Puertas del Pasillo No Funcionaban

### Problema
Las puertas del Pasillo Central usaban `customDoors` pero el código de detección en `player.js` solo buscaba `doorPositions`.

### Solución Implementada
En [`js/player.js`](file:///c:/Users/HG_Co/OneDrive/Documents/Github/diagnostico-lineas-accion-escape-room/js/player.js):

- Agregué detección de `customDoors` en el método `checkDoors()`
- Creé un nuevo método `getOppositeDirection()` para determinar desde qué dirección entrar a cada sala

### Cómo Ajustar
Si necesitas cambiar la lógica de entrada:
- En `player.js`, busca el método `getOppositeDirection()`
- Modifica los arrays `upperRooms` y `lowerRooms` según la distribución de tus salas

---

## 2. ✅ Puertas Ahora Son CSS

### Problema
Las puertas usaban el emoji 🚪 en lugar de un diseño CSS.

### Solución Implementada
En [`css/styles.css`](file:///c:/Users/HG_Co/OneDrive/Documents/Github/diagnostico-lineas-accion-escape-room/css/styles.css):

- Creé la clase `.door-css` con:
  - **Diseño de madera**: Gradiente café (#8B4513, #A0522D)
  - **Manija dorada**: Círculo ::before con color #FFD700
  - **Línea vertical**: ::after para simular el marco
  - **Sombras**: Efecto 3D con box-shadow

En [`js/rooms.js`](file:///c:/Users/HG_Co/OneDrive/Documents/Github/diagnostico-lineas-accion-escape-room/js/rooms.js):

- Reemplacé `doorIcon.textContent = '🚪'` con `doorIcon.className = 'door-css'`

### Cómo Ajustar
Para cambiar el aspecto de las puertas:

```css
/* En css/styles.css */
.door-css {
    background: linear-gradient(to right, #TU_COLOR1, #TU_COLOR2);
    border: 2px solid #TU_BORDE;
    /* ... */
}

/* Cambiar color de la manija */
.door-css::before {
    background: #TU_COLOR_MANIJA;
}
```

---

## 3. ✅ Burbuja del Mayordomo Corregida

### Problema
La burbuja de diálogo se sobreponía con otros elementos (z-index 70).

### Solución Implementada
En [`css/styles.css`](file:///c:/Users/HG_Co/OneDrive/Documents/Github/diagnostico-lineas-accion-escape-room/css/styles.css):

- Aumenté `z-index` a `100`
- Moví `top` a `-55px` (más arriba)
- Agregué `max-width: 200px` para evitar texto muy largo
- Agregué `text-align: center`

### Cómo Ajustar
Si la burbuja aún se solapa:

```css
.speech-bubble {
    top: -60px;        /* Más arriba */
    z-index: 150;      /* Más alto */
    max-width: 180px;  /* Más angosto */
}
```

---

## 4. ✅ Minimapa Ahora Visible

### Problema
El minimapa estaba `position: absolute` sin contexto correcto y se salía de pantalla.

### Solución Implementada
En [`css/styles.css`](file:///c:/Users/HG_Co/OneDrive/Documents/Github/diagnostico-lineas-accion-escape-room/css/styles.css):

- Cambié a `position: fixed` (relativo a viewport)
- Ajusté `top: 80px` (debajo del HUD)
- Aumenté `z-index` a `1000` (siempre visible)

### Cómo Ajustar
Para mover el minimapa:

```css
#minimap-container {
    top: 100px;     /* Más abajo */
    right: 30px;    /* Más a la izquierda */
    width: 140px;   /* Más grande */
    height: 120px;
}
```

---

## Verificación Manual

### Pasos de Prueba

1. **Abrir** `index.html` en navegador
2. **Login** con `Teleton25`
3. **Ir al Vestíbulo** → Verificar que el mayordomo brilla y tiene burbuja visible
4. **Ir al Pasillo Central**:
   - Verificar que las 7 puertas son visibles (R, 1-6)
   - Verificar que las puertas son de madera café con manija dorada (NO emojis)
   - **Intentar cruzar cada puerta** → Todas deben funcionar
5. **Verificar minimapa** en esquina superior derecha → Debe estar visible TODO el tiempo

### Checklist de Verificación
- [ ] Todas las puertas del pasillo funcionan
- [ ] Las puertas tienen diseño CSS (madera café)
- [ ] El minimapa está visible en la esquina superior derecha
- [ ] La burbuja del mayordomo no se solapa
- [ ] Al hacer click en mayordomo, la burbuja desaparece

---

## Notas Técnicas

### Archivos Modificados
1. **js/player.js** - Sistema de colisión de puertas
2. **js/rooms.js** - Renderizado de puertas
3. **css/styles.css** - Estilos visuales

### Dependencias
- Las puertas del pasillo dependen de la propiedad `customDoors` en `js/data.js`
- El método `getOppositeDirection()` asume la estructura actual de salas (1-6, R)

### Posibles Problemas Futuros
- Si agregas más salas al pasillo, actualiza `customDoors` en `data.js` Y `getOppositeDirection()` en `player.js`
- Si cambias el layout de pantalla, ajusta `top` del minimapa en `styles.css`
