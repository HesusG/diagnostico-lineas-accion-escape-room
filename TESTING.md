# 🧪 Plan de Testing - Escape Room "La Misión del Conde Donador"

## 📋 Happy Path (Flujo Ideal)

### Fase 1: Autenticación y Configuración
1. **Login**
   - Abrir `index.html` en el navegador
   - Ingresar contraseña: `Teleton25`
   - Verificar que avanza a selección de personaje

2. **Selección de Personaje**
   - Seleccionar género (masculino/femenino)
   - Ingresar nombre del jugador
   - Hacer clic en "Confirmar"
   - Verificar que avanza a pantalla de inicio

3. **Pantalla de Inicio**
   - ✅ Verificar que la imagen del Conde se muestra (sin placeholder)
   - ✅ Leer la narrativa del juego
   - Hacer clic en "🚀 Comenzar Misión"

### Fase 2: Gameplay Principal

4. **Inicio en Vestíbulo**
   - ✅ Verificar que el jugador aparece en el centro del vestíbulo
   - ✅ Verificar que el HUD muestra:
     - Temporizador: 30:00
     - Evidencias: 0/8
     - Errores: 0/3
   - ✅ Verificar que el minimapa está centrado entre el título y el HUD

5. **Interacción con Mayordomo**
   - Acercarse al Mayordomo (NPC en vestíbulo)
   - ✅ Verificar que aparece hint "[E] Hablar"
   - Presionar `E` o `Espacio`
   - Leer diálogo de introducción
   - Cerrar diálogo

6. **Navegación al Pasillo**
   - Moverse hacia arriba (puerta norte)
   - ✅ Verificar que la puerta está ARRIBA (no abajo)
   - Entrar al Pasillo Central

7. **Exploración del Pasillo**
   - ✅ Verificar distribución de puertas:
     - **Arriba**: R (Vestíbulo), 1 (Oficina), 3 (Sala Juntas), 5 (Biblioteca)
     - **Abajo**: 2 (Laboratorio), 4 (Archivo), 6 (Galería)
   - ✅ Verificar que NO hay hueco extra a la izquierda de puerta 2

8. **Visitar Laboratorio (Puerta 2)**
   - Entrar por puerta 2 (abajo)
   - ✅ Verificar que la puerta interna está ABAJO (sur)
   - Hablar con Dama Alquimia (NPC)
   - ✅ Verificar que el sprite del NPC está centrado correctamente
   - Recolectar evidencias correctas:
     - 📊 Pergamino de Composición NPS
     - 📈 Códice SERVQUAL

9. **Visitar Sala Juntas (Puerta 3)**
   - Regresar al pasillo
   - Entrar por puerta 3 (arriba)
   - ✅ Verificar que la puerta interna está ABAJO (sur)
   - Hablar con Lady Hipótesis
   - Recolectar evidencias correctas

10. **Visitar Biblioteca (Puerta 5)**
    - Entrar por puerta 5 (arriba, extremo izquierdo)
    - ✅ Verificar que se puede acceder sin problemas
    - ✅ Verificar que la puerta interna está ABAJO (sur)
    - Hablar con Maestro Estrategio
    - Recolectar evidencia FODA

11. **Visitar Archivo (Puerta 4)**
    - Entrar por puerta 4 (abajo, centro)
    - ✅ Verificar que la puerta interna está ABAJO (sur)
    - Hablar con Inspector Fuentes
    - Recolectar evidencias

12. **Visitar Galería (Puerta 6)**
    - Entrar por puerta 6 (abajo, derecha)
    - ✅ Verificar que la puerta interna está ABAJO (sur)
    - Hablar con Maestra Visualia
    - Recolectar visualizaciones correctas

13. **Completar Misión**
    - Regresar al Vestíbulo (puerta R)
    - Hablar con el Conde
    - Entregar las 8 evidencias
    - Ver pantalla de victoria con tiempo

### Fase 3: Verificación de Controles

