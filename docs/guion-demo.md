# TacoAgent · Demo de 7 minutos

Sesión completa: conceptos y slides 19 min, demo 7 min, preguntas 4 min.

## Preparación

Ejecuta `npm ci` y `npm run dev`. Abre http://localhost:3000. Activa `chrome://flags/#enable-webmcp-testing`, reinicia Chrome y comprueba `Boolean(document.modelContext)` en consola. Instala y abre el Inspector oficial. Las llamadas manuales no necesitan API key. Si no hay soporte, usa «Demo guiado local» y explica que llama las funciones sin agente ni IA.

Recarga para empezar con carrito vacío. No necesitas datos personales.

## 0:00–1:00 · Descubrir acciones

«La página describe acciones con nombre, parámetros y resultado. El agente decide cuál invocar; la aplicación valida lo que recibe».

Muestra `searchRestaurants`, `getRestaurantInfo` y `viewCart`. `addToCart` aparece al abrir un menú; `clearCart` y `checkout` necesitan productos.

## 1:00–2:00 · API declarativa

Invoca `searchRestaurants`:

```json
{"cuisine":"mexicana","priceRange":"all"}
```

Muestra el formulario y sus atributos `toolname` y `tooldescription`. El formulario manual y el agente comparten búsqueda y resultados.

## 2:00–3:00 · API imperativa

Invoca `getRestaurantInfo`:

```json
{"restaurantId":"taco-loco"}
```

Luego `addToCart`:

```json
{"restaurantId":"taco-loco","menuItemId":"taco-carnitas","quantity":2}
```

«El esquema ayuda a construir la llamada. La función verifica el producto, el stock y la cantidad».

## 3:00–4:00 · Registro dinámico

Vuelve a descubrir las herramientas: aparecen `clearCart` y `checkout`. Ejecuta `viewCart` con `{}`.

```js
const lifecycle = new AbortController();
await document.modelContext.registerTool(tool, {
  signal: lifecycle.signal,
});
// Al desaparecer la precondición o desmontar la vista:
lifecycle.abort();
```

«Retirar una herramienta evita futuras selecciones irrelevantes. No sustituye validación ni cancela automáticamente ejecuciones que ya comenzaron».

## 4:00–5:00 · Errores que permiten corregir

Prueba `addToCart` con una quesadilla agotada:

```json
{"restaurantId":"taco-loco","menuItemId":"quesadilla","quantity":1}
```

Luego prueba `quantity: 0` o `quantity: 1.5`. Si el inspector lo bloquea por esquema, explica esa primera barrera; la función también rechaza cantidades inválidas. El carrito conserva los tacos.

Muestra los resultados locales. Este registro no es la propuesta de reporting fuera de banda.

## 5:00–6:30 · Revisión humana

Invoca `checkout` con `{}`. Revisa productos y total. Todavía no existe un pedido confirmado. Pulsa personalmente el botón de confirmar el pedido simulado.

«El agente prepara la revisión. La persona decide confirmar. En un servicio real, autorización y comprobaciones también se aplican en el servidor».

El carrito queda vacío y desaparecen `clearCart` y `checkout`. No hubo cobro ni envío real.

## 6:30–7:00 · Cierre

«Empieza por una acción pequeña, expón sólo lo útil en cada estado, valida cada entrada y observa también los errores».

## Respaldo

- Sin WebMCP o sin extensión: usa el panel local, identificado como ejecución guiada sin agente.
- Sin internet: usa el servidor local ya iniciado y las slides descargadas. El recorrido guiado no depende de servicios externos ni claves.
- Con poco tiempo: abre Taco Loco, agrega tacos, muestra las herramientas nuevas, solicita revisión y confirma. Dura unos tres minutos.

La primera instalación sí puede requerir internet. Practica una vez en el mismo equipo antes de presentar.
