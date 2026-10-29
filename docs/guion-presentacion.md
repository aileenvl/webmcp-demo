# WebMCP: guion para presentar

**Aileen Villanueva · 29 de octubre de 2026 · 22 slides · 30 minutos**

El hilo recorre cinco partes: por qué nace WebMCP, qué es, para qué se usa, cómo difiere de MCP y el estado de la propuesta de estándar junto con cómo empezar a usarlo hoy. El demo principal es **TacoAgent**, la aplicación de restaurantes y carrito del repositorio.

Plan base para ensayar: **18 minutos de explicación, 10 de demo y 2 de cierre**. Son estimaciones, no una presentación humana cronometrada.

## Recorrido de las slides

| Tiempo aproximado | Slide | Mensaje que desarrolla |
| --- | --- | --- |
| 0:00–0:30 | 1. WebMCP | Las cinco partes y el demo de TacoAgent. |
| 0:30–1:10 | 2. Por qué nace | Convertir una intención humana en acciones de la página. |
| 1:10–2:00 | 3. Sarah | El mismo widget de reserva, con UI y con herramientas. |
| 2:00–2:40 | 4. UI y contrato | addToCart expresa una acción y conserva sus reglas. |
| 2:40–3:20 | 5. Qué es | Una propuesta de API del navegador para exponer capacidades. |
| 3:20–4:00 | 6. Quién hace qué | La página declara, el navegador media y el cliente elige. |
| 4:00–4:40 | 7. Dos APIs | Formulario de búsqueda y funciones para el carrito. |
| 4:40–5:20 | 8. Usos | Comercio, agendas, aplicaciones de trabajo y herramientas creativas. |
| 5:20–6:10 | 9. Aisle, Alza y Roque Nights | La disponibilidad debe seguir el contexto de la UI. |
| 6:10–7:10 | 10. PayPal | Resultados de un sandbox pequeño, con límites visibles. |
| 7:10–8:10 | 11. MCP y WebMCP | Servidores locales o remotos y documento activo. |
| 8:10–8:50 | 12. Complementariedad | Pueden compartir servicios y reglas de negocio. |
| 8:50–9:40 | 13. Estado actual | Propuesta abierta y borrador de Community Group. |
| 9:40–10:20 | 14. Comprobar soporte | Detectar primero y configurar sólo si falta la API. |
| 10:20–11:10 | 15. HTML | searchRestaurants como herramienta declarativa. |
| 11:10–12:10 | 16. JavaScript | viewCart lee el mismo estado que la UI. |
| 12:10–13:10 | 17. AbortSignal | addToCart depende del menú, checkout depende del carrito. |
| 13:10–14:00 | 18. Types, Skill y DevTools | Recursos para desarrollar, inspeccionar y evaluar. |
| 14:00–15:10 | 19. Seguridad | Validación, autorización y revisión humana. |
| 15:10–18:00 | 20. Feedback | Fallos silenciosos, fileSupportTicket y propuesta OOB. |
| 18:00–28:00 | 21. Demo: WebMCP en acción | Menú, carrito, errores y confirmación humana en TacoAgent. |
| 28:00–30:00 | 22. Primer paso | Elegir una capacidad útil y abrir preguntas. |

Las notas de cada slide desarrollan estas ideas y contienen sus fuentes. Los datos son los mismos en la presentación web y el deck editable.

## Ejemplos actuales antes del código

### Sarah: misma reserva, dos rutas

