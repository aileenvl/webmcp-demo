# Fuentes y cobertura de la charla

Revisión web nueva: **29 de octubre de 2026**. Este mapa documenta la presentación de **34 diapositivas**, recupera los casos de uso de la charla original y mantiene **TacoAgent como demo principal**. Las notas de las diapositivas conservan las fuentes. La [revisión de API](revision-api-2026-10-29.md) distingue documentación actual, código local y comprobaciones de ejecución.

## Orden solicitado y cobertura visible

| Orden del usuario | Diapositivas | Contenido visible | Fuente primaria |
| --- | --- | --- | --- |
| Título | 1 | WebMCP y el objetivo de preparar una web para agentes. | [Introducción de Chrome](https://developer.chrome.com/docs/ai/webmcp). |
| Qué es WebMCP | 2–5 | Definición; problema mostrado por Sarah; papeles de persona, página, navegador y agente; flujo de descubrimiento, argumentos, ejecución y resultado. | [Demo de Sarah](https://webmcp-demo-sdras.netlify.app/), [comparación oficial](https://developer.chrome.com/docs/ai/webmcp/compare-mcp), [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api). |
| Para qué sirve | 6–12 | Familias de uso; viajes; comercio; soporte y trabajo; Aisle/Alza/Roque Nights; PayPal; beneficios y límites. Los casos se explican antes del código. | [Casos de Chrome](https://developer.chrome.com/docs/ai/webmcp), [diseño por objetivos](https://developer.chrome.com/docs/ai/webmcp/build-tools), [PayPal](https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/). |
| Cómo usarla | 13–26 | Adopción gradual; HTML y JS; formulario; `respondWith`; `viewCart`; esquema y validación; errores; ciclo con `AbortSignal`; eventos; CSS; Types/Skill; DevTools; seguridad; feedback. | [API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api), [guía moderna JS](https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools), [DevTools](https://developer.chrome.com/docs/devtools/application/webmcp), [seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools). |
| Diferencias con MCP | 27–29 | Alcance del documento frente a servicios; arquitectura; transporte; uso conjunto. | [Chrome, actualización del 27 de octubre](https://developer.chrome.com/docs/ai/webmcp/compare-mcp), [MCP 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28), [transportes](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports). |
| Estándares y comenzar hoy | 30–32 | Estado exacto del borrador; cambios de API documentados; detección de soporte y configuración local sólo cuando falta. | [Borrador WebMCP](https://webmachinelearning.github.io/webmcp/), [historial documentado](https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools), [implementaciones](https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md). |
| Demo TacoAgent | 33–34 | Buscar, abrir menú, rechazar agotado, agregar, revisar y confirmar mediante UI; acceso al demo y respaldo de vídeo. | Código de este repositorio: `app/page.tsx`, `lib/demo-state.ts`, `lib/webmcp.ts`; [GitHub](https://github.com/aileenvl/webmcp-demo). |

El motivo por el que nace WebMCP queda dentro de «qué es», después de definirlo. El estado del estándar se desarrolla después de MCP, conforme al orden solicitado. La expresión anterior «ya es standard» se precisa como **propuesta de estándar web**: el documento publicado es **Draft Community Group Report del 27 de octubre de 2026; no es un W3C Standard ni está en W3C Standards Track**. La [especificación](https://webmachinelearning.github.io/webmcp/) lo declara expresamente.

## Qué se conserva de la charla original

Se contrastó el archivo `lib/slides-data.ts` de `origin/main` del proyecto de presentación. La recuperación mantiene los ejemplos y corrige afirmaciones cuyo alcance o API cambiaron.

| Material original | Tratamiento en las 34 diapositivas |
| --- | --- |
| Problema de interpretar DOM, accesibilidad y capturas | Conservado en 3, con el mismo widget de Sarah y un objetivo comparable. No se afirma que toda automatización de UI falle. |
| Viajes y formularios complejos médicos/legales | Viajes recuperados en 6–7. Los formularios estructurados se explican en 6 y 9 con soporte como ejemplo concreto; la referencia original a portales médicos/legales es una posible aplicación de captura para revisión, sin afirmar despliegues ni decisiones profesionales autónomas. |
| E-commerce: búsqueda, filtros y checkout | Recuperado en 8; evidencia concreta PayPal en 11 y demo TacoAgent en 33–34. |
| Diagnósticos en menús y trabajo con información | Recuperados en 9, con flujos de soporte, CRM y preparación de borradores. |
| Menos contexto, llamadas más claras, eficiencia | Conservados en 12 como ventajas potenciales. La medición tiene su propio caso acotado en 11; un esquema no garantiza corrección ni determinismo del agente. |
| Declarativa, imperativa, mejora progresiva y migración | Conservadas y ampliadas en 13–20. `document.modelContext` sustituye los ejemplos antiguos con `navigator.modelContext`. |
| Eventos y pseudoclases CSS | Recuperados en 21–22. Los eventos se escuchan en `document.modelContext`; se conserva foco visible y se evita animación innecesaria. |
| Seguridad, sesión y anotaciones | Conservadas en 25. Compartir la sesión de la página no otorga autorización ilimitada ni elimina confirmaciones. |
| MCP vs WebMCP | Reubicado en 27–29 y actualizado a MCP **2026-07-28**. Se retira la simplificación «MCP sólo server-to-server». |
| Timeline, Chrome y recursos de prueba | Reubicados en 30–32; sólo versiones documentadas. Primero se detecta soporte; una extensión no es requisito universal. |
| «No headless», «sin discovery», tipos que garantizan ejecución | Corregidos: puede haber uso headless; existe `getTools()` para el contexto autorizado; no hay descubrimiento global de todos los sitios; validación y resultados deben implementarse. |
| Nueve marcas de I/O y Gemini in Chrome | Se conserva el contexto histórico en esta documentación: Google las describió como experimentos, y anunció soporte futuro de Gemini. No se convierte ese anuncio en despliegue universal actual. |

La [publicación de Google I/O del 19 de mayo de 2026](https://developer.chrome.com/blog/chrome-at-io26?hl=en) nombra Expedia, Booking.com, Shopify, Credit Karma, TurboTax, Redfin, Etsy, Instacart y Target como marcas que experimentan. Su promesa de soporte próximo de Gemini in Chrome no demuestra que esté disponible hoy en todas las instalaciones. La [introducción actual](https://developer.chrome.com/docs/ai/webmcp) distingue las extensiones de ejemplo de Gemini in Chrome.

## Los tres materiales de LinkedIn compartidos

| Material del usuario | Contenido que debe verse en la presentación | Evidencia y contraste |
| --- | --- | --- |
| [Registro dinámico, André Bandarra](https://www.linkedin.com/feed/update/urn:li:activity:7520892911392030720/) | Registrar 50 herramientas al cargar puede añadir contexto y ofrecer acciones antes de que la UI esté lista. **Aisle:** `finalize_chart` sólo cuando todos tienen asiento y se cumplen las reglas. **Alza:** `extend_selected_wall` con exactamente una pared seleccionada. **Roque Nights:** coordinar las llamadas activas antes de retirar herramientas. | El usuario aportó el texto completo de esos ejemplos. La [guía actual de JavaScript](https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools) confirma `registerTool(tool, { signal })` y retirada con `abort()`. La [galería del Challenge](https://webmcp.devpost.com/project-gallery?page=1) identifica los tres proyectos. |
| [Types y Skill, Sarah Drasner](https://www.linkedin.com/feed/update/urn:li:activity:7517933168335847424/) | **Types:** inferencia de los argumentos de `execute` desde `inputSchema`. **Skill:** prácticas para diseñar, evaluar e implementar herramientas, incluida seguridad y flujos con consecuencias. Se explica para qué sirve cada recurso. | [Tipos upstream](https://github.com/webmachinelearning/webmcp-types) y [Skill de GoogleChromeLabs](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md). Los tipos no añaden soporte al navegador. |
| [Cerrar el feedback loop, André Bandarra](https://www.linkedin.com/feed/update/urn:li:activity:7508545474149142528/) | Un agente puede fallar silenciosamente. El prototipo `fileSupportTicket` añade señal, pero también permisos, latencia y puntos ciegos: no observa una herramienta que el agente nunca seleccionó. El reporting fuera del flujo se presenta como **propuesta**. | [Artículo original del autor](https://bandarra.me/posts/webmcp-feedback-loop). Los endpoints inspirados en Reporting API, eventos adicionales y telemetría agregada no se describen como una API WebMCP disponible hoy. |

Los tres materiales aparecen de forma visible en 10, 23 y 26, respectivamente; las notas amplían la explicación y conservan las referencias. El texto compartido por el usuario y el artículo original permiten conservar contenido aunque el feed social no sea legible por la herramienta de consulta.

## La web de Sarah y el caso PayPal

La [web explicativa de Sarah](https://webmcp-demo-sdras.netlify.app/) compara **el mismo widget de reserva y el mismo objetivo**. En una ruta se interpreta la interfaz; en la otra, la página ofrece tres herramientas. La cifra ilustrativa de unos 40+ nodos procede de esa página. Es un recurso didáctico, no una medición que demuestre una mejora universal de velocidad, coste o seguridad. Su [repositorio original](https://github.com/sdras/webmcp-demo) permite inspeccionar el ejemplo.

En cambio, [PayPal publicó resultados de una prueba interna pequeña](https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/), el 16 de septiembre de 2026: compra de una tarjeta de regalo en una tienda sandbox, con aproximadamente **4,6× menor coste de inferencia**, **2× más velocidad en la mediana del checkout** y **3 llamadas estructuradas frente a más de 30 pasos de interacción**. La presentación conserva esa delimitación visible. Los resultados son direccionales y varían según tienda, catálogo y asistente. En la experiencia descrita, la persona revisa y aprueba el pago en PayPal.

## Cómo se conecta con TacoAgent

El [demo del repositorio](https://github.com/aileenvl/webmcp-demo) lleva los conceptos al mismo flujo que se presenta en pantalla. No realiza pagos ni envíos: sus datos y pedidos son ficticios y temporales.

| Concepto de la charla | Acción comprobable en TacoAgent |
| --- | --- |
| Contrato declarativo | El formulario `searchRestaurants` filtra restaurantes por cocina y precio; la persona también puede usarlo manualmente. |
| Contrato imperativo | `getRestaurantInfo` abre un menú y permite usar `addToCart`; ambas rutas comparten las funciones de negocio de la UI. |
| Disponibilidad según el estado | Al inicio hay una herramienta HTML y dos JavaScript. Abrir un menú añade `addToCart`; agregar productos habilita `clearCart` y `checkout`. |
| Validación y errores | Un producto agotado o una cantidad que no sea un entero entre 1 y 10 devuelve `success: false` con una explicación. El carrito no cambia. |
| Resultado y revisión | `viewCart` devuelve productos y total. `checkout` abre una revisión con `status: "pending-human-review"`; la persona confirma mediante el botón de la interfaz. |

Contando HTML y JavaScript, el recorrido tiene **3 → 4 → 6 → 4 herramientas**: inicio, menú abierto, carrito con productos y pedido ficticio confirmado. Confirmar o vaciar conserva el menú seleccionado; «Reiniciar» vuelve a las tres iniciales. `confirmOrder` no se registra como herramienta. El panel «Ensayo guiado» llama a las mismas funciones localmente y se identifica como ejecución sin IA; no se presenta como un agente conectado.

## Las herramientas de desarrollo actuales

[Chrome DevTools: Application → WebMCP](https://developer.chrome.com/docs/devtools/application/webmcp) permite inspeccionar registros, esquemas e historial de invocaciones, revisar entradas y resultados y ejecutar herramientas para depurar. Se diferencia esa prueba manual de evaluar si un agente elige la herramienta correcta. El [Inspector](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd) es una alternativa opcional.

Para empezar hoy, **primero se detecta soporte en la pestaña**:

```js
Boolean(document.modelContext)
```

Si la API existe, se continúa con una herramienta pequeña y su inspección. Si falta, se siguen los requisitos del navegador y la [guía de Chrome](https://developer.chrome.com/docs/ai/webmcp): para desarrollo local, habilitar `chrome://flags/#enable-webmcp-testing` cuando corresponda y reiniciar. Se usa localhost o HTTPS. Los flags, una extensión y las declaraciones TypeScript resuelven necesidades distintas.

La [guía imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api) documenta el registro actual en `document.modelContext` y la retirada mediante la señal de registro. Retirar una herramienta no equivale a cancelar su ejecución activa. La [guía de seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools) sustenta la validación, autorización y revisión de acciones con consecuencias.

Los eventos y el CSS de la charla original también se mantienen con la [API declarativa actual](https://developer.chrome.com/docs/ai/webmcp/declarative-api): `toolactivated` y `toolcancel` en `document.modelContext`, con `toolName`; `form:tool-form-active` y `button:tool-submit-active` cuando el submit es un botón. Son señales visuales del flujo; no son prueba de que una transacción terminó correctamente.

## Los nueve enlaces de X: alcance de la verificación

El **nuevo intento del 29 de octubre** devolvió seis respuestas **403** y tres **Cache miss**. La búsqueda por los nueve IDs no recuperó los textos primarios. No se recuperaron íntegramente sus textos o vídeos desde X y no se afirma que cada ID corresponda a un tema específico.

| Enlace aportado | Estado del acceso directo |
| --- | --- |
| [Sarah · 2112167393044672954](https://x.com/sarah_edo/status/2112167393044672954) | HTTP 403. |
| [Sarah · 2110726172128485829](https://x.com/sarah_edo/status/2110726172128485829) | HTTP 403. |
| [Sarah · 2109647352067670072](https://x.com/sarah_edo/status/2109647352067670072) | Cache miss. |
| [Kasper · 2104212027871031663](https://x.com/kaskulikowski/status/2104212027871031663) | Cache miss. |
| [Sarah · 2103485305500115096](https://x.com/sarah_edo/status/2103485305500115096) | HTTP 403. |
| [Sarah · 2102025644066373858](https://x.com/sarah_edo/status/2102025644066373858) | HTTP 403. |
| [Sarah · 2100949353020129388](https://x.com/sarah_edo/status/2100949353020129388) | HTTP 403. |
| [Sarah · 2098052992557810172](https://x.com/sarah_edo/status/2098052992557810172) | Cache miss. |
| [Sarah · 2094496903073534446](https://x.com/sarah_edo/status/2094496903073534446) | HTTP 403. |

La búsqueda indexada permitió localizar temas relacionados, que se contrastaron con sus fuentes primarias: [extensión Jev de Sarah](https://github.com/sdras/jev-webmcp-extension), [su demo de compras](https://github.com/sdras/shopping-cart-webmcp), [experimento descrito por Kasper](https://www.kulikowski.me/blog/trying-jev-with-webmcp), Types, Skill, DevTools y el caso PayPal. Esto respalda esos temas, **no una correspondencia exacta entre cada ID de X y una afirmación**. Los experimentos con Jev sirven como contexto adicional; la charla y el demo de TacoAgent no dependen de ejecutarlos.

El enlace corto de LinkedIn [lnkd.in/p/gS3tVsUT](https://lnkd.in/p/gS3tVsUT) tampoco pudo resolverse mediante la consulta. No se le atribuye un contenido supuesto.
