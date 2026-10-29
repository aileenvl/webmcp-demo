# Guía de Aileen · construir el demo, paso a paso

Esta es tu guía de presentación y ensayo, no una pantalla para proyectar ni un texto que debas leer completo en voz alta. La presentación completa dispone de **30 minutos**; el recorrido principal de construcción de abajo se estima en **10–12 minutos**, integrado con tus slides. Las ampliaciones sirven para ajustar profundidad después de ensayar, no para prometer minutos que todavía no se han medido. No se cronometró una presentación humana.

El objetivo es que puedas explicar cada cambio: una app ya funciona con botones; WebMCP permite publicar algunas de sus funciones con un contrato que un cliente compatible puede descubrir y llamar. El inspector del demo es **manual y sin LLM**. Registrar una herramienta no crea un agente de IA.

## Preparación antes de presentar

Desde la carpeta del proyecto:

```bash
npm ci
npm run check
npm run dev
```

Deja la terminal abierta. En otra terminal puedes ejecutar los comandos de comparación y recuperación. No instales dependencias durante la charla. Abre estas dos pestañas:

- Taller: `http://127.0.0.1:5173/agenda/taller/index.html?paso=0`.
- App final de respaldo: `http://127.0.0.1:5173/agenda/index.html`.

Comprueba el estado nativo en Chrome antes de salir al escenario. Si WebMCP no está disponible, abre `http://127.0.0.1:5173/agenda/taller/index.html?paso=0&modo=simulador` y di: “Voy a ensayar el contrato con llamadas JavaScript directas. Esta parte no es WebMCP nativo”. No cambies flags ni instales extensiones frente al público para salvar el guion.

Todas las sesiones son ficticias. La agenda vive en memoria: no reserva lugares, no guarda datos tras recargar y no envía correos. Mantén la app final original como respaldo; los ejercicios del taller no la reemplazan.

## Mapa del recorrido

| Paso | Archivo de solución | Construcción y señal visible | Tools sin selección / con selección |
| --- | --- | --- | --- |
| 0 | `taller/pasos/00-app.ts` | La app funciona con botones; no publica herramientas. | 0 / 0 |
| 1 | `taller/pasos/01-lectura.ts` | Publicar `listar_sesiones`; descubrir y leer la agenda. | 1 / 1 |
| 2 | `taller/pasos/02-mutacion.ts` | Añadir `agregar_sesion` y esquema; detectar una respuesta demasiado vaga. | 2 / 2 |
| 3 | `taller/pasos/03-resultados.ts` | Devolver resultados estructurados; explicar reintento y conflicto recuperable. | 2 / 2 |
| 4 | `taller/pasos/04-contexto.ts` | Añadir selección; registrar y retirar edición contextual. | 3 / 4 |
| 5 | `taller/pasos/05-confirmacion.ts` | Preparar revisión; confirmar o cancelar en la UI humana. | 4 / 5 |

Los números cuentan herramientas disponibles, no llamadas ni sesiones. Cada checkpoint es ejecutable por separado. Al cambiar de página o recargar, vuelve a preparar los datos que ese paso necesita.

## Cómo construir y cómo recuperarte

Hay dos formas de recorrer el mismo código:

1. **Ruta segura para presentar:** abre el checkpoint numerado, muestra su código y compara con el anterior. Ejecuta el cambio en el navegador. No dependes de escribir todo sin errores.
2. **Ruta de escritura para ensayar:** trabaja sólo en `taller/pasos/ejercicio.ts`. Copia un checkpoint conocido y modifica ahí el bloque que se explica. Los archivos numerados son soluciones de recuperación.

Comandos disponibles:

```bash
# Recuperar un punto conocido en el archivo de ejercicio:
npm run taller:copiar -- 0

# Ver el cambio exacto entre dos soluciones:
npm run taller:diff -- 0 1
npm run taller:diff -- 2 3

# Mostrar números de línea reales del archivo que vas a enseñar:
nl -ba taller/pasos/01-lectura.ts

# Verificar todas las soluciones y la app final:
npm run check
```

