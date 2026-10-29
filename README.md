# TacoAgent · WebMCP

Material en español de **Aileen Villanueva** para una sesión de **30 minutos**, actualizado el **29 de octubre de 2026**. **TacoAgent, el demo de este repositorio, es el ejemplo principal de la charla.**

La presentación contiene **22 slides** y recorre cinco partes: **por qué nace WebMCP**, **qué es**, **para qué se usa**, **cómo difiere de MCP**, y **estado de la propuesta y cómo empezar hoy**. Plan de ensayo: **18 minutos de explicación, 10 de demo y 2 de cierre**.

TacoAgent es una tienda ficticia: busca restaurantes, abre un menú, agrega productos al carrito y solicita la revisión de un pedido. Una persona confirma desde la interfaz. No hay pagos, envíos ni pedidos reales. Los datos viven en memoria y se reinician al recargar.

## Ejecutar

Requiere Node.js **20.9 o superior** y npm.

```sh
npm ci
npm run dev
```

Con el puerto 3000 por defecto:

| Material | Enlace |
| --- | --- |
| Demo TacoAgent | [localhost:3000](http://localhost:3000) |
| Presentación · 22 slides | [localhost:3000/slides/index.html](http://localhost:3000/slides/index.html) |

Si usas otro puerto, cambia sólo `3000` en esos enlaces. La presentación estática termina en `index.html`. Usa **←/→** para navegar, **G** para el índice, **N** para notas y fuentes y **F** para pantalla completa.

El [guion de la presentación](docs/guion-presentacion.md) desarrolla las cinco partes; el [guion de 10 minutos del demo](docs/guion-demo.md) contiene las llamadas, resultados y respaldo con el panel local. La [nota de adaptación](docs/actualizacion-2026-10-29.md) y la [cobertura de fuentes](docs/fuentes-y-cobertura.md) explican el material incorporado.

## Herramientas de TacoAgent

| Herramienta | Tipo | Disponibilidad | Resultado |
| --- | --- | --- | --- |
| `searchRestaurants` | Formulario declarativo | Siempre | Filtra por cocina y precio; devuelve restaurantes y menús |
| `getRestaurantInfo` | JavaScript | Siempre | Devuelve un menú y abre el restaurante en la UI |
| `viewCart` | JavaScript | Siempre | Devuelve productos, cantidad y total actuales; permite consultar el carrito vacío |
| `addToCart` | JavaScript | Hay un menú abierto | Valida restaurante, producto, stock y cantidad antes de agregar |
| `clearCart` | JavaScript | Carrito no vacío | Vacía el carrito local e invalida la revisión pendiente |
| `checkout` | JavaScript | Carrito no vacío | Abre la revisión y devuelve `pending-human-review`; no confirma |

Contando la herramienta HTML y las de JavaScript, el flujo es **3 → 4 → 6 → 4**: inicio, menú abierto, carrito con productos y carrito vacío tras confirmar o vaciar. El menú continúa abierto al vaciar el carrito. **Reiniciar** vuelve al estado inicial con tres herramientas.

El registro usa `document.modelContext.registerTool(tool, { signal })` y se retira con `AbortController.abort()`. Las acciones vuelven a validar entradas y estado al ejecutarse. La búsqueda usa `<form toolname="searchRestaurants" tooldescription="…" toolautosubmit>`; el envío del agente recibe el resultado mediante `SubmitEvent.respondWith()`.

## Recorrido del demo

1. Muestra el carrito vacío, las herramientas iniciales y el indicador del navegador.
2. Busca cocina mexicana mediante `searchRestaurants` y explica la API declarativa.
3. Abre Taco Loco con `getRestaurantInfo`; aparece `addToCart`.
4. Agrega dos órdenes de tacos; aparecen `clearCart` y `checkout`.
5. Consulta `viewCart` y prueba un producto agotado o una cantidad inválida.
6. Invoca `checkout`, revisa productos y total y confirma el pedido ficticio desde la interfaz.
7. Observa el carrito vacío y la retirada de las herramientas que lo necesitan.

El esquema limita `quantity` a un entero de 1 a 10. La función también verifica ese límite, el stock y que el producto pertenezca al restaurante abierto. Modificar el carrito invalida la revisión preparada. La confirmación final no se expone como herramienta.

## Modo nativo y ensayo local

Comprueba primero `Boolean(document.modelContext)` y el indicador del demo. Si falta soporte, sigue la [guía oficial de Chrome](https://developer.chrome.com/docs/ai/webmcp): en un navegador compatible, habilita `chrome://flags/#enable-webmcp-testing` cuando corresponda, pulsa **Relaunch** y vuelve a localhost o HTTPS. El soporte depende de la versión y la configuración del navegador.

Para llamadas nativas manuales, utiliza **Chrome DevTools → Application → WebMCP**, o el [WebMCP Model Context Tool Inspector oficial](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd). Las llamadas manuales no necesitan un modelo. El modo de lenguaje natural con Gemini de la extensión requiere una API key propia.

El panel **«Ensayo guiado»**, marcado **«Local · sin IA»**, permite practicar el recorrido aunque falte WebMCP. Sus botones ejecutan las mismas funciones de negocio; no registran una API falsa, no interpretan lenguaje natural y no demuestran una decisión de un LLM.

## Verificación

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

Las pruebas cubren precondiciones, cantidades, stock, IDs, estado actual, revisión y ciclo de registro con un adaptador de prueba. La integración nativa se comprueba además en un navegador compatible. La [nota de dependencias](docs/dependencias-2026-10-29.md) documenta las actualizaciones y alertas restantes.

## Fuentes

- [Especificación WebMCP](https://webmachinelearning.github.io/webmcp/): Draft Community Group Report; no es un W3C Standard publicado.
- [Introducción de Chrome](https://developer.chrome.com/docs/ai/webmcp), [comparación con MCP](https://developer.chrome.com/docs/ai/webmcp/compare-mcp), [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api) y [declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api).
- [Demo explicativa de Sarah Drasner](https://webmcp-demo-sdras.netlify.app/) y [sandbox de PayPal](https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/).
- [Seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools), [DevTools](https://developer.chrome.com/docs/devtools/application/webmcp), [tipos upstream](https://github.com/webmachinelearning/webmcp-types) y [Skill de GoogleChromeLabs](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md).
- [Closing the WebMCP Feedback Loop, André Cipriani Bandarra](https://bandarra.me/posts/webmcp-feedback-loop): propuesta de observabilidad fuera del flujo, con límites identificados en la charla.

[Repositorio del demo](https://github.com/aileenvl/webmcp-demo) · [Repositorio de la presentación](https://github.com/aileenvl/webmcp-presentation) · [Despliegue existente](https://webmcp-demo-ten.vercel.app). Una rama o PR no actualiza producción por sí sola; la versión pública depende del despliegue de Vercel.
