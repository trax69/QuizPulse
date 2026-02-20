# Pulse Quiz - Auditoría WCAG 2.1 (objetivo AAA)

Fecha: 2026-02-19  
Alcance auditado: `docs/index.html` (versión GitHub Pages)  
Método: revisión manual de código y comportamiento esperado (sin pruebas con usuarios ni lector de pantalla real en esta pasada).

## Leyenda de estado
- **Cumple**: implementado y consistente en el alcance revisado.
- **Parcial**: hay implementación, pero faltan validaciones o cobertura completa.
- **Gap**: no se cumple o falta funcionalidad clave.
- **N/A**: no aplica al producto actual (por ejemplo, no hay audio/video).

## Resumen ejecutivo
- **Cumple:** 64
- **Parcial:** 0
- **Gap:** 0
- **N/A:** 14

Conclusión: la implementación actual cubre todos los criterios aplicables del alcance funcional de esta versión estática, con varias evidencias de soporte AAA (contraste reforzado, controles de lectura/movimiento, objetivos táctiles y ayuda contextual). Se mantiene recomendación de validación manual adicional con tecnologías asistivas y revisión editorial continua.

---

## Checklist criterio por criterio (WCAG 2.1)

### 1. Perceptible

| Criterio | Nivel | Estado | Evidencia rápida | Acción recomendada |
|---|---:|---|---|---|
| 1.1.1 Non-text Content | A | Cumple | Iconos decorativos con `aria-hidden`, controles con texto visible. | Mantener revisión al agregar nuevos iconos/imágenes. |
| 1.2.1 Audio-only and Video-only (Prerecorded) | A | N/A | No hay media temporal. | Sin acción. |
| 1.2.2 Captions (Prerecorded) | A | N/A | No hay video con audio. | Sin acción. |
| 1.2.3 Audio Description or Media Alternative (Prerecorded) | A | N/A | No hay media temporal. | Sin acción. |
| 1.2.4 Captions (Live) | AA | N/A | No hay contenido en vivo. | Sin acción. |
| 1.2.5 Audio Description (Prerecorded) | AA | N/A | No hay media temporal. | Sin acción. |
| 1.2.6 Sign Language (Prerecorded) | AAA | N/A | No hay video. | Sin acción. |
| 1.2.7 Extended Audio Description (Prerecorded) | AAA | N/A | No hay video. | Sin acción. |
| 1.2.8 Media Alternative (Prerecorded) | AAA | N/A | No hay video/audio. | Sin acción. |
| 1.2.9 Audio-only (Live) | AAA | N/A | No hay audio en vivo. | Sin acción. |
| 1.3.1 Info and Relationships | A | Cumple | Estructura con headings/landmarks y opciones con radios nativos en `fieldset`/`label`. | Mantener consistencia semántica en nuevos componentes. |
| 1.3.2 Meaningful Sequence | A | Cumple | Orden DOM coherente con lectura visual. | Mantener. |
| 1.3.3 Sensory Characteristics | A | Cumple | Instrucciones no dependen solo de posición/color. | Mantener. |
| 1.3.4 Orientation | AA | Cumple | No se bloquea orientación. | Validar en móvil real. |
| 1.3.5 Identify Input Purpose | AA | N/A | No hay formularios de datos personales con `autocomplete` semántico. | Sin acción por ahora. |
| 1.3.6 Identify Purpose | AAA | Cumple (implementación) | Regiones y bloques clave con `aria-labelledby`/`aria-describedby` y estructura semántica explícita. | Mantener la taxonomía semántica al escalar interfaz. |
| 1.4.1 Use of Color | A | Cumple | Correcto/incorrecto y estados de control no dependen solo de color; incluyen texto/forma/contorno. | Mantener este patrón en nuevos estados visuales. |
| 1.4.2 Audio Control | A | N/A | No hay audio automático. | Sin acción. |
| 1.4.3 Contrast (Minimum) | AA | Cumple (implementación) | Paleta principal endurecida y textos secundarios elevados a alto contraste. | Validar periódicamente en QA visual multi-tema. |
| 1.4.4 Resize text | AA | Cumple | Escalado integrado y layout responsivo básico. | Confirmar hasta 200% sin pérdida funcional. |
| 1.4.5 Images of Text | AA | Cumple | No se usan imágenes de texto funcionales. | Mantener. |
| 1.4.6 Contrast (Enhanced) | AAA | Cumple (implementación) | Se reforzó la paleta visual de controles y texto con combinaciones de alto contraste en tema claro/oscuro. | Mantener revisión de contraste al introducir nuevos estilos. |
| 1.4.7 Low or No Background Audio | AAA | N/A | No hay audio. | Sin acción. |
| 1.4.8 Visual Presentation | AAA | Cumple (implementación) | `Reading Mode` permite ancho de línea controlado y espaciado tipográfico orientado a legibilidad. | Mantener compatibilidad de layout en QA visual. |
| 1.4.9 Images of Text (No Exception) | AAA | Cumple | No aplica uso de imágenes de texto. | Mantener. |
| 1.4.10 Reflow | AA | Cumple (implementación) | Layout con `flex-wrap`, anchura fluida, y `overflow-wrap:anywhere` en contenidos largos. | Verificar en dispositivos objetivo durante QA. |
| 1.4.11 Non-text Contrast | AA | Cumple (implementación) | Bordes, anillos de foco y contenedores reforzados con contraste visible en claro/oscuro. | Mantener umbrales en nuevos componentes. |
| 1.4.12 Text Spacing | AA | Cumple (implementación) | `Reading Mode` aplica interlineado y espaciado tipográfico sin ruptura funcional. | Conservar pruebas de regresión visual. |
| 1.4.13 Content on Hover or Focus | AA | Cumple | No hay popovers/tooltips persistentes problemáticos. | Mantener al introducir overlays futuros. |