El comando de copia sólo sustituye `taller/pasos/ejercicio.ts`: guarda primero cualquier variante que quieras conservar. Antes de copiar, el script resguarda la versión anterior del ejercicio en `artifacts/resguardos/`. Para probar lo que escribas, abre `http://127.0.0.1:5173/agenda/taller/index.html?paso=ejercicio`. Guardar un cambio recarga la página y reinicia el estado. Los diffs también están en `taller/diffs/`. Si un cambio escrito falla, abre el checkpoint numerado que corresponde y continúa con su solución. No ejecutes `git reset --hard` ni borres código para recuperar la presentación.

Puntos de código para señalar (puedes verlos también en la vista con números de línea del taller):

| Cambio | Ubicación |
| --- | --- |
| No registrar herramientas | `taller/pasos/00-app.ts`, líneas 4–5. |
| Definición de lectura y execute | `taller/pasos/01-lectura.ts`, líneas 5–13. |
| Esquema de sessionId | `taller/contrato.ts`, líneas 5–8. |
| Mutación que pierde el resultado | `taller/pasos/02-mutacion.ts`, líneas 10–16. |
| Corrección del resultado | `taller/pasos/03-resultados.ts`, líneas 10–14. |
| Selección y edición contextual | `taller/pasos/04-contexto.ts`, líneas 6–27. |
| Revisión sin confirmar | `taller/pasos/05-confirmacion.ts`, líneas 6–13. |

## Paso 0 · una app normal — alrededor de 1 minuto

**Abre:** `?paso=0`. Enseña `taller/pasos/00-app.ts` y el estado de herramientas vacío.

**Haz:** añade WebMCP con el botón humano. La sesión aparece en la agenda. Pulsa “Reiniciar” antes del siguiente paso.

**Señala:** en `src/agenda.ts`, busca `add(input: unknown)`. Esa función contiene la validación y las reglas de horario. El botón llama a esa función. Todavía no hay herramientas publicadas.

**Di:** “Primero tengo una app que una persona puede usar. Voy a publicar una función que ya existe, manteniendo sus reglas y su estado visible”.

**Pregunta:** “¿Qué tendría que hacer un agente si sólo conoce botones?” Respuesta esperada: interpretar la UI y decidir dónde hacer clic. No prometas que WebMCP elimina todos los casos de interacción visual.

**Si falla:** usa la app final sólo para mostrar el botón y vuelve al checkpoint 0. Cero herramientas es un resultado correcto aquí, no un error.

## Paso 1 · publicar y ejecutar una lectura — alrededor de 2 minutos

**Abre:** `?paso=1`. Compara `npm run taller:diff -- 0 1`.

Construye o señala la definición de `listar_sesiones`, con estas partes:

```ts
name: 'listar_sesiones',
description: 'Lee el catálogo ficticio y la agenda actual. No modifica datos.',
inputSchema: emptyInput,
annotations: { readOnlyHint: true, untrustedContentHint: true },
execute: (input, { signal }) => {
  if (signal.aborted) return cancelled();
  if (!emptyArguments(input)) return invalid();
  return JSON.stringify({ ok: true, code: 'STATE', ...agenda.snapshot() });
},
```

`emptyInput`, en `taller/contrato.ts`, describe un objeto sin propiedades ni campos extra; `emptyArguments` valida eso también en JavaScript. El archivo de solución contiene el contrato completo. Usa sus líneas como referencia al escribir; no necesitas copiar aquí el adaptador del navegador.

**Enseña el registro real:** abre `src/tools.ts` y busca `context.registerTool`. El adaptador compartido espera:

```ts
await context.registerTool(definition, { signal: controller.signal });
```

En modo nativo, `context` es `document.modelContext`. Este es el punto que publica la definición; un array de objetos JavaScript por sí solo no publica nada.

**Ejecuta:** selecciona `listar_sesiones`, entrada `{}`, y pulsa “Ejecutar herramienta”. Espera una herramienta en el registro y datos de catálogo/agenda. Enseña `getTools()` y `executeTool(tool, input)` en el adaptador: el inspector usa el objeto descubierto.

**Di:** “Nombre e intención permiten descubrirla; el esquema describe la entrada; execute llama a mi lógica. El navegador ejecuta la función, y aquí yo elijo qué llamar”.

**Pregunta:** “¿Esto ya es un chatbot?” Respuesta: no. Es una capacidad disponible para clientes compatibles; el inspector es manual.

