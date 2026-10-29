# Adaptación de la charla · 29 de octubre de 2026

La sesión actual dura **30 minutos**, contiene **22 slides** y utiliza **TacoAgent, el demo del repositorio**, como ejemplo principal. El plan de ensayo es **18 minutos de explicación, 10 de demo y 2 de cierre**. Los conceptos se conectan con búsqueda, menú, carrito, errores y revisión de un pedido ficticio.

## Hilo de las 22 slides

| Parte | Slides | Contenido |
| --- | --- | --- |
| Por qué nace WebMCP | 2–4 | Intención humana, acciones de una página y el ejemplo de reserva de Sarah |
| Qué es | 5–7 | Capacidades del documento, papel del navegador y APIs imperativa y declarativa |
| Para qué se usa | 8–10 | Casos concretos, herramientas según el contexto y el sandbox de PayPal |
| Cómo difiere de MCP | 11–12 | Servidores locales o remotos y capacidades de la página abierta; convivencia |
| Estado de la propuesta y empezar hoy | 13–20 | Soporte, contratos, registro dinámico, Types, Skill, DevTools, seguridad y feedback |

La slide 1 abre la charla, la 21 conduce el demo de TacoAgent y la 22 propone un primer paso y abre preguntas. El [guion de la presentación](guion-presentacion.md) desarrolla las cinco partes y el [guion del demo](guion-demo.md) contiene las llamadas exactas. Los tiempos son una estimación para ensayar.

## Qué muestra TacoAgent

La búsqueda se declara con un formulario HTML, `toolname`, `tooldescription` y `toolautosubmit`. Cuando el agente envía el formulario y JavaScript intercepta el envío, `SubmitEvent.respondWith()` devuelve el resultado.

Las demás acciones usan funciones JavaScript compartidas con la interfaz. `getRestaurantInfo` abre un menú; entonces aparece `addToCart`. Con productos en el carrito aparecen `clearCart` y `checkout`. `viewCart` permite leer el estado actual incluso cuando está vacío.

El recuento total, incluida la herramienta HTML, es **3 → 4 → 6 → 4**: inicio, menú abierto, productos agregados y carrito vacío después de confirmar o vaciar. El menú permanece abierto. «Reiniciar» vuelve a tres herramientas.

La función valida restaurante, producto, stock y cantidad entera de 1 a 10. Los errores conservan el carrito y explican cómo corregir la llamada. `checkout` devuelve **`pending-human-review`** y abre una revisión; una persona confirma desde la interfaz. Modificar el carrito invalida la revisión pendiente. No hay pagos, envíos ni datos personales requeridos; el estado vive en memoria.

El panel «Ensayo guiado», marcado «Local · sin IA», ejecuta las mismas funciones de negocio para practicar. Las llamadas de ese panel son JavaScript directo. La invocación nativa se demuestra desde DevTools o un Inspector compatible, y se distingue de evaluar las decisiones de un LLM.

## Material reciente incorporado

- **Sarah:** la reserva se explica con el mismo widget y objetivo por dos rutas. La comparación es didáctica, no un benchmark universal.
- **Registro dinámico:** los ejemplos Aisle, Alza y Roque Nights del texto de André aportado por Aileen muestran cuándo una herramienta tiene sentido y cómo coordinar su retirada. TacoAgent concreta ese principio con el menú abierto y el contenido del carrito.
- **PayPal:** se conserva el alcance de su prueba interna pequeña en sandbox y la revisión del comprador. Las cifras se presentan con sus límites en las slides y sus notas.
- **Types, Skill y DevTools:** se incluyen recursos actuales para desarrollar e inspeccionar contratos. Los tipos no añaden soporte al navegador; los hints no sustituyen validación o autorización.
- **Feedback:** las respuestas estructuradas y errores del demo hacen visible qué ocurrió. El reporting fuera de banda del artículo de André se presenta como propuesta; el resultado local del inspector ofrece otra señal de depuración.

La cobertura y atribución detalladas están en [Fuentes y cobertura](fuentes-y-cobertura.md) y en las notas de cada slide. Los enlaces de X y el enlace corto de LinkedIn no se recuperaron íntegramente: no se atribuye contenido supuesto a esos IDs. Los ejemplos de LinkedIn se apoyan en el texto aportado y en fuentes primarias.

## API y estado de la propuesta

La implementación utiliza **`document.modelContext`**, registro asíncrono con `registerTool(tool, { signal })` y retirada con `AbortController.abort()`. El adaptador conserva los registros que siguen siendo útiles. Cada ejecución vuelve a validar entradas y estado. Retirar un registro no equivale a cancelar automáticamente una ejecución ya activa.

El documento publicado el **27 de octubre de 2026** es un **Draft Community Group Report**: WebMCP es una propuesta abierta en evolución y no un W3C Standard publicado ni un documento de Standards Track. La charla explica cómo probarlo hoy en un navegador compatible con ese estado real.

## Fuentes primarias

- [Especificación WebMCP](https://webmachinelearning.github.io/webmcp/).
- [Introducción de Chrome](https://developer.chrome.com/docs/ai/webmcp) y [comparación con MCP](https://developer.chrome.com/docs/ai/webmcp/compare-mcp).
- [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api) y [declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api).
- [Demo de Sarah Drasner](https://webmcp-demo-sdras.netlify.app/) y [código original](https://github.com/sdras/webmcp-demo).
- [Caso PayPal](https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/).
- [Seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools) y [DevTools WebMCP](https://developer.chrome.com/docs/devtools/application/webmcp).
- [Tipos upstream](https://github.com/webmachinelearning/webmcp-types) y [Skill de GoogleChromeLabs](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md).
- [Closing the WebMCP Feedback Loop, André Cipriani Bandarra](https://bandarra.me/posts/webmcp-feedback-loop).