La [demo de Sarah Drasner](https://webmcp-demo-sdras.netlify.app/) compara dos rutas de control sobre el mismo widget. Una interpreta la UI y la otra llama tres herramientas. Los nodos y tools ilustran ese caso. **No es un benchmark** de costo, velocidad o seguridad.

Una frase útil: «En una ruta el agente interpreta los controles. En la otra el sitio declara la capacidad y los argumentos que necesita.»

### Aisle, Alza y Roque Nights

Los ejemplos proceden del texto de André Bandarra aportado en la conversación:

- Aisle habilita `finalize_chart` cuando todos los invitados tienen asiento y no hay violaciones de reglas.
- Alza ofrece `extend_selected_wall` con una sola pared seleccionada.
- Roque Nights espera las llamadas activas antes de retirar herramientas.

Conectar con TacoAgent: «Agregar un producto requiere un menú abierto. Solicitar checkout requiere un carrito con productos. El registro debe reflejar esas precondiciones.»

### PayPal: alcance de las cifras

La [publicación de PayPal](https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/) respalda las tres métricas de la slide. El ensayo compra una tarjeta de regalo en un sandbox pequeño. Los resultados varían según tienda, catálogo y asistente. El comprador conserva la revisión y aprobación del pago.

## Preparación antes de presentar

Dejar abiertas estas pestañas:

- Presentación: `http://127.0.0.1:3002/`.
- TacoAgent: `http://127.0.0.1:3001/`.
- [Comparación visual de Sarah](https://webmcp-demo-sdras.netlify.app/), si se mostrará en vivo.

Comprobar primero en la pestaña del demo:

```js
Boolean(document.modelContext)
```

Si hay soporte, continuar. Sólo si falta, seguir la [guía oficial de desarrollo local](https://developer.chrome.com/docs/ai/webmcp), habilitar `chrome://flags/#enable-webmcp-testing` cuando corresponda y reiniciar. Hacer la configuración antes de presentar.

Abrir **Chrome DevTools > Application > WebMCP** para inspeccionar herramientas y probar llamadas. La extensión Inspector es opcional. Confirmar que el indicador de TacoAgent informa que los registros nativos se completaron. El listado de la UI describe las capacidades del flujo, mientras el contador nativo informa de registros imperativos completados.

El panel **Ensayo guiado** es un respaldo local: sus botones llaman las mismas funciones de negocio, sin IA y sin fingir una conexión WebMCP. Si se usa, decirlo. Una invocación manual nativa tampoco demuestra que un LLM haya elegido la herramienta.

## Demo de TacoAgent: diez minutos

### 0:00–1:00 · Mostrar la UI y el estado

Pulsar «Reiniciar». Enseñar el catálogo de restaurantes, el carrito vacío y el indicador de soporte. Explicar que búsqueda, menú y carrito también funcionan con los controles humanos.

En el catálogo de la UI hay inicialmente una herramienta declarativa, `searchRestaurants`, y dos imperativas, `getRestaurantInfo` y `viewCart`. El registro imperativo tiene dos herramientas en este estado.

### 1:00–2:00 · Búsqueda declarativa

Usar `searchRestaurants` con cocina mexicana y precio sin filtro. En el Inspector, tomar los nombres de campos del formulario:

```json
{ "cuisine": "mexicana", "priceRange": "all" }
```

Mostrar que la búsqueda devuelve restaurantes y sus IDs. Señalar `toolname`, `tooldescription` y `toolautosubmit` en el formulario. Este envío automático corresponde a una búsqueda que no crea pedidos.

### 2:00–3:00 · Abrir un menú

Ejecutar `getRestaurantInfo`:

```json
{ "restaurantId": "taco-loco" }
```

El menú de Taco Loco aparece en la UI y devuelve productos, precios e IDs. La herramienta `addToCart` pasa a estar disponible. Este callback cambia la selección, por lo que no se describe como una lectura pura.

### 3:00–4:30 · Agregar productos

Ejecutar `addToCart`:

```json
{
  "restaurantId": "taco-loco",
  "menuItemId": "taco-carnitas",
  "quantity": 2
}
```

En los datos ficticios, «Tacos de Carnitas» es una orden de tres tacos. Quantity 2 agrega dos órdenes. El total es **MXN 25.98**. Mostrar el carrito y la respuesta de la operación.

Cada llamada a `addToCart` agrega una línea de productos. Consultar el carrito antes de repetir una llamada si no se sabe si ya se ejecutó.

### 4:30–5:30 · Un error que permite corregir

Intentar un producto agotado:

```json
{
  "restaurantId": "taco-loco",
  "menuItemId": "quesadilla",
  "quantity": 1
}
```

La respuesta informa que no está disponible y el carrito válido permanece. Como alternativa, probar `quantity: 0` para mostrar que el contrato y la función rechazan una cantidad inválida. La app exige un entero entre 1 y 10.

### 5:30–6:30 · Comparar respuesta y estado

Ejecutar `viewCart` con `{}`. La respuesta contiene `success`, `message`, `items`, `itemCount`, `total` y `currency`. Comparar productos y total con la UI.

Frase útil: «La herramienta y la persona leen el mismo estado. El esquema explica los argumentos y la función aplica las reglas.»

### 6:30–8:00 · Disponibilidad dinámica

Con productos aparecen `clearCart` y `checkout`. Vaciar con `clearCart` y observar que esas operaciones desaparecen. El menú queda abierto, así que `addToCart` sigue disponible. Agregar otra vez las dos órdenes para continuar.

| Estado | Herramientas imperativas | Total con la búsqueda declarativa |
| --- | --- | --- |
| Inicio | 2 | 3 |
| Menú abierto | 3 | 4 |
| Carrito con productos | 5 | 6 |
| Carrito vacío, menú abierto | 3 | 4 |

Mostrar `ToolRegistry` en `lib/webmcp.ts`: conserva registros que siguen siendo válidos y retira los demás con `AbortController`. Retirar un registro no cancela por sí mismo una ejecución activa.

### 8:00–10:00 · Revisión y confirmación humana

Ejecutar `checkout` con `{}`. Devuelve `success: true` y `status: "pending-human-review"`. Se abre un diálogo con productos y total.

La persona compara el carrito y pulsa **Confirmar pedido ficticio**. `confirmOrder` sólo pertenece a ese botón y no está registrado como herramienta. La app muestra un ID de pedido local y vacía el carrito. No hay cobro, envío ni almacenamiento de datos personales.

Decir: «La herramienta preparó la revisión. La persona confirmó un efecto concreto después de verlo.»

## Respaldo local sin IA

Si la API nativa no está disponible en esa sesión, usar los botones de **Ensayo guiado**: buscar cocina mexicana, abrir Taco Loco, probar el producto agotado, agregar dos órdenes y solicitar revisión. Decir: «Estos botones llaman JavaScript local. Muestro el flujo de negocio y su relación con las herramientas, sin una llamada WebMCP nativa.»

No cambiar la regla de stock o cantidades para salvar el recorrido. Un error claro forma parte de lo que queremos mostrar.

## Cierre y preguntas

«Una primera capacidad puede ser una lectura como viewCart. Declara su propósito, comprueba el resultado en la UI, prueba errores y después evalúa las decisiones con un agente compatible.»

**¿Es un estándar W3C?** Es una propuesta abierta. La publicación del 27 de octubre es un Draft Community Group Report, no un estándar W3C ni un documento de Standards Track.

**¿Reemplaza MCP?** Son contextos distintos que pueden convivir: servicios locales o remotos y capacidades de la página activa.

**¿Las annotations dan permisos?** Comunican intención. La aplicación y su backend aplican validación y autorización.

**¿Run tool evalúa a un modelo?** Prueba una invocación manual. La decisión de un LLM requiere una evaluación con un agente compatible.

**¿Reporting OOB ya está disponible?** El artículo de André Bandarra propone ese canal. Hoy podemos instrumentar nuestras herramientas y recorridos con telemetría propia y minimización de datos.

## Fuentes

- [Demo de Sarah Drasner](https://webmcp-demo-sdras.netlify.app/).
- [Resultados y enfoque de PayPal](https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/).
- [Introducción de Chrome](https://developer.chrome.com/docs/ai/webmcp) y [comparación con MCP](https://developer.chrome.com/docs/ai/webmcp/compare-mcp).
- [API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api) y [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api).
- [Diseño](https://developer.chrome.com/docs/ai/webmcp/build-tools) y [seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools).
- [Borrador de especificación](https://webmachinelearning.github.io/webmcp/).
- [Tipos oficiales](https://github.com/webmachinelearning/webmcp-types) y [Skill oficial](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md).
- [DevTools WebMCP](https://developer.chrome.com/docs/devtools/application/webmcp).
- [Propuesta de feedback fuera del flujo](https://bandarra.me/posts/webmcp-feedback-loop).
- [Código de TacoAgent](https://github.com/aileenvl/webmcp-demo).

Los enlaces X compartidos no fueron accesibles. No se atribuyen afirmaciones a esos posts. Los ejemplos de Aisle, Alza y Roque Nights proceden del texto aportado en la conversación.
