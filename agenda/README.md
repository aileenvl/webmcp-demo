> Esta copia está integrada en `aileenvl/webmcp-demo`. Las rutas publicadas son `/agenda/index.html` y `/agenda/taller/index.html?paso=0`.
> Para reconstruir lo servido por Next: `npm ci && npm test && npm run publicar:next` desde esta carpeta. El build usa `base: '/agenda/'`; no requiere rutas Next adicionales.

# Agenda compartida · WebMCP paso a paso

Demo para **Aileen Villanueva · JSConfMX · 29 octubre 2026**. Interfaz y guion en español. Tres sesiones **ficticias**, una agenda en memoria y cinco herramientas fáciles de seguir.

La idea que puedes explicar: **los botones y las herramientas llaman a las mismas funciones de la app**. WebMCP añade un contrato para descubrir esas funciones y llamarlas con entradas estructuradas.

## Taller de construcción para la presentación de 30 minutos

El recorrido principal ahora es **/agenda/taller/index.html?paso=0**, con seis checkpoints ejecutables. La app final original sigue en **/agenda/index.html**. La [guía nueva para Aileen](docs/TALLER.md) contiene cambios de código, comandos, resultados, preguntas y recuperación. El núcleo del demo se estima en **10–12 minutos dentro de una presentación completa de 30**, con profundidad opcional. No se ha cronometrado un ensayo humano.

| URL (después de localhost:5173) | Archivo que enseñas | Construcción |
| --- | --- | --- |
| `/agenda/taller/index.html?paso=0` | `taller/pasos/00-app.ts` | App sin herramientas |
| `/agenda/taller/index.html?paso=1` | `taller/pasos/01-lectura.ts` | Lectura |
| `/agenda/taller/index.html?paso=2` | `taller/pasos/02-mutacion.ts` | Mutación y esquema; respuesta vaga deliberada |
| `/agenda/taller/index.html?paso=3` | `taller/pasos/03-resultados.ts` | Resultados y recuperación |
| `/agenda/taller/index.html?paso=4` | `taller/pasos/04-contexto.ts` | Selección y edición contextual |
| `/agenda/taller/index.html?paso=5` | `taller/pasos/05-confirmacion.ts` | Revisión y confirmación humana |

Para construir en vivo sin tocar las soluciones, ejecuta `npm run taller:copiar -- 0` y abre **/agenda/taller/index.html?paso=ejercicio**. Edita sólo `taller/pasos/ejercicio.ts`. `npm run taller:diff -- 2 3` muestra el cambio exacto que corrige la respuesta. Las copias guardan el ejercicio anterior en `artifacts/resguardos/`. Guardar código o navegar de checkpoint reinicia la agenda en memoria. Los diffs están también en `taller/diffs/`.

El build incluye las dos páginas y todos los checkpoints. El modo Python sirve también `/agenda/taller/index.html` desde `../public/`; la edición en vivo requiere Vite, o reconstruir después de editar. El ejemplo intencionalmente vago del paso 2 sólo existe en el taller: las reglas del dominio y la app final mantienen sus validaciones.

## Ejecutar

Requisitos: Node **20.19+** (o 22.12+) y npm. Probado con Node 20.20.1 y Chrome 156.0.8078.49.

```bash
npm ci
npm run dev
```

Abre **http://127.0.0.1:5173/agenda/index.html**. Mantén la terminal abierta. `Ctrl+C` detiene el servidor. `npm run dev` falla si el puerto está ocupado, para evitar abrir una app distinta por accidente.

Comprobaciones:

```bash
npm test
npm run typecheck
npm run build
```

Para presentar sin el servidor de desarrollo: `npm run build` y después `npm run preview`; abre la misma dirección. Tras instalar dependencias y compilar, el demo no necesita internet. No abrir `index.html` como `file://`.

## Abrir la versión compilada sin instalar dependencias

El repositorio incluye `../public/agenda/`. Si ya tienes Python 3, desde esta carpeta `agenda/` ejecuta:

```bash
python3 -m http.server 5173 --bind 127.0.0.1 --directory ../public
```