14. **Sistema de Movimiento**
    - ✅ Probar teclas WASD
    - ✅ Probar flechas direccionales
    - ✅ Verificar movimiento diagonal fluido
    - ✅ Verificar que NO se pega a las paredes
    - ✅ Verificar colisiones con muebles

15. **Sistema de Interacción**
    - ✅ Probar tecla `E`
    - ✅ Probar tecla `Espacio`
    - ✅ Probar clic en objetos
    - ✅ Probar clic en NPCs

---

## 🧪 Test Cases Específicos

### TC-001: Validación de Imagen del Conde
**Objetivo**: Verificar que la imagen del conde se muestra correctamente sin placeholder

**Pasos**:
1. Llegar a pantalla de inicio
2. Observar la sección derecha

**Resultado Esperado**:
- ✅ La imagen `conde_start.png` se muestra
- ✅ NO se ve el texto "🏰 Imagen del Conde"
- ✅ La imagen ocupa todo el espacio del contenedor

---

### TC-002: Posicionamiento de NPCs
**Objetivo**: Verificar que los sprites de NPCs están correctamente centrados

**Pasos**:
1. Visitar cada habitación con NPC
2. Observar la posición del sprite

**Habitaciones a verificar**:
- Vestíbulo: Mayordomo
- Laboratorio: Dama Alquimia
- Sala Juntas: Lady Hipótesis
- Biblioteca: Maestro Estrategio
- Archivo: Inspector Fuentes
- Galería: Maestra Visualia

**Resultado Esperado**:
- ✅ Sprites de 64x64px centrados en su posición
- ✅ No se superponen con muebles
- ✅ Etiquetas de nombre visibles arriba del sprite
- ✅ Hint "[E] Hablar" visible al acercarse

---

### TC-003: Orientación de Puertas en Pasillo
**Objetivo**: Verificar que las puertas están en las posiciones correctas

**Pasos**:
1. Entrar al Pasillo desde Vestíbulo
2. Contar puertas arriba y abajo

**Resultado Esperado**:
- **Arriba (4 puertas)**: R, 1, 3, 5
- **Abajo (3 puertas)**: 2, 4, 6
- ✅ NO hay hueco vacío a la izquierda de puerta 2
- ✅ Todas las puertas tienen etiquetas visibles

---

### TC-004: Orientación de Puertas Internas
**Objetivo**: Verificar que las puertas dentro de cada habitación apuntan en la dirección correcta

**Pasos**:
1. Entrar a cada habitación desde el pasillo
2. Observar dónde está la puerta de salida

**Resultado Esperado**:

| Habitación | Puerta en Pasillo | Puerta Interna Esperada |
|------------|-------------------|-------------------------|
| Vestíbulo (R) | Arriba | ✅ Norte (arriba) |
| Oficina (1) | Arriba | ✅ Sur (abajo) |
| Sala Juntas (3) | Arriba | ✅ Sur (abajo) |
| Biblioteca (5) | Arriba | ✅ Sur (abajo) |
| Laboratorio (2) | Abajo | ✅ Sur (abajo) |
| Archivo (4) | Abajo | ✅ Sur (abajo) |
| Galería (6) | Abajo | ✅ Sur (abajo) |

---

### TC-005: Fluidez de Movimiento
**Objetivo**: Verificar que el movimiento es suave y sin bugs

**Pasos**:
1. Mover al jugador en todas direcciones
2. Probar movimiento diagonal
3. Intentar atravesar paredes
4. Caminar pegado a las paredes

**Resultado Esperado**:
- ✅ Movimiento fluido sin saltos
- ✅ Diagonal normalizada (no más rápido)
- ✅ NO puede atravesar paredes
- ✅ NO se pega a las paredes (sistema de deslizamiento funciona)
- ✅ Puede caminar pegado a muebles sin trabarse

---

### TC-006: Sistema de Colisiones
**Objetivo**: Verificar detección de colisiones

