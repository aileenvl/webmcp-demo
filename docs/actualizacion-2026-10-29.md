# Actualización de la charla · 29 de octubre de 2026

La sesión tiene **34 slides en español**, tema claro y **30 minutos**: 20 para explicación, 8 para TacoAgent y 2 para cierre o preguntas. La definición aparece inmediatamente después del título.

| Orden solicitado | Slides | Contenido visible |
| --- | --- | --- |
| Título | 1 | WebMCP y Aileen Villanueva. |
| Qué es WebMCP | 2–5 | Definición, problema que resuelve con el ejemplo de Sarah, participantes y recorrido de una llamada. |
| Para qué sirve | 6–12 | Viajes, formularios complejos, comercio, soporte, diagnósticos, herramientas de trabajo, Aisle/Alza/Roque Nights, PayPal y límites. |
| Cómo usarlo | 13–26 | Adopción gradual, HTML y JavaScript, respuesta del formulario, schema, validación, errores, ciclo de vida, eventos, CSS, Types/Skill, DevTools, seguridad y feedback. |
| Diferencias con MCP | 27–29 | Alcance, contexto, protocolo, transportes y coexistencia. |
| Estándares | 30–32 | Estado real del borrador, evolución de la API y comprobación/configuración del navegador. |
| Demo | 33–34 | TacoAgent: menú, carrito y revisión humana; enlaces al demo y al video local de respaldo. |

El [guion](guion-presentacion.md) sigue este mismo orden. El [recorrido de TacoAgent](guion-demo.md) contiene las llamadas y resultados para el demo. Los tiempos son estimaciones de ensayo.

## Recuperación de la charla anterior

Se compararon el `SCRIPT.md` y los datos originales de la presentación anterior con el material actual. Se recuperaron los casos de viajes, comercio, formularios médicos o legales como ejemplos de preparación de datos para revisión, soporte y diagnósticos. También volvieron los eventos de formularios, estados CSS, mejora progresiva y diseño de herramientas. Las marcas de Google I/O se identifican como experimentos anunciados, sin afirmar despliegue universal ni atribuirles el flujo hipotético de una slide.

Se actualizaron afirmaciones antiguas sobre la API, el alcance de MCP, la autenticación, el descubrimiento y el estado del estándar. El [mapa de cobertura](fuentes-y-cobertura.md) distingue lo conservado, reubicado y corregido, e identifica las fuentes compartidas que no pudieron recuperarse directamente.

## Código y documentación actual

La revisión contrasta el demo y los ejemplos con las guías actuales de Chrome, el borrador WebMCP del 27 de octubre de 2026 y MCP **2026-07-28**. Los detalles y límites constan en la [matriz de revisión](revision-api-2026-10-29.md).

El demo usa `document.modelContext`, registro asíncrono con `registerTool(tool, { signal })`, callbacks con una señal de ejecución distinta de la señal del registro y un formulario HTML con `agentInvoked`/`respondWith()`. Las slides de eventos escuchan sobre `document.modelContext`; se conservan las pseudo-clases declarativas vigentes.

La revisión corrigió entradas no válidas y campos adicionales, normalización de cocina, cancelación antes de una mutación, retirada de registros pendientes y publicación de un conteo obsoleto. La lógica se comprueba con pruebas de comportamiento; la integración nativa se revisa aparte en un navegador compatible. La confirmación del pedido ficticio sigue perteneciendo al botón de la persona.

## Respaldo sin conexión

La última slide enlaza al MP4 local de dos minutos. El archivo incorpora textos en español y no tiene audio para permitir narración en vivo. Usa capturas y resultados de llamadas nativas; no presenta una conversación con un LLM. Reproducir el MP4 descargado no requiere internet ni el servidor. El demo y las slides web sí necesitan su servidor local.

## Fuentes de referencia

- [Introducción y casos de uso](https://developer.chrome.com/docs/ai/webmcp).
- [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api) y [declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api).
- [Especificación WebMCP](https://webmachinelearning.github.io/webmcp/) y [MCP 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28).
- [Web de Sarah Drasner](https://webmcp-demo-sdras.netlify.app/), [Google I/O](https://developer.chrome.com/blog/chrome-at-io26) y [PayPal](https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/).
- [DevTools WebMCP](https://developer.chrome.com/docs/devtools/application/webmcp), [tipos](https://github.com/webmachinelearning/webmcp-types) y [Skill](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md).
- [Feedback fuera del flujo del agente, André Bandarra](https://bandarra.me/posts/webmcp-feedback-loop).