Abre http://127.0.0.1:5173/agenda/index.html. Este camino sirve los archivos ya compilados; no requiere npm ni conexión. Detén el servidor anterior antes de usarlo. Para editar o reconstruir, usa el flujo npm de arriba.

## Elegir el modo

| Estado visible | Qué ocurre realmente |
| --- | --- |
| **Inspector WebMCP nativo · manual, sin LLM** | Registra con `document.modelContext.registerTool`, descubre con `getTools()` y llama mediante `executeTool(tool, input)`. Es WebMCP real; una persona elige la herramienta, no un modelo. |
| **WebMCP nativo no disponible** | La interfaz humana funciona, el inspector está deshabilitado. No se intenta simular una API nativa. |
| **Simulador local (no WebMCP nativo)** | Abre `http://127.0.0.1:5173/agenda/index.html?modo=simulador`. Invoca directamente funciones JavaScript para ensayar. No usa WebMCP ni un LLM. |

El simulador **nunca** define ni reemplaza `document.modelContext`. Volver a “Comprobar modo nativo” recarga y reinicia la agenda.

## Preparar Chrome nativo

Este proyecto sigue la API documentada al **28 octubre 2026**. En el Chrome instalado se comprobó disponibilidad sin modificar su configuración. La disponibilidad depende del navegador/perfil; una versión reciente por sí sola no garantiza que la característica esté activada.