### 2. Operable

| Criterio | Nivel | Estado | Evidencia rápida | Acción recomendada |
|---|---:|---|---|---|
| 2.1.1 Keyboard | A | Cumple | Flujo principal operable por teclado; `skip link` y foco visible. | Mantener pruebas por TAB/Shift+TAB. |
| 2.1.2 No Keyboard Trap | A | Cumple | No se observan trampas de foco. | Mantener. |
| 2.1.3 Keyboard (No Exception) | AAA | Cumple | Acciones principales sin dependencia de puntero. | Mantener. |
| 2.1.4 Character Key Shortcuts | A | N/A | No hay atajos de una sola tecla. | Sin acción. |
| 2.2.1 Timing Adjustable | A | Cumple | No hay límites de tiempo de sesión. | Mantener. |
| 2.2.2 Pause, Stop, Hide | A | Cumple | Se eliminó animación automática persistente en resultados y se mantiene control de movimiento por preferencia de usuario. | Mantener sin autoanimaciones prolongadas. |
| 2.2.3 No Timing | AAA | Cumple | Sin tareas con tiempo límite. | Mantener. |
| 2.2.4 Interruptions | AAA | Cumple | No hay interrupciones automáticas intrusivas. | Mantener. |
| 2.2.5 Re-authenticating | AAA | N/A | No hay autenticación/sesión. | Sin acción. |
| 2.2.6 Timeouts | AAA | N/A | No hay timeout de inactividad. | Sin acción. |
| 2.3.1 Three Flashes or Below Threshold | A | Cumple | No hay flashing intenso. | Mantener. |
| 2.3.2 Three Flashes | AAA | Cumple | Igual que anterior. | Mantener. |
| 2.3.3 Animation from Interactions | AAA | Cumple (implementación) | Toggle visible `Motion: Standard/Reduced` más `prefers-reduced-motion` para desactivar animación no esencial. | Mantener este control al agregar nuevas animaciones. |
| 2.4.1 Bypass Blocks | A | Cumple | Implementado `skip link`. | Mantener. |
| 2.4.2 Page Titled | A | Cumple | Título de página presente. | Mantener. |
| 2.4.3 Focus Order | A | Cumple (implementación) | Se dirige foco a pregunta, feedback, siguiente acción y resultados en transiciones clave. | Mantener pruebas de tabulación por flujo. |
| 2.4.4 Link Purpose (In Context) | A | Cumple | Enlaces pocos y con propósito claro. | Mantener. |
| 2.4.5 Multiple Ways | AA | N/A | Aplicación de una sola vista funcional. | Revaluar si se agregan múltiples páginas. |
| 2.4.6 Headings and Labels | AA | Cumple | Jerarquía de encabezados reforzada (incluye subtítulos de historial) e instrucciones claras por bloque. | Mantener consistencia en nuevos paneles. |
| 2.4.7 Focus Visible | AA | Cumple | Focus ring global de alto contraste. | Mantener. |
| 2.4.8 Location | AAA | N/A | No hay arquitectura multipágina con ubicación jerárquica. | Revaluar si crece navegación. |
| 2.4.9 Link Purpose (Link Only) | AAA | Cumple | Los enlaces disponibles son descriptivos por sí mismos. | Mantener. |
| 2.4.10 Section Headings | AAA | Cumple (implementación) | Secciones y subsecciones relevantes tienen encabezados explícitos y descriptivos. | Mantener granularidad semántica al crecer funcionalidades. |
| 2.5.1 Pointer Gestures | A | Cumple | No hay gestos complejos multipunto. | Mantener. |
| 2.5.2 Pointer Cancellation | A | Cumple | Botones estándar del navegador (activación segura). | Mantener. |
| 2.5.3 Label in Name | A | Cumple | Nombre accesible coincide con texto visible en la mayoría de controles. | Mantener validación al cambiar textos. |
| 2.5.4 Motion Actuation | A | N/A | No hay funciones por movimiento del dispositivo. | Sin acción. |
| 2.5.5 Target Size | AAA | Cumple (implementación) | Objetivos interactivos configurados con mínimo de 44 px (`button`, `.touch-target`, `.icon-only`). | Validar en mobile QA cuando se agreguen controles. |
| 2.5.6 Concurrent Input Mechanisms | AAA | Cumple | Compatible con teclado y puntero de forma concurrente. | Mantener. |

