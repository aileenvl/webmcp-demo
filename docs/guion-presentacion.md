# WebMCP: guion para presentar

**Aileen Villanueva · 29 de octubre de 2026 · 34 slides · 30 minutos**

El orden es: **título, qué es WebMCP, para qué sirve, cómo usarla, diferencias con MCP, estándares y demo de TacoAgent**. La definición aparece antes del problema. Los casos de uso y los ejemplos técnicos de la charla original se conservan con fuentes actuales y límites explícitos.

Plan base para ensayar: **20 minutos de explicación, 8 de demo y 2 de cierre**. Son estimaciones, no una presentación humana cronometrada.

## Recorrido de las slides

| Tiempo aproximado | Slide | Bloque |
| --- | --- | --- |
| 0:00–0:20 | 1. WebMCP | Título |
| 0:20–1:00 | 2. Qué es WebMCP | Qué es WebMCP |
| 1:00–1:45 | 3. Sarah: misma reserva, dos rutas | Qué es WebMCP |
| 1:45–2:15 | 4. Quién hace qué | Qué es WebMCP |
| 2:15–2:45 | 5. Una llamada completa | Qué es WebMCP |
| 2:45–3:15 | 6. Para qué se usa | Para qué sirve |
| 3:15–3:45 | 7. Viajes: búsqueda y reserva | Para qué sirve |
| 3:45–4:15 | 8. Comercio: catálogo, carrito y revisión | Para qué sirve |
| 4:15–4:45 | 9. Soporte y aplicaciones de trabajo | Para qué sirve |
| 4:45–5:25 | 10. Herramientas según el estado | Para qué sirve |
| 5:25–6:10 | 11. PayPal: resultados de un sandbox | Para qué sirve |
| 6:10–6:45 | 12. Beneficios y límites | Para qué sirve |
| 6:45–7:15 | 13. Adopción gradual en una app existente | Cómo usar WebMCP |
| 7:15–7:45 | 14. Dos formas de declarar herramientas | Cómo usar WebMCP |
| 7:45–8:25 | 15. HTML: un formulario como herramienta | Cómo usar WebMCP |
| 8:25–9:00 | 16. Responder a una búsqueda declarativa | Cómo usar WebMCP |
| 9:00–9:40 | 17. JavaScript: una herramienta de lectura | Cómo usar WebMCP |
| 9:40–10:20 | 18. Schema y validación de cantidad | Cómo usar WebMCP |
| 10:20–11:00 | 19. Resultados que permiten recuperarse | Cómo usar WebMCP |
| 11:00–11:40 | 20. Registro dinámico con AbortSignal | Cómo usar WebMCP |
| 11:40–12:15 | 21. Eventos de formularios declarativos | Cómo usar WebMCP |
| 12:15–12:45 | 22. Feedback visual con CSS | Cómo usar WebMCP |
| 12:45–13:15 | 23. Tipos y Skill para implementar | Cómo usar WebMCP |
| 13:15–13:55 | 24. DevTools: probar y evaluar | Cómo usar WebMCP |
| 13:55–14:45 | 25. Seguridad en la aplicación | Cómo usar WebMCP |
| 14:45–15:40 | 26. Feedback cuando un agente falla | Cómo usar WebMCP |
| 15:40–16:20 | 27. Cómo difiere de MCP | Diferencias con MCP |
| 16:20–17:00 | 28. Protocolo MCP y API WebMCP | Diferencias con MCP |
| 17:00–17:30 | 29. MCP y WebMCP pueden convivir | Diferencias con MCP |
| 17:30–18:15 | 30. La propuesta de estándar web, hoy | Estándares |
| 18:15–19:00 | 31. Una API que sigue evolucionando | Estándares |
| 19:00–20:00 | 32. Empezar hoy: comprobar soporte | Estándares |
| 20:00–28:00 | 33. TacoAgent: recorrido del demo | Demo: TacoAgent |
| 28:00–30:00 | 34. Demo en acción | Demo: TacoAgent |

Las notas de cada slide desarrollan su explicación y contienen fuentes. La presentación web y el deck editable utilizan los mismos datos.

## Mapa del contenido recuperado

