# TacoAgent · WebMCP

Demo en español para **«Prepara tu webapp para los agentes de nuestro día a día»**. Actualizado el **29 de octubre de 2026**, para una sesión de 30 minutos.

TacoAgent es una tienda ficticia: descubre restaurantes, abre un menú, agrega productos al carrito y solicita la revisión de un pedido. Una persona confirma en la interfaz. No hay pagos, envíos ni pedidos reales. Los datos viven en memoria y se reinician al recargar.

## Ejecutar hoy

Requiere Node.js 20.9 o superior y npm.

```sh
npm ci
npm run dev
```

Abre [localhost:3000](http://localhost:3000).

Las **14 slides con el tema de la presentación original** están en [localhost:3000/slides/index.html](http://localhost:3000/slides/index.html). Usa ←/→ para navegar, **G** para el índice, **N** para notas y fuentes y **F** para pantalla completa. El [guion de 30 minutos](docs/guion-presentacion.md) acompaña la charla.

- **WebMCP nativo:** en Chrome, abre `chrome://flags/#enable-webmcp-testing`, selecciona **Enabled**, pulsa **Relaunch** y vuelve al demo. Usa localhost o HTTPS. En la consola, `Boolean(document.modelContext)` debe devolver `true`. El soporte depende de la versión y configuración del navegador.
- **Inspector:** instala el [WebMCP Model Context Tool Inspector oficial](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd) para descubrir e invocar herramientas. Las llamadas manuales no necesitan un modelo; su modo de lenguaje natural con Gemini requiere una API key propia.
- **Demo guiado local:** los botones del panel ejecutan las mismas acciones de la aplicación, sin IA ni claves. Funciona aunque el navegador no exponga WebMCP; se identifica expresamente como modo local.

Consulta la [guía oficial de Chrome](https://developer.chrome.com/docs/ai/webmcp) para opciones vigentes de prueba. El origin trial existe desde Chrome 149; esto no implica que la API esté habilitada en todos los navegadores.

## Herramientas

| Herramienta | Tipo | Disponibilidad | Resultado |
| --- | --- | --- | --- |
| `searchRestaurants` | Formulario declarativo | Siempre | Filtra restaurantes por cocina y precio |
| `getRestaurantInfo` | JavaScript | Siempre | Devuelve el menú y abre el restaurante |
| `addToCart` | JavaScript | Hay un menú abierto | Valida ID, stock y cantidad antes de agregar |
| `viewCart` | JavaScript | Siempre | Devuelve carrito y total actuales |
| `clearCart` | JavaScript | Carrito no vacío | Vacía el carrito local |
| `checkout` | JavaScript | Carrito no vacío | Abre la revisión; no confirma el pedido |

Las herramientas dinámicas usan `document.modelContext.registerTool(tool, { signal })` y se retiran con `AbortController.abort()`. Las funciones vuelven a validar entradas y estado al ejecutarse. `navigator.modelContext`, `unregisterTool()` y `provideContext()` pertenecen a versiones anteriores de la API.

La búsqueda usa `<form toolname="searchRestaurants" tooldescription="…">`. Un envío del agente interceptado por JavaScript recibe su respuesta mediante `SubmitEvent.respondWith()`.

## Presentar

El [guion de 7 minutos](docs/guion-demo.md) incluye parámetros para copiar y plan de respaldo. El [resumen de adaptación](docs/actualizacion-2026-10-29.md) explica los cambios y sus fuentes.

1. Muestra las herramientas iniciales y el carrito vacío.
2. Busca comida mexicana y abre Taco Loco.
3. Agrega dos órdenes de tacos; aparecen `clearCart` y `checkout`.
4. Prueba una quesadilla agotada y una cantidad inválida.
5. Llama `checkout`: abre una revisión en la interfaz.
6. Confirma personalmente el pedido simulado; el carrito se vacía y las herramientas desaparecen.

## Verificar

```sh
npm test
npm run build
```

Las pruebas cubren validación, estado, revisión y ciclo de vida con un adaptador de prueba. El adaptador no sustituye la verificación nativa en un navegador compatible.

## Fuentes

- [Especificación WebMCP](https://webmachinelearning.github.io/webmcp/): borrador de Community Group; no es un estándar W3C publicado.
- [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api) y [declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api).
- [Buenas prácticas](https://developer.chrome.com/docs/ai/webmcp/best-practices) y [seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools).
- [Tipos TypeScript upstream](https://github.com/webmachinelearning/webmcp-types).
- [Skill de GoogleChromeLabs](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md).
- [Closing the WebMCP Feedback Loop, André Cipriani Bandarra](https://bandarra.me/posts/webmcp-feedback-loop): propuestas de observabilidad, no una API de reporting ya desplegada.

## Enlaces

- [Repositorio del demo](https://github.com/aileenvl/webmcp-demo).
- [Repositorio de la presentación](https://github.com/aileenvl/webmcp-presentation).
- [Despliegue existente](https://webmcp-demo-ten.vercel.app): la versión depende del último despliegue de Vercel. Una rama o PR no actualiza producción por sí sola.

Autora: [Aileen Villanueva](https://github.com/aileenvl).