**Pasos**:
1. Intentar caminar a través de:
   - Paredes exteriores
   - Muebles (🪴, 🛋️, etc.)
   - NPCs
2. Intentar salir por zonas sin puerta

**Resultado Esperado**:
- ✅ Colisión con paredes funciona
- ✅ Colisión con muebles funciona
- ✅ Puede caminar cerca de NPCs
- ✅ Solo puede salir por puertas

---

### TC-007: Minimapa
**Objetivo**: Verificar posición y funcionalidad del minimapa

**Pasos**:
1. Observar el HUD superior
2. Cambiar de habitación

**Resultado Esperado**:
- ✅ Minimapa centrado horizontalmente
- ✅ Posicionado entre título de ubicación y resto del HUD
- ✅ Muestra habitación actual resaltada
- ✅ Se actualiza al cambiar de habitación

---

### TC-008: HUD Ampliado
**Objetivo**: Verificar que el HUD tiene el tamaño correcto

**Pasos**:
1. Observar el HUD superior
2. Comparar con el ancho del área de juego

**Resultado Esperado**:
- ✅ HUD tiene 800px de ancho (igual que área de juego)
- ✅ Altura mínima de 180px
- ✅ Todos los elementos visibles (timer, evidencias, errores)

---

### TC-009: Recolección de Evidencias
**Objetivo**: Verificar sistema de inventario

**Pasos**:
1. Recolectar una evidencia correcta
2. Recolectar un distractor (documento falso)
3. Observar contador de evidencias y errores

**Resultado Esperado**:
- ✅ Evidencia correcta: contador sube (0/8 → 1/8)
- ✅ Distractor: contador de errores sube (0/3 → 1/3)
- ✅ Sonido de recolección se reproduce
- ✅ Objeto desaparece o se vuelve transparente

---

### TC-010: Diálogos de NPCs
**Objetivo**: Verificar sistema de diálogos

**Pasos**:
1. Hablar con un NPC
2. Leer el diálogo
3. Cerrar el diálogo
4. Intentar moverse durante el diálogo

**Resultado Esperado**:
- ✅ Modal de diálogo aparece
- ✅ Texto legible y formateado
- ✅ NO puede moverse mientras el diálogo está abierto
- ✅ Puede cerrar con `ESC` o botón de cerrar
- ✅ Sonido de interacción se reproduce

---

### TC-011: Temporizador
**Objetivo**: Verificar funcionamiento del timer

**Pasos**:
1. Iniciar juego
2. Observar temporizador
3. Esperar que llegue a 5:00

**Resultado Esperado**:
- ✅ Inicia en 30:00
- ✅ Cuenta regresiva correctamente
- ✅ Cambia a amarillo en 5:00 (warning)
- ✅ Cambia a rojo en 1:00 (danger)
- ✅ Game over al llegar a 0:00

---

### TC-012: Accesibilidad de Biblioteca (Puerta 5)
**Objetivo**: Verificar que la puerta 5 es accesible

**Pasos**:
1. Ir al Pasillo
2. Localizar puerta 5 (arriba, extremo izquierdo)
3. Acercarse y presionar E

**Resultado Esperado**:
- ✅ Puerta 5 es visible
- ✅ Puerta 5 es clickeable
- ✅ Entra a la Biblioteca sin problemas
- ✅ Puede regresar al pasillo

---

## 🐛 Bugs Conocidos a Verificar

### BUG-001: Puerta del Vestíbulo
**Descripción**: La puerta del vestíbulo debería estar abajo, no arriba
**Estado**: ✅ CORREGIDO
**Verificar**: Puerta está en posición norte (arriba) como debe ser

### BUG-002: Posición de Puerta 5
**Descripción**: Puerta 5 estaba a la izquierda de R, debería estar después de 1 y 3
**Estado**: ✅ CORREGIDO
**Verificar**: Orden correcto: R, 1, 3, 5 (de izquierda a derecha)

### BUG-003: Hueco Extra en Pasillo
**Descripción**: Había un hueco vacío a la izquierda de puerta 2
**Estado**: ✅ CORREGIDO
**Verificar**: Solo 3 puertas abajo (2, 4, 6)