| Tema de la charla original | Slides actuales | Qué se conserva y actualiza |
| --- | --- | --- |
| Definición y problema | 2–5 | Contrato de acciones y misma reserva con dos rutas. La definición va primero. |
| Casos de uso y marcas | 6–12 | Viajes, formularios médicos o legales para revisión, comercio, soporte y diagnósticos. Marcas de I/O como experimentos anunciados. |
| Adopción y APIs | 13–20 | Migración gradual, HTML, handler, JavaScript, schemas, errores y ciclo de vida. |
| Eventos y CSS | 21–22 | toolactivated, toolcancel y pseudo-clases vigentes. |
| Buenas prácticas | 23–26 | Tipos, Skill, DevTools, seguridad y feedback después del lanzamiento. |
| MCP y arquitectura | 27–29 | Contextos, transportes y coexistencia sin reducir MCP a server-to-server. |
| Estado y setup | 30–32 | Draft actual, migración a document.modelContext y detección de soporte antes de configurar. |
| Demo | 33–34 | TacoAgent y video local. Sin agenda ni taller como enfoque de la presentación. |

No se recuperan cifras antiguas de uso de IA ni promesas universales de velocidad, determinismo o autorización automática. Los casos de diseño están identificados como ejemplos y las menciones de marcas se limitan al anuncio histórico citado.

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

## Demo de TacoAgent: ocho minutos

### 0:00–0:45 · Mostrar la UI y el estado

Pulsar «Reiniciar». Enseñar el catálogo de restaurantes, el carrito vacío y el indicador de soporte. Explicar que búsqueda, menú y carrito también funcionan con los controles humanos.

En el catálogo de la UI hay inicialmente una herramienta declarativa, `searchRestaurants`, y dos imperativas, `getRestaurantInfo` y `viewCart`. El registro imperativo tiene dos herramientas en este estado.

### 0:45–1:30 · Búsqueda declarativa

Usar `searchRestaurants` con cocina mexicana y precio sin filtro. En el Inspector, tomar los nombres de campos del formulario:

```json
{ "cuisine": "mexicana", "priceRange": "all" }
```

Mostrar que la búsqueda devuelve restaurantes y sus IDs. Señalar `toolname`, `tooldescription` y `toolautosubmit` en el formulario. Este envío automático corresponde a una búsqueda que no crea pedidos.

### 1:30–2:15 · Abrir un menú

Ejecutar `getRestaurantInfo`:

```json
{ "restaurantId": "taco-loco" }
```

El menú de Taco Loco aparece en la UI y devuelve productos, precios e IDs. La herramienta `addToCart` pasa a estar disponible. Este callback cambia la selección, por lo que no se describe como una lectura pura.

### 2:15–3:15 · Agregar productos

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

### 3:15–4:15 · Un error que permite corregir

Intentar un producto agotado:

```json
{
  "restaurantId": "taco-loco",
  "menuItemId": "quesadilla",
  "quantity": 1
}
```

La respuesta informa que no está disponible y el carrito válido permanece. Como alternativa, probar `quantity: 0` para mostrar que el contrato y la función rechazan una cantidad inválida. La app exige un entero entre 1 y 10.

### 4:15–5:00 · Comparar respuesta y estado

Ejecutar `viewCart` con `{}`. La respuesta contiene `success`, `message`, `items`, `itemCount`, `total` y `currency`. Comparar productos y total con la UI.

Frase útil: «La herramienta y la persona leen el mismo estado. El esquema explica los argumentos y la función aplica las reglas.»

### 5:00–6:00 · Disponibilidad dinámica

Con productos aparecen `clearCart` y `checkout`. Vaciar con `clearCart` y observar que esas operaciones desaparecen. El menú queda abierto, así que `addToCart` sigue disponible. Agregar otra vez las dos órdenes para continuar.

| Estado | Herramientas imperativas | Total con la búsqueda declarativa |
| --- | --- | --- |
| Inicio | 2 | 3 |
| Menú abierto | 3 | 4 |
| Carrito con productos | 5 | 6 |
| Carrito vacío, menú abierto | 3 | 4 |

Mostrar `ToolRegistry` en `lib/webmcp.ts`: conserva registros que siguen siendo válidos y retira los demás con `AbortController`. Retirar un registro no cancela por sí mismo una ejecución activa.

### 6:00–8:00 · Revisión y confirmación humana

Ejecutar `checkout` con `{}`. Devuelve `success: true` y `status: "pending-human-review"`. Se abre un diálogo con productos y total.

La persona compara el carrito y pulsa **Confirmar pedido ficticio**. `confirmOrder` sólo pertenece a ese botón y no está registrado como herramienta. La app muestra un ID de pedido local y vacía el carrito. No hay cobro, envío ni almacenamiento de datos personales.

Decir: «La herramienta preparó la revisión. La persona confirmó un efecto concreto después de verlo.»

El video local de respaldo está enlazado en la slide 34 y disponible en `http://127.0.0.1:3001/demo-backup/TacoAgent-WebMCP-respaldo.mp4`.

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