**Si falla:** abre el checkpoint 1 conocido. Si falla la API nativa, usa el enlace de simulador y nombra el cambio de modo. No declares un registro nativo exitoso si la pantalla informa un error.

## Paso 2 · añadir una mutación y su esquema — alrededor de 2 minutos

**Abre:** `?paso=2`. Compara `npm run taller:diff -- 1 2`.

Añade la definición de `agregar_sesion`. Señala el esquema:

```ts
properties: {
  sessionId: {
    type: 'string',
    enum: ['webmcp', 'tipos', 'accesibilidad'],
  },
},
required: ['sessionId'],
additionalProperties: false,
```

La herramienta llama a `agenda.add(input)`, igual que el botón humano. En este checkpoint hay una **limitación didáctica intencional**: descarta el resultado del dominio y responde sólo “Listo.”. La validación y la protección de la agenda siguen funcionando; lo incorrecto es que esa respuesta no explica qué pasó.

**Ejecuta:** `agregar_sesion` con `{"sessionId":"webmcp"}`. La UI muestra una sesión. Repite la llamada: no aparece una segunda sesión, pero la respuesta vaga no distingue la repetición. Intenta `{"sessionId":"tipos"}`: la agenda no cambia por el conflicto, y “Listo.” tampoco lo explica.

**Di:** “El esquema ayuda a describir qué enviar. Las reglas reales siguen en la app. Ahora mi envoltura oculta un dato importante: si la acción funcionó o qué debo corregir”.

**Pregunta:** “¿Un agente puede decidir su siguiente paso con ‘Listo.’?” Respuesta: no de forma fiable; necesitamos devolver el resultado de la operación.

**Si falla:** recupera el checkpoint 2. Si no añade una sesión, revisa que el ID sea `webmcp` y que la agenda no esté finalizada. No cambies la regla de horarios para hacer pasar el ejemplo.

## Paso 3 · devolver información útil y recuperarse — alrededor de 2 minutos

**Abre:** `?paso=3`. Compara `npm run taller:diff -- 2 3`.

Cambia la respuesta vaga por el resultado de la función:

```ts
return JSON.stringify(agenda.add(input));
```

Sustituye las dos líneas `agenda.add(input); return 'Listo.';` dentro de execute por esa línea, conservando la comprobación de cancelación. No estás duplicando las reglas del negocio dentro de la herramienta. Estás conservando `ok`, `code` y `message` que ya devuelve el dominio. El resultado viaja como texto JSON en esta API.

**Ejecuta esta secuencia:**

1. `{"sessionId":"webmcp"}` → `ADDED`; una sesión visible.
2. Lo mismo otra vez → `ALREADY_ADDED`; sigue habiendo una sesión.
3. `{"sessionId":"tipos"}` → `ok: false`, `TIME_CONFLICT`; explica el cruce y propone `accesibilidad`.
4. `{"sessionId":"accesibilidad"}` → `ADDED`; dos sesiones contiguas.

**Di:** “Un reintento no duplica. Un error conserva el estado y permite actuar: ahora puedo escoger la alternativa propuesta”.

**Pregunta:** “¿Dónde se detecta el conflicto: en el esquema o en la app?” Respuesta: en la lógica de la app; JSON Schema no conoce el horario que ya seleccioné.

**Si falla:** pulsa “Reiniciar” y repite la secuencia. Para un JSON mal formado, usa un ejemplo de la UI. Un error visible y recuperable también enseña algo; no necesitas ocultarlo.

## Paso 4 · herramientas que siguen el contexto — alrededor de 2 minutos

**Abre:** `?paso=4`. Compara `npm run taller:diff -- 3 4`. Prepara la agenda añadiendo WebMCP.

Se añaden `seleccionar_sesion` y una herramienta condicional de edición. Enseña el bloque que decide si publicarla:

```ts
const { selectedId, finalized } = agenda.snapshot();
if (selectedId && !finalized) {
  // Añadir editar_sesion_seleccionada al conjunto disponible.
}
```

**Ejecuta:** `seleccionar_sesion` con `{"sessionId":"webmcp"}`. El registro pasa de 3 a 4 herramientas. Llama a `editar_sesion_seleccionada` con `{"title":"WebMCP en JSConfMX"}`; el título cambia en la UI. Pulsa el botón humano para quitar selección: vuelve a 3 herramientas.

