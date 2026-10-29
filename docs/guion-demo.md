# Agenda compartida · Guion del demo y taller

La charla completa tiene **22 slides y 30 minutos**: aproximadamente **17 minutos de explicación, 11 de taller y 2 de cierre**. El taller ocupa la slide 21. El [guion general](guion-presentacion.md) desarrolla las cinco partes de la charla; esta guía se concentra en las acciones del demo.

## Preparación

Conserva abiertas la presentación, el taller y la app final antes de empezar. En el entorno de la sesión el demo se sirve por el puerto **3001**:

- Taller: [localhost:3001/agenda/taller/index.html?paso=0](http://localhost:3001/agenda/taller/index.html?paso=0).
- App final de respaldo: [localhost:3001/agenda/index.html](http://localhost:3001/agenda/index.html).
- Taller en simulador: [localhost:3001/agenda/taller/index.html?paso=0&modo=simulador](http://localhost:3001/agenda/taller/index.html?paso=0&modo=simulador).

Para preparar ese servidor desde la raíz del repositorio: `npm ci` y `npm run dev -- --port 3001`. Si utilizas el puerto 3000 por defecto, cambia sólo el puerto de los enlaces. La instalación inicial puede necesitar internet; hazla antes de presentar.

Comprueba primero `Boolean(document.modelContext)` y el indicador de la agenda. El modo nativo requiere `registerTool`, `getTools` y `executeTool`. Si falta soporte, sigue la [guía oficial](https://developer.chrome.com/docs/ai/webmcp) antes del ensayo. Chrome DevTools, **Application → WebMCP**, permite inspeccionar herramientas; la extensión Inspector es opcional y el demo ya incluye un inspector manual.

En modo nativo una persona elige la herramienta y envía JSON. Eso comprueba el contrato sin incorporar un LLM. Si usas el simulador, dilo: «Voy a ensayar el contrato con llamadas JavaScript directas. Esta parte no es WebMCP nativo». El simulador no suplanta `document.modelContext`.

## Taller central · unos 11 minutos

Cambiar `paso` recarga la página y reinicia la agenda. Cada etapa necesita preparar de nuevo sus datos. Usa «Ver el código de este checkpoint» para enseñar el cambio concreto.

### 0:00–1:00 · Checkpoint 0: la app ya funciona

Abre `?paso=0`. Añade WebMCP con el botón humano. Muestra **0 herramientas**: la aplicación y sus reglas existen antes de publicar contratos.

«La interfaz y las herramientas van a llamar las mismas funciones. Primero tenemos una app que funciona.»

### 1:00–2:30 · Checkpoint 1: una lectura

Abre `?paso=1`. Muestra nombre, descripción, esquema y `execute` en `listar_sesiones`. Selecciona esa herramienta y envía:

```json
{}
```

El resultado contiene `STATE`, catálogo y agenda. Compara con la UI. Señala el recorrido: `registerTool` registra, `getTools` descubre y `executeTool` invoca. En esta etapa hay **1 herramienta**.

### 2:30–4:00 · Checkpoint 2: una respuesta insuficiente

Abre `?paso=2`. Invoca `agregar_sesion`:

```json
{"sessionId":"webmcp"}
```

Repite la entrada y después envía:

```json
{"sessionId":"tipos"}
```

La app impide duplicados y traslapes, pero esta etapa devuelve deliberadamente **«Listo.»**. Pregunta: «¿Con esta respuesta podrías decidir qué hacer después?» Hay **2 herramientas**; las reglas de negocio siguen activas.

### 4:00–6:00 · Checkpoint 3: resultados para continuar

Abre `?paso=3`. La herramienta ahora devuelve el resultado de la función de negocio como JSON. Ejecuta:

| Entrada a `agregar_sesion` | Resultado | Qué se ve |
| --- | --- | --- |
| `{"sessionId":"webmcp"}` | `ADDED` | Una sesión, 10:00–10:30 |
| La misma entrada | `ALREADY_ADDED` | Sigue habiendo una sesión |
| `{"sessionId":"tipos"}` | `TIME_CONFLICT` | Se conserva el borrador y se explica el conflicto |
| `{"sessionId":"accesibilidad"}` | `ADDED` | Dos sesiones contiguas |

`tipos` ocupa 10:15–10:45 y se cruza con WebMCP. `accesibilidad` empieza a las 10:30 y sí cabe. «El esquema describe entradas; la app valida los horarios y devuelve una señal para corregir el plan.»

### 6:00–8:30 · Checkpoint 4: herramientas según el contexto

Abre `?paso=4`, agrega `webmcp` y llama `seleccionar_sesion`:

```json
{"sessionId":"webmcp"}
```

Aparece `editar_sesion_seleccionada`. Invócala:

```json
{"title":"WebMCP en JSConfMX"}
```

Después llama `seleccionar_sesion` con:

```json
{"sessionId":null}
```

La edición contextual desaparece. En este checkpoint el recuento es **3 → 4 → 3**. Muestra la señal de registro: `registerTool(tool, { signal })` y `controller.abort()` al salir del contexto. La función también valida la selección al ejecutarse.

### 8:30–11:00 · Checkpoint 5: preparar y revisar

Abre `?paso=5`. Añade `webmcp`. Selecciona y quita la selección para enseñar **4 → 5 → 4 herramientas**; este paso añade `preparar_confirmacion` a las tres herramientas base anteriores.

Invoca `preparar_confirmacion` con:

```json
{}
```

El resultado es `CONFIRMATION_REQUIRED`. Muestra títulos y horarios en el resumen. La persona pulsa **«Confirmar agenda»** y la interfaz pasa a **«Finalizada · local»**. Ninguna herramienta confirma por su cuenta; modificar el borrador obliga a revisar de nuevo.

«La herramienta prepara la revisión. La persona decide confirmar. En un servicio real, el backend también aplica autorización y comprobaciones.»

Todas las sesiones son ficticias. La confirmación vive en memoria: no reserva lugares, cobra, envía correos ni persiste tras recargar.

## Construcción en vivo

Para editar una variante sin tocar las soluciones, desde `agenda/` ejecuta `npm run taller:copiar -- 0` y abre `/agenda/taller/index.html?paso=ejercicio`. Edita `agenda/taller/pasos/ejercicio.ts` desde la raíz del repositorio. `npm run taller:diff -- 2 3` muestra la corrección de la respuesta.

La edición en vivo requiere el servidor Vite de `agenda/` (`npm run dev`, puerto 5173), o reconstruir con `npm run publicar:next` para actualizar lo servido por Next. La [guía completa](../agenda/docs/TALLER.md) detalla los cambios y resguardos del ejercicio. Si una edición falla, continúa con el checkpoint numerado correspondiente.

## Respaldo compacto · app final

Abre `/agenda/index.html` para recorrer en unos **5–7 minutos**: lectura, alta, reintento, conflicto, selección, edición y revisión. La app final comienza con cuatro herramientas y añade una al seleccionar una sesión editable.

Con poco tiempo, conserva lectura, conflicto y revisión humana. Si falta soporte nativo, usa `?modo=simulador` y comunica el cambio de modo. Con el servidor y los archivos ya preparados, el recorrido local no depende de cuentas o claves.

## Variante opcional: TacoAgent

TacoAgent sigue disponible en `/` como ejemplo de comercio y API declarativa. Si lo incorporas a los 30 minutos, sustituye parte del demo de agenda:

1. Busca con `searchRestaurants`: `{"cuisine":"mexicana","priceRange":"all"}`.
2. Abre `getRestaurantInfo`: `{"restaurantId":"taco-loco"}`.
3. Llama `addToCart`: `{"restaurantId":"taco-loco","menuItemId":"taco-carnitas","quantity":2}`.
4. Observa que aparecen `clearCart` y `checkout`. Un producto agotado o una cantidad inválida conserva el carrito.
5. Llama `checkout` con `{}`: solicita revisión. Confirma el pedido ficticio mediante el botón de la interfaz.

El panel «Ensayo guiado» de TacoAgent ejecuta esas funciones localmente y se identifica como modo sin IA. No hay pagos ni envíos reales.