Si no está disponible, la [guía oficial de Chrome](https://developer.chrome.com/docs/ai/webmcp#local_webmcp) indica para desarrollo local:

1. Usar una versión de Chrome que incluya la API actual (este demo se verificó en Chrome 156).
2. Ir a `chrome://flags/#enable-webmcp-testing`.
3. Cambiar a **Enabled** y relanzar Chrome.
4. Abrir localhost de nuevo y comprobar el estado verde y el registro de herramientas.

**Es una decisión manual de la persona dueña del navegador.** El demo y sus scripts no cambian flags, no instalan extensiones y no configuran permisos persistentes. Si no quieres cambiar ajustes, usa el simulador identificado como tal. Chrome ofrece además un origin trial desde Chrome 149, pero este demo local no incluye token ni publicación.

No hay agente de IA integrado. Un agente compatible se puede conectar por separado; no se debe prometer que cualquier chatbot detectará las herramientas ni que registrar una herramienta crea un agente. Para mañana, el inspector nativo permite una demostración reproducible sin cuenta, clave API o descarga de modelos.

## Recorrido breve de la app final (5–7 minutos)

El taller principal está en [docs/TALLER.md](docs/TALLER.md). Como respaldo breve, lee [docs/GUION.md](docs/GUION.md): incluye qué pulsar, qué decir, resultados esperados y cómo recuperarte. Hazlo dos veces antes de presentar. Pulsa **Reiniciar demo** al empezar cada ensayo.

## Leer el código en este orden

1. [`src/agenda.ts`](src/agenda.ts): catálogo y reglas normales de una app. `add` valida y detecta conflictos; `editSelected` cambia un título; `prepareConfirmation` sólo prepara una revisión. No conoce WebMCP.
2. [`src/tools.ts`](src/tools.ts): `defineTools` describe nombre, intención, JSON Schema y `execute`. El `execute` llama las funciones del punto 1. El resultado es texto JSON con `ok`, `code` y `message`.
3. En el mismo archivo, `createToolRegistry`: usa un `AbortController` por registro, añade o retira herramientas cuando cambia la selección o se cierra la agenda. Registra y consulta de forma asíncrona, sin llamadas duplicadas durante una sincronización.
4. [`src/main.ts`](src/main.ts): botones de la UI e inspector. La UI utiliza la misma instancia de `agenda`. **Sólo** el botón “Confirmar agenda” llama `agenda.confirm()`: esa acción no está publicada como herramienta.
5. [`tests/agenda.test.ts`](tests/agenda.test.ts) y [`tests/tools.test.ts`](tests/tools.test.ts): reglas, reintentos, ciclo de vida y contrato del adaptador nativo.

El núcleo de la integración es pequeño:

```ts
const controller = new AbortController();
await document.modelContext.registerTool({
  name: 'agregar_sesion',
  description: 'Agrega una sesión por ID a la agenda ficticia.',
  inputSchema: {
    type: 'object',
    properties: { sessionId: { type: 'string' } },
    required: ['sessionId'],
    additionalProperties: false,
  },
  execute: input => JSON.stringify(agenda.add(input)),
}, { signal: controller.signal });

// Cuando deja de tener sentido en la UI:
controller.abort();
```

Es un extracto conceptual del registro; en el proyecto se usa un esquema con IDs enumerados y validación también dentro de `agenda.add`. El esquema describe la entrada; **no sustituye** las reglas del negocio ni una frontera de seguridad.

El inspector usa el objeto descubierto, no sólo su nombre:

```ts
const tools = await document.modelContext.getTools();
const tool = tools.find(t => t.name === 'agregar_sesion');
if (tool) {
  const result = await document.modelContext.executeTool(tool, {
    sessionId: 'webmcp',
  });
}
```

### Herramientas

| Nombre | Entrada | Efecto |
| --- | --- | --- |
| `listar_sesiones` | `{}` | Lee catálogo, agenda, selección y estado. |
| `agregar_sesion` | `{"sessionId":"webmcp"}` | Añade una sesión sin duplicarla; valida cruces de horario. |
| `seleccionar_sesion` | `{"sessionId":"webmcp"}` o `{"sessionId":null}` | Cambia selección; sólo acepta una sesión ya añadida. |
| `editar_sesion_seleccionada` | `{"title":"WebMCP en JSConfMX"}` | Disponible sólo mientras hay una sesión seleccionada y la agenda sigue editable. |
| `preparar_confirmacion` | `{}` | Abre revisión; la persona aún debe confirmar en la UI. |

“Confirmar”, “Cancelar”, “Reabrir” y “Reiniciar” son controles humanos del demo. Un cambio en la agenda invalida cualquier revisión anterior. Finalizar sólo bloquea este estado en memoria; no persiste tras recargar.

### Ciclo de vida y cancelación

`registerTool(tool, {signal})` permite retirar el registro con `controller.abort()`. Se reconstruye el pequeño conjunto de herramientas sólo al cambiar la selección o el estado finalizado. No se usa `unregisterTool` ni `navigator.modelContext` (API antigua).

El `signal` de registro es distinto al que recibe `execute(input, {signal})`. Retirar una herramienta no implica cancelar una ejecución ya iniciada en Chrome 153+. Las acciones de este demo son síncronas y breves; antes de mutar comprueban cancelación y selección vigente. El demo no implementa tareas largas o navegación entre documentos.

## Fuentes y límites

Consultadas el 28 octubre 2026:

- [Chrome: introducción, prueba local y disponibilidad](https://developer.chrome.com/docs/ai/webmcp) (actualizada 7 octubre 2026).
- [Chrome: API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api) (actualizada 16 octubre 2026): `document.modelContext`, registro con `{signal}`, descubrimiento y ejecución con un objeto de argumentos.
- [Borrador WebMCP del Web Machine Learning Community Group](https://webmachinelearning.github.io/webmcp/) (27 octubre 2026). **No es un estándar W3C ni está en Standards Track.**
- [Tipos TypeScript oficiales](https://github.com/webmachinelearning/webmcp-types), dependencia fijada en `package-lock.json`.
- [Estado de implementación](https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md).

Este ejemplo sólo implementa la API **imperativa**. Chrome también documenta una [API declarativa para formularios HTML](https://developer.chrome.com/docs/ai/webmcp/declarative-api); no necesitas explicarla en vivo para entender este demo.

No implementa autenticación, control de acceso, reservas reales, persistencia ni un LLM. Los atributos de anotación son pistas para clientes; no sustituyen autorización. “Confirmar” permanece bajo control humano por diseño, aunque la agenda sea ficticia. No se envían asistentes, correos ni datos personales.

Los tests de adaptador usan una implementación de prueba y **no prueban compatibilidad de un navegador**. El resultado de la comprobación manual real y sus límites están en [docs/VERIFICACION.md](docs/VERIFICACION.md).
