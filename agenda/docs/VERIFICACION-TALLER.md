# Verificación del taller por checkpoints

29 octubre 2026 UTC. App final original conservada en `/`; taller nuevo en `/taller/`.

## Comprobación automatizada

- `npm test`: 28/28 pruebas aprobadas en el proyecto canónico; también 28/28 en copia temporal.
- `npm run check` en la copia fuera de iCloud: 28 pruebas, typecheck estricto y build de ambas páginas aprobados. Se compilan los seis checkpoints y el ejercicio; ninguno queda como código incompleto.
- Ocho pruebas nuevas: matriz de capacidades por etapa, cero registros en 0, lectura sin mutación, respuesta vaga deliberada en 2, reparación en 3, selección contextual, revisión humana y retirada de registros.
- `npm run taller:diff -- 2 3` muestra la sustitución real de `agenda.add(input); return 'Listo.'` por `return JSON.stringify(agenda.add(input))`.
- `npm run taller:copiar -- 1` preparó el ejercicio, guardó resguardo y produjo archivo idéntico a la solución 1; se abrió ese ejercicio y ejecutó la lectura nativa. Después se restauró el ejercicio 0 y se comprobó igualdad con su solución.

## Chrome nativo observado

Pruebas mediante UI en Chrome del equipo, servidor local de verificación en puerto 5175. Sin cambiar flags ni instalar extensiones. Inspector manual, sin LLM.

| Etapa | Registro nativo observado | Resultado observado |
| --- | --- | --- |
| 0 | 0 tools | Botón humano añade una sesión, sigue sin tools; inspector deshabilitado. |
| 1 | 1 tool | listar_sesiones devuelve STATE y catálogo; se muestra el archivo con números de línea. |
| 2 | 2 tools | agregar_sesion devuelve Listo. tanto en alta como en conflicto; agenda permanece con una sola sesión. Defecto didáctico rotulado. |
| 3 | 2 tools | ADDED, ALREADY_ADDED y TIME_CONFLICT, con sugerencia de accesibilidad. |
| 4 | 3 → 4 → 3 | SELECTED habilita edición, EDITED actualiza el título, quitar selección retira la herramienta. |
| 5 | 4 → 5 → 4 | Selección habilita edición; preparar devuelve CONFIRMATION_REQUIRED y sigue Borrador; Cancelar mantiene editable; Confirmar humano finaliza y retira edición. |

`preparar_confirmacion` llega sólo en el paso 5. Ningún checkpoint registra una herramienta para confirmar. La confirmación queda ligada a la revisión de la app.

Se volvió a la app final original: cuatro herramientas, llamada agregar_sesion con ADDED y sesión visible. Su fuente src/ se conserva.

## Alternativa de práctica

En `/taller/?paso=3&modo=simulador` se observaron rótulos Simulador local (no WebMCP nativo), llamadas JS directas y ADDED con cambio visible. Mantener el checkpoint al cambiar de modo funciona. No se reemplaza document.modelContext.

## Límites y ensayo pendiente

Los tiempos de la guía son estimaciones. No se cronometró una presentación humana de 30 minutos. El núcleo del demo se estima en 10–12 minutos dentro de la presentación; las ampliaciones son opcionales.

La verificación del taller se hizo con Vite en Chrome. El build multi-page completo pasó, pero no se recorrieron de nuevo todas las etapas mediante el servidor Python de dist/. La app final compilada sí había sido probada en la entrega anterior. No se evaluaron otros navegadores ni una conversación autónoma de varias etapas con un LLM.

El equipo mantenía parte de Documents y node_modules como archivos deshidratados de iCloud. Para una comprobación reproducible se copiaron fuentes a /tmp y se instalaron las mismas 19 dependencias exactas del lockfile. No se cambiaron configuraciones de iCloud ni se tocaron sitios existentes.