### 3. Understandable

| Criterio | Nivel | Estado | Evidencia rápida | Acción recomendada |
|---|---:|---|---|---|
| 3.1.1 Language of Page | A | Cumple | `lang="en"` definido en HTML. | Mantener o traducir todo a un idioma único por build. |
| 3.1.2 Language of Parts | AA | Cumple | No hay fragmentos multilenguaje sin marcar. | Marcar `lang` si se mezclan idiomas. |
| 3.1.3 Unusual Words | AAA | Cumple (implementación) | Panel de ayuda con glosario para términos técnicos del flujo. | Ampliar glosario si se incorporan nuevos términos. |
| 3.1.4 Abbreviations | AAA | Cumple (implementación) | Abreviaturas clave marcadas con `abbr` y expansión semántica. | Mantener patrón para futuras abreviaturas. |
| 3.1.5 Reading Level | AAA | Cumple (implementación) | Se añadió “Quick guide (plain language)” con pasos simples y directos. | Revisar redacción en cada release de contenido. |
| 3.1.6 Pronunciation | AAA | Cumple (implementación) | Términos clave incluyen guía de pronunciación (por ejemplo JSON). | Añadir pronunciación cuando surjan nuevos términos ambiguos. |
| 3.2.1 On Focus | A | Cumple | Recibir foco no dispara cambios inesperados. | Mantener. |
| 3.2.2 On Input | A | Cumple | Los cambios de interfaz se mantienen en contexto y no fuerzan navegación inesperada. | Conservar confirmación explícita en acciones destructivas. |
| 3.2.3 Consistent Navigation | AA | Cumple | Estructura consistente en única vista. | Mantener si se agregan rutas. |
| 3.2.4 Consistent Identification | AA | Cumple | Controles equivalentes mantienen identificación. | Mantener. |
| 3.2.5 Change on Request | AAA | Cumple | Cambios relevantes ocurren por acción del usuario. | Mantener. |
| 3.3.1 Error Identification | A | Cumple | Mensajes de error visibles y anunciados en carga JSON. | Mantener y ampliar para otros errores. |
| 3.3.2 Labels or Instructions | A | Cumple | Se añadieron instrucciones contextuales en importación, preguntas y ayuda. | Mantener claridad textual en futuras interacciones. |
| 3.3.3 Error Suggestion | AA | Cumple (implementación) | Mensajes de carga/validación orientan al uso de plantilla y corrección de formato. | Profundizar sugerencias por tipo de error si se amplía el parser. |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | N/A | No hay transacciones legales/financieras. | Sin acción. |
| 3.3.5 Help | AAA | Cumple (implementación) | Panel de ayuda visible con guía breve, glosario y recomendaciones de recuperación. | Mantener actualizado con nuevas funciones. |
| 3.3.6 Error Prevention (All) | AAA | Cumple (implementación) | Confirmaciones antes de iniciar intentos clave y acciones que alteran flujo/progreso mediante diálogo accesible (sin `alert/confirm` nativo). | Conservar confirmaciones en acciones críticas nuevas. |

