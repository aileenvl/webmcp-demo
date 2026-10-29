# TacoAgent · Demo de 10 minutos

La charla completa tiene **22 slides y 30 minutos**: aproximadamente **18 minutos de explicación, 10 de demo y 2 de cierre**. TacoAgent, el demo de este repositorio, es el ejemplo principal. El [guion general](guion-presentacion.md) desarrolla las cinco partes de la charla; esta guía se concentra en sus acciones reales.

## Preparación

Abre la presentación y TacoAgent antes de empezar. En el entorno de esta sesión el demo se sirve por el puerto **3001**:

- Demo: [localhost:3001](http://localhost:3001).
- Slides: [localhost:3001/slides/index.html](http://localhost:3001/slides/index.html).

Para preparar ese servidor desde la raíz del repositorio: `npm ci` y `npm run dev -- --port 3001`. Si utilizas el puerto 3000 por defecto, cambia sólo el puerto de los enlaces. La instalación inicial puede requerir internet; hazla antes del ensayo.

Comprueba primero `Boolean(document.modelContext)` y el indicador del demo. Si falta soporte, sigue la [guía oficial](https://developer.chrome.com/docs/ai/webmcp) en un navegador compatible antes de presentar. Para invocaciones nativas manuales, usa **Chrome DevTools → Application → WebMCP** o el [Inspector oficial](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd). La extensión es opcional si DevTools ofrece esas herramientas.

Las llamadas manuales nativas prueban el contrato sin incorporar un LLM. El panel **«Ensayo guiado»**, marcado **«Local · sin IA»**, sirve para practicar con JavaScript directo. Si lo utilizas, explica el modo que está visible: «Estos botones llaman las mismas funciones de negocio; aquí no hay una invocación WebMCP ni una decisión de un modelo».

Pulsa **Reiniciar** para comenzar sin menú abierto y con el carrito vacío. No necesitas nombre, teléfono ni dirección.

## 0:00–1:00 · Estado inicial y lectura

Muestra el indicador de WebMCP, el carrito vacío y las herramientas propias de TacoAgent:

- `searchRestaurants`: formulario HTML.
- `getRestaurantInfo`: función JavaScript.
- `viewCart`: función JavaScript de lectura.

Hay **3 herramientas en total**. Invoca `viewCart` con:

```json
{}
```

Muestra `itemCount: 0`, `total: 0` y `currency: "MXN"`. «La lectura devuelve el estado actual. La interfaz humana y las herramientas comparten esa información».

## 1:00–2:30 · Búsqueda declarativa

Invoca `searchRestaurants`:

```json
{"cuisine":"mexicana","priceRange":"all"}
```

La interfaz muestra Taco Loco. Señala el formulario y sus atributos `toolname`, `tooldescription` y `toolautosubmit`; los campos describen los parámetros. La búsqueda devuelve el restaurante y su menú, incluidos IDs, precios y disponibilidad.

Muestra que JavaScript devuelve el resultado al envío del agente mediante `SubmitEvent.respondWith()`. El formulario también funciona cuando lo utiliza una persona.

## 2:30–4:00 · Menú y mutación imperativa

Invoca `getRestaurantInfo`:

```json
{"restaurantId":"taco-loco"}
```

Se abre el menú y aparece `addToCart`: ahora hay **4 herramientas**. Invócala:

```json
{"restaurantId":"taco-loco","menuItemId":"taco-carnitas","quantity":2}
```

La interfaz muestra dos órdenes de tacos. «El esquema describe la llamada. La función valida que el restaurante esté abierto, el producto exista, haya stock y la cantidad sea un entero de 1 a 10».

## 4:00–5:00 · Registro dinámico y carrito actual

Con productos aparecen `clearCart` y `checkout`: ahora hay **6 herramientas**. Invoca `viewCart` con `{}` y compara productos, `itemCount: 2` y total con el carrito visible.

Muestra el patrón del registro:

```js
const lifecycle = new AbortController();
await document.modelContext.registerTool(tool, {
  signal: lifecycle.signal,
});
// Cuando la acción deja de tener sentido en la UI:
lifecycle.abort();
```

«El registro acompaña las precondiciones de la aplicación. La ejecución también vuelve a validar el estado. Retirar una herramienta no cancela automáticamente una llamada que ya comenzó».

## 5:00–6:30 · Errores que permiten corregir

Prueba el producto agotado con `addToCart`:

```json
{"restaurantId":"taco-loco","menuItemId":"quesadilla","quantity":1}
```

Muestra `success: false` y el mensaje que permite elegir otro producto. Los tacos siguen en el carrito.

Prueba después `quantity: 0` o `quantity: 1.5`. Si el Inspector rechaza esa entrada por el esquema, señala esa primera barrera; la función de negocio también rechaza cantidades inválidas. El contrato y las reglas de la aplicación se complementan.

Abre «Ver respuesta estructurada». Este resultado local sirve para depurar; el reporting fuera de banda del artículo de André es una propuesta adicional.

## 6:30–8:00 · Preparar una revisión

Invoca `checkout` con:

```json
{}
```

Se abre el diálogo de revisión y el resultado incluye **`status: "pending-human-review"`**. El carrito conserva sus productos. Revisa los nombres, cantidades y total con el público.

Pulsa **Cancelar**. El carrito sigue disponible. Vuelve a invocar `checkout` para mostrar que la persona conserva el control del siguiente paso.

«La herramienta prepara la revisión. La confirmación final está separada y no se expone como herramienta. En un servicio real, el backend también aplica autorización y comprobaciones».

## 8:00–9:00 · Confirmar el pedido ficticio

Pulsa personalmente **«Confirmar pedido ficticio»**. La app muestra un identificador `DEMO-…` y el carrito queda vacío. No hubo cobro ni envío.

Se retiran `clearCart` y `checkout`. Quedan **4 herramientas**, porque el menú sigue abierto y `addToCart` continúa siendo útil. Invoca `viewCart` con `{}` para comprobar el estado vacío.

Modificar el carrito invalida una revisión preparada; hay que solicitar y revisar una nueva versión antes de confirmar.

## 9:00–10:00 · Conectar el demo con el primer paso

Recapitula lo visible: una búsqueda declarativa, acciones imperativas, disponibilidad según el estado, validación y revisión humana. Pulsa **Reiniciar**: se cierra el menú y vuelven las **3 herramientas iniciales**.

«Empieza por una capacidad pequeña que ya exista en tu aplicación. Describe su propósito, valida los argumentos y comprueba en la UI qué ocurrió.»

Regresa a la slide 22 para los dos minutos finales de cierre y preguntas.

## Respaldo con el panel local

El panel «Ensayo guiado» contiene estos botones:

1. Buscar cocina mexicana.
2. Abrir Taco Loco.
3. Probar producto agotado.
4. Agregar dos órdenes de tacos.
5. Solicitar revisión.

Después usa el botón de confirmación del diálogo. Estos pasos ejecutan las mismas funciones de negocio mediante llamadas locales, sin IA ni claves. El recuento del panel expresa las herramientas útiles para el flujo; el indicador separado informa si hubo registro nativo confirmado.

Con poco tiempo, conserva búsqueda, apertura de menú, alta de tacos y revisión. Con el servidor y los archivos ya preparados, el recorrido local funciona sin servicios externos. Antes de presentar, ensaya una vez en el mismo equipo.
