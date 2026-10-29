# WebMCP: guion para presentar

**Aileen Villanueva · 29 de octubre de 2026 · 22 slides · 30 minutos**

El hilo recorre cinco partes en el orden solicitado: por qué nace WebMCP, qué es, para qué se usa, cómo difiere de MCP y el estado de la propuesta de estándar junto con cómo empezar a usarlo hoy. El taller de agenda es la parte central de la demostración.

Plan base: unos **17 minutos de explicación, 11 de taller y 2 de cierre**. La guía del taller estima **10–12 minutos** para sus seis checkpoints. Ajusta la explicación y las preguntas tras el ensayo para respetar los 30 minutos. No se ha cronometrado una presentación humana.

## Recorrido de las slides

| Tiempo aproximado | Slide | Mensaje que desarrolla |
| --- | --- | --- |
| 0:00–0:30 | 1. WebMCP | Las preguntas que resolveremos y el demo de agenda. |
| 0:30–1:10 | 2. Por qué nace | Una intención humana necesita convertirse en acciones de una página. |
| 1:10–2:00 | 3. Sarah | El mismo widget de reserva puede controlarse interpretando UI o llamando herramientas. |
| 2:00–2:40 | 4. UI y contrato | La acción expresa el propósito del producto y reutiliza sus reglas. |
| 2:40–3:20 | 5. Qué es | Una API propuesta del navegador para exponer capacidades del documento. |
| 3:20–4:00 | 6. Quién hace qué | La página declara, el navegador media y el cliente elige. |
| 4:00–4:40 | 7. Dos APIs | Formularios HTML y funciones JavaScript. |
| 4:40–5:20 | 8. Usos | Comercio, agendas, aplicaciones de trabajo y herramientas creativas. |
| 5:20–6:10 | 9. Aisle, Alza y Roque Nights | Las herramientas disponibles deben seguir el contexto de la UI. |
| 6:10–7:10 | 10. PayPal | Resultados prometedores de un sandbox pequeño, con sus límites visibles. |
| 7:10–8:10 | 11. MCP y WebMCP | Servidores locales o remotos frente a capacidades del documento activo. |
| 8:10–8:50 | 12. Complementariedad | Pueden compartir servicios y reglas sin ser la misma integración. |
| 8:50–9:40 | 13. Estado actual | Propuesta abierta y borrador de Community Group del 27 de octubre. |
| 9:40–10:20 | 14. Comprobar soporte | Detectar primero; configurar sólo si falta la API. |
| 10:20–11:10 | 15. HTML | El formulario describe la acción y los campos describen parámetros. |
| 11:10–12:10 | 16. JavaScript | Una lectura permite comprobar contrato, llamada y estado. |
| 12:10–13:10 | 17. AbortSignal | La selección incorpora o retira la edición contextual. |
| 13:10–14:00 | 18. Types, Skill y DevTools | Recursos concretos para desarrollar, inspeccionar y evaluar. |
| 14:00–15:10 | 19. Seguridad | Validación, autorización, datos no confiables y revisión humana. |
| 15:10–17:00 | 20. Feedback | Qué perdemos cuando el agente abandona y qué propone el reporting OOB. |
| 17:00–28:00 | 21. Taller | Construir la agenda en seis checkpoints. |
| 28:00–30:00 | 22. Primer paso | Elegir una capacidad útil, probarla y abrir preguntas. |

Las notas de cada slide contienen un texto natural para desarrollar estas ideas y sus fuentes. Los mismos datos alimentan la presentación web y el deck editable.

## Ejemplos que se cuentan antes del código

### Sarah: misma reserva, dos rutas

