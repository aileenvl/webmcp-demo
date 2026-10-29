# Fuentes y cobertura de la charla

Revisión: **29 de octubre de 2026**. La presentación conecta el material compartido con **TacoAgent, el demo del repositorio**: buscar restaurantes, abrir un menú, preparar un carrito y revisar un pedido ficticio. Los ejemplos de terceros, las APIs implementadas y las propuestas futuras se identifican por separado. Las fuentes se incluyen también en las notas de cada diapositiva.

## Las cinco partes solicitadas

| Parte solicitada | Qué se explica | Fuente primaria |
| --- | --- | --- |
| «por qué nace WebMCP» | Una petición humana exige traducirse a acciones. El mismo widget de reserva de Sarah muestra dos rutas: interpretar la interfaz o invocar capacidades declaradas. La UI y su contrato de acciones comparten estado. | [Demo de Sarah Drasner](https://webmcp-demo-sdras.netlify.app/), [código original](https://github.com/sdras/webmcp-demo). |
| «qué es WebMCP» | Una propuesta de API web: la página declara herramientas, el navegador media y un cliente compatible las descubre e invoca. Registrar funciones no instala un modelo ni crea un chatbot. Se presentan las rutas HTML y JavaScript. | [Introducción de Chrome](https://developer.chrome.com/docs/ai/webmcp), [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api), [API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api). |
| «para qué se usa» | Comercio, agendas, aplicaciones de trabajo y herramientas creativas. Los casos Aisle, Alza y Roque Nights explican disponibilidad según el estado. PayPal aporta un resultado medido con alcance delimitado. | [Guía de flujos](https://developer.chrome.com/docs/ai/webmcp/build-tools), [galería del Challenge](https://webmcp.devpost.com/project-gallery?page=1), [prueba de PayPal](https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/). |
| «cómo difiere de MCP» | MCP conecta clientes con servidores locales o remotos; WebMCP expone capacidades del documento abierto. Pueden convivir y reutilizar servicios de negocio. Compartir contexto no elimina la autorización. | [Comparación de Chrome, actualizada el 27 de octubre](https://developer.chrome.com/docs/ai/webmcp/compare-mcp), [especificación MCP](https://modelcontextprotocol.io/specification/2025-11-25). |
| «platicar que ya es standard y cómo se puede empezar a usar el día de hoy» | Se precisa el estado real de la propuesta y después se prueba soporte en la pestaña. Se muestran registro, validación, disponibilidad dinámica, Types, Skill, DevTools, seguridad y feedback, antes del recorrido de TacoAgent. | [Estado del borrador](https://webmachinelearning.github.io/webmcp/), [estado de implementación](https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md), [herramientas en DevTools](https://developer.chrome.com/docs/devtools/application/webmcp). |

La última parte une estado del estándar y pasos para comenzar. La expresión solicitada «ya es standard» se explica con el estado publicado: **Draft Community Group Report del 27 de octubre de 2026; no es un W3C Standard ni está en W3C Standards Track**. No se presenta como una recomendación W3C aprobada o como soporte universal. La [especificación](https://webmachinelearning.github.io/webmcp/) declara esos límites expresamente.

## Los tres materiales de LinkedIn compartidos

| Material del usuario | Contenido que debe verse en la presentación | Evidencia y contraste |
| --- | --- | --- |
| [Registro dinámico, André Bandarra](https://www.linkedin.com/feed/update/urn:li:activity:7520892911392030720/) | Registrar 50 herramientas al cargar puede añadir contexto y ofrecer acciones antes de que la UI esté lista. **Aisle:** `finalize_chart` sólo cuando todos tienen asiento y se cumplen las reglas. **Alza:** `extend_selected_wall` con exactamente una pared seleccionada. **Roque Nights:** coordinar las llamadas activas antes de retirar herramientas. | El usuario aportó el texto completo de esos ejemplos. La [guía actual de JavaScript](https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools) confirma `registerTool(tool, { signal })` y retirada con `abort()`. La [galería del Challenge](https://webmcp.devpost.com/project-gallery?page=1) identifica los tres proyectos. |
| [Types y Skill, Sarah Drasner](https://www.linkedin.com/feed/update/urn:li:activity:7517933168335847424/) | **Types:** inferencia de los argumentos de `execute` desde `inputSchema`. **Skill:** prácticas para diseñar, evaluar e implementar herramientas, incluida seguridad y flujos con consecuencias. Se explica para qué sirve cada recurso. | [Tipos upstream](https://github.com/webmachinelearning/webmcp-types) y [Skill de GoogleChromeLabs](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md). Los tipos no añaden soporte al navegador. |
| [Cerrar el feedback loop, André Bandarra](https://www.linkedin.com/feed/update/urn:li:activity:7508545474149142528/) | Un agente puede fallar silenciosamente. El prototipo `fileSupportTicket` añade señal, pero también permisos, latencia y puntos ciegos: no observa una herramienta que el agente nunca seleccionó. El reporting fuera del flujo se presenta como **propuesta**. | [Artículo original del autor](https://bandarra.me/posts/webmcp-feedback-loop). Los endpoints inspirados en Reporting API, eventos adicionales y telemetría agregada no se describen como una API WebMCP disponible hoy. |

Estos detalles deben aparecer en el contenido visible; las notas amplían la explicación y conservan las referencias.

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

## Los nueve enlaces de X: alcance de la verificación

El acceso directo a los enlaces siguientes devolvió **403, contenido no accesible o falta de caché** en la herramienta de consulta. No se recuperaron íntegramente sus textos o vídeos desde X y no se afirma que cada ID corresponda a un tema específico.

| Enlace aportado | Estado del acceso directo |
| --- | --- |
| [Sarah · 2112167393044672954](https://x.com/sarah_edo/status/2112167393044672954) | Bloqueado / sin contenido directo verificable. |
| [Sarah · 2110726172128485829](https://x.com/sarah_edo/status/2110726172128485829) | Bloqueado / sin contenido directo verificable. |
| [Sarah · 2109647352067670072](https://x.com/sarah_edo/status/2109647352067670072) | Sin caché / sin contenido directo verificable. |
| [Kasper · 2104212027871031663](https://x.com/kaskulikowski/status/2104212027871031663) | Sin caché / sin contenido directo verificable. |
| [Sarah · 2103485305500115096](https://x.com/sarah_edo/status/2103485305500115096) | Bloqueado / sin contenido directo verificable. |
| [Sarah · 2102025644066373858](https://x.com/sarah_edo/status/2102025644066373858) | Bloqueado / sin contenido directo verificable. |
| [Sarah · 2100949353020129388](https://x.com/sarah_edo/status/2100949353020129388) | Bloqueado / sin contenido directo verificable. |
| [Sarah · 2098052992557810172](https://x.com/sarah_edo/status/2098052992557810172) | Sin caché / sin contenido directo verificable. |
| [Sarah · 2094496903073534446](https://x.com/sarah_edo/status/2094496903073534446) | Bloqueado / sin contenido directo verificable. |

La búsqueda indexada permitió localizar temas relacionados, que se contrastaron con sus fuentes primarias: [extensión Jev de Sarah](https://github.com/sdras/jev-webmcp-extension), [su demo de compras](https://github.com/sdras/shopping-cart-webmcp), [experimento descrito por Kasper](https://www.kulikowski.me/blog/trying-jev-with-webmcp), Types, Skill, DevTools y el caso PayPal. Esto respalda esos temas, **no una correspondencia exacta entre cada ID de X y una afirmación**. Los experimentos con Jev sirven como contexto adicional; la charla y el demo de TacoAgent no dependen de ejecutarlos.

El enlace corto de LinkedIn [lnkd.in/p/gS3tVsUT](https://lnkd.in/p/gS3tVsUT) tampoco pudo resolverse mediante la consulta. No se le atribuye un contenido supuesto.