**Enseña la retirada:** busca `controller.abort()` en `src/tools.ts`. El adaptador usa la señal del registro para retirarlo cuando cambia el contexto. La herramienta comprueba además que una selección antigua no termine editando otra sesión.

**Di:** “No basta con esconder un botón. La herramienta deja de estar disponible cuando la acción pierde sentido en la UI”.

**Pregunta:** “¿Abortar el registro cancela una llamada que ya empezó?” Respuesta: no se debe asumir. El signal de registro y el signal de ejecución tienen propósitos distintos; las acciones aquí son breves y validan el contexto antes de mutar.

**Si falla:** revisa que WebMCP esté añadida y seleccionada; la edición no aparece sólo por estar en el catálogo. Recupera el checkpoint 4 y vuelve a preparar esos datos.

## Paso 5 · preparar una revisión, conservar decisión humana — alrededor de 1 minuto

**Abre:** `?paso=5`. Compara `npm run taller:diff -- 4 5`. Añade al menos una sesión.

Se añade `preparar_confirmacion`. Su acción es `agenda.prepareConfirmation()`: abre revisión, no llama a `agenda.confirm()`.

**Ejecuta:** entrada `{}` → `CONFIRMATION_REQUIRED`. La agenda sigue en borrador. Pulsa “Cancelar”: sigue editable. Prepara otra vez y pulsa el botón humano “Confirmar agenda”: aparece “Finalizada · local”. “Reabrir” permite editar de nuevo.

**Di:** “La herramienta prepara la revisión; la persona confirma desde la interfaz. Aquí no hacemos ninguna reserva real. Tampoco publicamos una herramienta de confirmación”.

**Pregunta:** “¿Qué pasa si edito después de preparar?” Respuesta: el cambio invalida esa revisión y hay que prepararla otra vez. La confirmación se liga a la versión que se revisó.

**Si falla:** reinicia, añade una sesión y prepara una revisión nueva. Como recuperación final, abre `/` y realiza el mismo flujo probado en la app completa.

## Profundidad opcional, según tu ensayo

Elige una o dos ampliaciones concretas; no hagas pausas artificiales para ocupar tiempo:

- **Entradas y seguridad:** compara campos requeridos, enum y additionalProperties con la validación de `src/agenda.ts`. Prueba un ID desconocido o un título vacío. Explica por qué el esquema no sustituye autorización ni reglas de negocio.
- **Prueba del reintento:** abre la prueba de alta idempotente en `tests/agenda.test.ts`. Explica qué estado debe permanecer igual después de la segunda llamada. Después del check de preparación, puedes ejecutar `node --test --test-name-pattern="añadir dos veces" .test-build/tests/agenda.test.js`. Ensaya ese comando; no reescribas la batería en vivo.
- **Ciclo de vida:** muestra el AbortController, la espera del registro y la limpieza al salir. Explica por qué una llamada pendiente al reiniciar no debe repoblar la agenda; hay una prueba de esa carrera.
- **Entrada humana y herramienta:** cambia un título mediante UI y luego consulta el estado desde una herramienta. Es la misma instancia, no dos demostraciones desconectadas.
- **Cliente compatible:** sólo si ya lo ensayaste con ese navegador y perfil, usa uno para descubrir la página. No añadas cuentas, claves ni descargas de modelos como requisito de la charla.

## Ensayo y salida

Haz un ensayo con cronómetro incluyendo slides, cambios de ventana, escritura, lectura de errores y preguntas. Anota el tiempo observado por etapa; ajústalo antes de presentar. Si el conjunto dura menos de 30 minutos, añade una ampliación sustantiva o más explicación sobre el código. Si dura más, usa checkpoints conocidos y deja las ampliaciones para preguntas.

Núcleo que conviene conservar: app sin tools → primera lectura real → mutación con resultado útil → contexto 3/4 → revisión humana. Si falta tiempo, no demuestres todos los ejemplos inválidos ni leas el adaptador completo. Cierra mostrando qué añadiste: contratos sobre funciones existentes, estado compartido y controles humanos.

No cierres afirmando que WebMCP ya es un estándar W3C, que todos los navegadores lo soportan o que el inspector es un agente. El README conserva las fuentes oficiales y los límites de la integración comprobada.