Abrir o mostrar la [demo de Sarah Drasner](https://webmcp-demo-sdras.netlify.app/). Ambos lados utilizan el mismo widget de reserva y buscan el mismo resultado. Una ruta interpreta la interfaz; la otra expone tres herramientas. Los 40+ nodos y las tres herramientas pertenecen a ese ejemplo didáctico. **No presentar esta comparación como un benchmark** de costo, velocidad o seguridad.

Una frase útil: «La diferencia que quiero enseñar es quién explica la acción. En una ruta el agente interpreta los controles. En la otra el sitio declara la capacidad y los argumentos que necesita.»

### Aisle, Alza y Roque Nights

Estos ejemplos proceden del texto de André Bandarra aportado en la conversación:

- Aisle ofrece `finalize_chart` cuando todos los invitados tienen asiento y no hay violaciones de reglas.
- Alza ofrece `extend_selected_wall` cuando existe una sola pared seleccionada.
- Roque Nights espera a las llamadas activas antes de retirar herramientas.

Conectar con nuestra agenda: «Editar la sesión seleccionada tiene sentido mientras hay una selección válida. Al cambiar ese contexto, debe cambiar el registro.»

### PayPal: el alcance de las cifras

La [publicación de PayPal del 16 de septiembre de 2026](https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/) compara la compra de una tarjeta de regalo en una tienda de pruebas. Informa aproximadamente 4.6 veces menor costo de uso de inferencia, el doble de velocidad en la mediana y tres llamadas estructuradas frente a más de treinta pasos de interfaz.

Mantener la aclaración de la slide: es un benchmark interno pequeño en sandbox y los resultados varían según tienda, catálogo y asistente. El agente prepara la compra e inicia checkout. El comprador revisa y aprueba el pago dentro de PayPal.

## Preparación antes de presentar

Abrir las pestañas antes de subir al escenario:

- Presentación web: `http://127.0.0.1:3002/`.
- Taller central: `http://127.0.0.1:3001/agenda/taller/index.html?paso=0`.
- App final de respaldo: `http://127.0.0.1:3001/agenda/index.html`.
- [Demo visual de Sarah](https://webmcp-demo-sdras.netlify.app/), si se mostrará en vivo.

Comprobar primero:

```js
Boolean(document.modelContext)
```

Si existe soporte, continuar. Sólo si falta, seguir la [guía oficial de desarrollo local](https://developer.chrome.com/docs/ai/webmcp), habilitar `chrome://flags/#enable-webmcp-testing` cuando corresponda y reiniciar. No instalar dependencias ni intentar resolver configuración en el escenario. La API nativa ya se había comprobado en Chrome 156 en la sesión previa del proyecto de referencia. Eso no constituye una prueba nueva de estas slides ni una garantía para todos los navegadores.

Para inspeccionar, abrir Chrome DevTools y entrar a **Application > WebMCP**. La extensión Inspector es opcional. El inspector integrado del demo también permite elegir herramientas y llamar con JSON. Comprobar en la pantalla qué modo está activo.

El modo nativo utiliza `document.modelContext`. El simulador realiza llamadas JavaScript directas. Si hay que cambiar de modo, decirlo: «Voy a ensayar el contrato con llamadas JavaScript directas. Esta parte no es WebMCP nativo.» Una llamada manual, incluso nativa, no demuestra que un LLM haya elegido la herramienta.

## Taller central de 10–12 minutos

Los checkpoints son independientes. Cambiar de checkpoint recarga y reinicia la agenda. En cada uno hay que preparar de nuevo los datos que necesita la explicación.

| Paso | Qué cambia | Herramientas sin selección / con selección |
| --- | --- | --- |
| 0 | App normal que ya funciona con botones. | 0 / 0 |
| 1 | Primera herramienta de lectura. | 1 / 1 |
| 2 | Mutación y esquema, con una respuesta demasiado vaga. | 2 / 2 |
| 3 | Resultados que permiten corregir el siguiente paso. | 2 / 2 |
| 4 | Selección y edición contextual. | 3 / 4 |
| 5 | Preparación de revisión y confirmación humana. | 4 / 5 |

Los números cuentan herramientas disponibles. En el checkpoint 5 y en la app final, seleccionar y limpiar produce la secuencia **4, 5, 4 herramientas**.

### Paso 0: la app ya funciona

Abrir `?paso=0`. Añadir WebMCP con el botón humano. La sesión aparece y no hay tools publicadas. Decir: «Voy a publicar algunas funciones que ya existen. Sus reglas y su estado visible permanecen en la app.» Cero herramientas es el estado correcto de este paso.

### Paso 1: lectura

Abrir `?paso=1` y mostrar el código del checkpoint. Señalar nombre, descripción, esquema y `execute`. Seleccionar `listar_sesiones` y ejecutar:

```json
{}
```

Esperar `STATE` y comparar catálogo y agenda con la UI. Mostrar dónde el adaptador registra con `document.modelContext.registerTool`, descubre con `getTools` y ejecuta mediante `executeTool`. Un array de objetos JavaScript no publica herramientas por sí solo.

### Paso 2: mutación y una respuesta insuficiente

Abrir `?paso=2`. Mostrar `sessionId` requerido y los valores del catálogo. Agregar:

```json
{ "sessionId": "webmcp" }
```

Repetir la llamada y luego intentar `tipos`. La regla de negocio conserva el estado y evita el conflicto, pero este checkpoint responde deliberadamente «Listo.». Preguntar: «¿Podría un agente decidir el siguiente paso con esta respuesta?» El problema didáctico es la información de salida, no una desactivación de las reglas.

### Paso 3: resultados útiles

Abrir `?paso=3`. Mostrar que ahora se devuelve el resultado de `agenda.add(input)` como JSON. Ejecutar la secuencia:

| Entrada a `agregar_sesion` | Resultado esperado | Estado visible |
| --- | --- | --- |
| `{"sessionId":"webmcp"}` | `ADDED` | Una sesión de 10:00 a 10:30. |
| La misma entrada | `ALREADY_ADDED` | Sigue habiendo una sesión. |
| `{"sessionId":"tipos"}` | `TIME_CONFLICT` | El borrador se conserva. |
| `{"sessionId":"accesibilidad"}` | `ADDED` | Dos sesiones contiguas. |

`tipos` ocupa 10:15–10:45 y se cruza con WebMCP. `accesibilidad` ocupa 10:30–11:00 y sí cabe. Decir: «Un reintento no duplica y un error permite corregir el plan. El esquema no conoce los horarios seleccionados: la app valida ese contexto.»

### Paso 4: contexto

Abrir `?paso=4` y agregar `webmcp`. Ejecutar `seleccionar_sesion`:

```json
{ "sessionId": "webmcp" }
```

Observar que aparece `editar_sesion_seleccionada`. Ejecutarla:

```json
{ "title": "WebMCP en JSConfMX" }
```

Limpiar con `seleccionar_sesion` y `{"sessionId":null}`. La herramienta contextual se retira. En este checkpoint hay tres tools base y cuatro con selección. El registro usa `AbortSignal`; retirar el registro no equivale a cancelar automáticamente una llamada ya activa.

### Paso 5: revisión humana

Abrir `?paso=5`. Preparar una agenda y, si se quiere mostrar el recuento final, seleccionar y limpiar para observar cuatro, cinco y cuatro tools. Ejecutar `preparar_confirmacion` con `{}`. Esperar `CONFIRMATION_REQUIRED` y enseñar el resumen.

La persona revisa los títulos y horarios y pulsa «Confirmar agenda». El botón humano aplica la confirmación. La herramienta sólo prepara la revisión. La agenda es local y ficticia: no reserva lugares, no cobra ni envía correos. Cualquier cambio en el borrador obliga a revisar de nuevo.

## Respaldo compacto con la app final

Si falta tiempo para construir por checkpoints, usar `/agenda/index.html` para un recorrido estimado de **5–7 minutos**: lectura, alta, reintento, conflicto, selección, edición y revisión. Nombrarlo como un recorrido de la app final, no como el taller completo de 10–12 minutos.

Si el código escrito en vivo falla, abrir el checkpoint numerado conocido y continuar con su solución. No alterar reglas de horarios para salvar el recorrido. Un error claro y recuperable también forma parte de la explicación.

## Cierre y preguntas

«El primer paso puede ser una capacidad de lectura o un borrador que ya exista en tu aplicación. Declara el propósito, valida el contrato, comprueba el resultado en la UI y después evalúa las decisiones con un agente compatible.»

**¿Es un estándar W3C?** Es una propuesta abierta. La publicación del 27 de octubre es un Draft Community Group Report, no un estándar W3C ni un documento de Standards Track.

**¿Reemplaza MCP?** Son contextos distintos y pueden convivir: servidores locales o remotos, y capacidades de la página abierta.

**¿Las annotations dan permisos?** Comunican intención. La aplicación y su backend aplican validación y autorización.

**¿Run tool evalúa a un modelo?** Prueba una invocación manual. La decisión de un LLM requiere una evaluación con un agente compatible.

**¿Reporting OOB ya está disponible?** El artículo de André Bandarra propone ese canal. Hoy podemos instrumentar nuestras herramientas y recorridos con telemetría propia y minimización de datos.

## Fuentes

- [Demo de Sarah Drasner](https://webmcp-demo-sdras.netlify.app/).
- [Resultados y enfoque de PayPal](https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/).
- [Introducción de Chrome](https://developer.chrome.com/docs/ai/webmcp).
- [Comparación con MCP](https://developer.chrome.com/docs/ai/webmcp/compare-mcp).
- [API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api) y [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api).
- [Diseño](https://developer.chrome.com/docs/ai/webmcp/build-tools) y [seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools).
- [Borrador de especificación](https://webmachinelearning.github.io/webmcp/).
- [Tipos oficiales](https://github.com/webmachinelearning/webmcp-types).
- [Skill oficial](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md).
- [DevTools WebMCP](https://developer.chrome.com/docs/devtools/application/webmcp).
- [Propuesta de feedback fuera del flujo](https://bandarra.me/posts/webmcp-feedback-loop).

Los enlaces X compartidos no fueron accesibles. No se atribuyen afirmaciones a esos posts. Los ejemplos de Aisle, Alza y Roque Nights proceden del texto aportado en la conversación.