### BUG-004: Orientación de Puertas Internas
**Descripción**: Puertas 2, 4, 6 tenían puerta arriba cuando debería ser abajo
**Estado**: ✅ CORREGIDO
**Verificar**: Todas las puertas de habitaciones inferiores apuntan al sur

### BUG-005: Biblioteca Inaccesible
**Descripción**: No se podía acceder a puerta 5
**Estado**: ✅ CORREGIDO
**Verificar**: Puerta 5 funciona normalmente

### BUG-006: NPCs Mal Posicionados
**Descripción**: Sprites grandes quedaron en posiciones incorrectas
**Estado**: ✅ CORREGIDO
**Verificar**: Sprites centrados automáticamente con offset de 32px

### BUG-007: Placeholder del Conde Visible
**Descripción**: Se veía el texto placeholder junto con la imagen
**Estado**: ✅ CORREGIDO
**Verificar**: Solo imagen visible, sin texto placeholder

---

## 📊 Checklist de Verificación Rápida

### Pantallas
- [ ] Login funciona con contraseña correcta
- [ ] Selección de personaje funciona
- [ ] Imagen del conde se muestra sin placeholder
- [ ] Pantalla de inicio muestra toda la información

### Navegación
- [ ] Vestíbulo → Pasillo (puerta arriba)
- [ ] Pasillo → Todas las 7 habitaciones
- [ ] Regreso desde cualquier habitación al pasillo
- [ ] Minimapa se actualiza correctamente

### Puertas del Pasillo
- [ ] Arriba: R, 1, 3, 5 (4 puertas)
- [ ] Abajo: 2, 4, 6 (3 puertas)
- [ ] Todas las etiquetas visibles
- [ ] Todas las puertas funcionales

### NPCs
- [ ] Mayordomo (Vestíbulo) - centrado
- [ ] Dama Alquimia (Laboratorio) - centrado
- [ ] Lady Hipótesis (Sala Juntas) - centrado
- [ ] Maestro Estrategio (Biblioteca) - centrado
- [ ] Inspector Fuentes (Archivo) - centrado
- [ ] Maestra Visualia (Galería) - centrado
- [ ] Conde (Vestíbulo) - centrado

### Controles
- [ ] WASD funciona
- [ ] Flechas funcionan
- [ ] E interactúa
- [ ] Espacio interactúa
- [ ] Click en objetos funciona
- [ ] Click en NPCs funciona

### HUD
- [ ] Temporizador cuenta regresiva
- [ ] Contador de evidencias actualiza
- [ ] Contador de errores actualiza
- [ ] Minimapa centrado y funcional
- [ ] HUD tiene ancho de 800px

### Audio
- [ ] Música de fondo se reproduce
- [ ] Sonidos de interacción funcionan
- [ ] Botón de mute funciona

---

## 🎯 Criterios de Aceptación

El juego se considera **FUNCIONAL** si:

1. ✅ Todas las pantallas de flujo funcionan (Login → Personaje → Inicio → Juego)
2. ✅ El jugador puede moverse fluidamente sin trabarse
3. ✅ Todas las 7 habitaciones son accesibles desde el pasillo
4. ✅ Las puertas están en las posiciones correctas (layout correcto)
5. ✅ Los NPCs están centrados y son interactuables
6. ✅ Se pueden recolectar evidencias y distractores
7. ✅ El temporizador funciona correctamente
8. ✅ Se puede completar el juego (victoria o derrota)
9. ✅ La imagen del conde se muestra correctamente
10. ✅ El minimapa está centrado y funcional

---

## 📝 Notas de Testing

- **Navegador recomendado**: Chrome/Edge (mejor soporte para audio)
- **Resolución recomendada**: 1920x1080 o superior
- **Tiempo estimado de testing completo**: 15-20 minutos
- **Tiempo de happy path**: 5-7 minutos