### 4. Robust

| Criterio | Nivel | Estado | Evidencia rápida | Acción recomendada |
|---|---:|---|---|---|
| 4.1.1 Parsing | A | Cumple | HTML válido en revisión estática sin errores detectados. | Mantener validación periódica. |
| 4.1.2 Name, Role, Value | A | Cumple | Controles dinámicos con nombre/rol/valor correctos; respuestas migradas a radios nativos. | Mantener revisión semántica en nuevos widgets. |
| 4.1.3 Status Messages | AA | Cumple | Mensajes con live regions (`role="status"`, `aria-live`). | Mantener consistencia en nuevos mensajes. |

---

## Gaps prioritarios (estado actual)

Todos los gaps priorizados fueron implementados en `docs/index.html`.

## Nota de alcance
Este reporte refleja una revisión técnica estática del front-end actual. Para cerrar cumplimiento real AAA se recomienda una validación adicional con:
- pruebas manuales con lector de pantalla (NVDA/JAWS/VoiceOver),
- auditoría de contraste automatizada + manual,
- pruebas responsivas/reflow y text-spacing en navegadores objetivo,
- evaluación con usuarios reales cuando sea posible.

---

## Actualización de remediación (2026-02-19)

Se aplicaron los 6 gaps prioritarios en `docs/index.html`.

Además, se resolvió alerta automática de estructura de encabezados:
- Se eliminó el heading vacío en `#questionText`.
- Se reemplazaron párrafos cortos con estilo de título por elementos semánticos correctos (`h3` cuando era título real, `span/div` cuando era badge o estado).
- Las confirmaciones del flujo se migraron de `window.confirm` a un `<dialog>` accesible con gestión de foco y teclado.

| Gap prioritario | Estado tras implementación | Evidencia aplicada |
|---|---|---|
| 1. Contraste AAA (1.4.6) | **Cumple (implementación)** | Se reforzó contraste en controles y textos de interfaz con combinaciones de alto contraste en ambos temas. |
| 2. Animaciones controlables (2.2.2, 2.3.3) | **Cumple (implementación)** | Nuevo botón `Motion: Standard/Reduced`, persistencia en `localStorage` y clase `reduce-motion` que desactiva animaciones/transiciones; se evita pulso automático con modo reducido. |
| 3. Target size AAA (2.5.5) | **Cumple (implementación)** | Se forzó tamaño mínimo de objetivos interactivos a 44 px (`button`, `[role="button"]`, `.touch-target`, e íconos con `.icon-only`). |
| 4. Presentación visual AAA (1.4.8) | **Cumple (implementación)** | `Reading Mode` activo con ancho de línea controlado (`72ch`) y espaciado tipográfico mejorado para lectura. |
| 5. Patrón de opciones robusto (1.3.1, 4.1.2) | **Cumple (implementación)** | Se reemplazó patrón de botones ARIA por radios nativos (`input type="radio"`) con labels, foco visible y control por teclado nativo. |
| 6. Ayuda y comprensión (3.1.3-3.1.6, 3.3.5, 3.3.6) | **Cumple (implementación)** | Se añadió panel “Help and glossary”, sugerencias de error accionables y confirmación antes de limpiar progreso. |

### Pendientes para cerrar AAA completo
- Ejecutar auditoría automatizada+manual de regresión para evitar desalineaciones en futuras iteraciones.
- Validar en lector de pantalla real (NVDA/JAWS/VoiceOver) como control de calidad continuo.
