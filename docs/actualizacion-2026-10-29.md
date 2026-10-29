# Adaptación · 29 de octubre de 2026

La charla usa TacoAgent como ejemplo continuo para una sesión de 30 minutos.

## Material incorporado

- **Registro dinámico:** del texto de André sobre Aisle, Alza y Roque Nights tomamos el principio de registrar acciones sólo cuando existen sus precondiciones. No atribuimos métricas ni detalles no verificados a esos proyectos.
- **Skill y tipos:** enlazamos el Skill de GoogleChromeLabs y los tipos upstream. Son ayudas al desarrollo; no garantizan seguridad ni corrección.
- **Feedback:** enseñamos resultados y errores locales. El reporting fuera de banda del artículo de André se presenta como propuesta, no como API desplegada.

## Actualización técnica

`document.modelContext` sustituye el uso anterior de `navigator.modelContext`. El registro asíncrono usa `AbortSignal`, se retira con `abort()` y no se repite con cada render. Cada ejecución vuelve a validar entradas y estado. `checkout` sólo solicita revisión; la confirmación ocurre por separado en la interfaz. El recorrido ficticio no solicita datos personales. El modo guiado sin IA se identifica claramente.

WebMCP sigue siendo experimental: el documento del 27 de octubre de 2026 es un borrador de Community Group, no un estándar W3C publicado. Los hints orientan al consumidor de herramientas y no sustituyen autorización ni validación.

Los enlaces de X y algunos enlaces de LinkedIn no pudieron recuperarse directamente. Usamos el texto aportado en la solicitud y verificamos los detalles en fuentes primarias; no atribuimos contenido que no pudimos leer.

## Fuentes primarias

- https://webmachinelearning.github.io/webmcp/
- https://developer.chrome.com/docs/ai/webmcp
- https://developer.chrome.com/docs/ai/webmcp/imperative-api
- https://developer.chrome.com/docs/ai/webmcp/declarative-api
- https://developer.chrome.com/docs/ai/webmcp/best-practices
- https://developer.chrome.com/docs/ai/webmcp/secure-tools
- https://github.com/webmachinelearning/webmcp-types
- https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md
- https://bandarra.me/posts/webmcp-feedback-loop

## Criterios de aceptación

- Búsqueda, apertura de menú, carrito y revisión funcionan en la interfaz local.
- Cantidades fraccionarias, cero, mayores de diez y productos agotados no alteran el carrito.
- No hay registros nativos duplicados; las herramientas se retiran al desaparecer su precondición.
- Ninguna herramienta confirma pedidos; modificar el carrito invalida la revisión.
- La falta de soporte nativo se comunica y no bloquea el recorrido guiado.
- Las pruebas y el build deben pasar antes de publicar los cambios.
