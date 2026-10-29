# Revisión de API y fuentes · 29 de octubre de 2026

Se volvieron a consultar las fuentes oficiales en esta fecha. Esta revisión documental y de código no se presenta como una nueva ejecución completa en todos los navegadores. La API sigue evolucionando; el código de la charla se contrasta con el borrador y las guías actuales.

## Fuentes vigentes consultadas

| Fuente | Fecha publicada o actualización visible | Uso en la revisión |
| --- | --- | --- |
| [WebMCP: borrador del Web ML CG](https://webmachinelearning.github.io/webmcp/) | 27 octubre 2026 | API de `Document`, algoritmos y estado del documento. |
| [Introducción Chrome](https://developer.chrome.com/docs/ai/webmcp) | Actualizada 7 octubre 2026 | Disponibilidad, pruebas locales, límites y Permissions Policy. |
| [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api) | Actualizada 16 octubre 2026 | Registro, descubrimiento, ejecución y versiones puntuales. |
| [API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api) | Actualizada 25 septiembre 2026 | HTML, envío, resultados, eventos y CSS. |
| [Agentic JavaScript Tools](https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools) | Actualizada 20 octubre 2026 | Métodos retirados, errores, contexto seguro y detección. |
| [Seguridad de herramientas](https://developer.chrome.com/docs/ai/webmcp/secure-tools) | Actualizada 1 septiembre 2026 | Anotaciones, autenticación y controles de aplicación. |
| [WebMCP y MCP](https://developer.chrome.com/docs/ai/webmcp/compare-mcp) | Actualizada 27 octubre 2026 | Diferencia de alcance y coexistencia. |
| [MCP latest](https://modelcontextprotocol.io/specification/latest) | Redirige a **2026-07-28** | Revisión vigente de MCP, frente a la referencia anterior 2025-11-25. |
| [MCP: transportes](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports) | Revisión 2026-07-28 | JSON-RPC, stdio y Streamable HTTP. |
| [DevTools: WebMCP](https://developer.chrome.com/docs/devtools/application/webmcp) | Consultada 29 octubre 2026 | Panel Application, herramientas disponibles e invocadas. |

## Matriz de API, código y alcance

Las rutas de esta tabla son relativas a la raíz del repositorio. «Expuesto por el demo» describe la página productora de herramientas. «Documentado» no significa que TacoAgent implemente un agente consumidor ni que esa capacidad se haya probado en todos los clientes.

| Código o contrato | Ruta y uso local | Estado | Evidencia primaria y límite |
| --- | --- | --- | --- |
| `document.modelContext` | `lib/webmcp.ts`: `getModelContext()` | Usado | [Guía moderna](https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools): detección sobre `document`; `navigator.modelContext` deprecado en Chromium 150. |
| `registerTool(tool, options)` | `lib/webmcp.ts`: `ToolRegistry`; `app/page.tsx`: `makeTools` | Expuesto por el demo | [Borrador §4.2](https://webmachinelearning.github.io/webmcp/#modelcontext): definición con nombre, descripción, esquema y callback. Registro asíncrono atendido por la cola local. |
| `{ signal }` de registro | `lib/webmcp.ts`: un `AbortController` por herramienta | Usado | [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api): `abort()` retira el registro; desde Chrome 153 las ejecuciones activas sobreviven a la retirada. |
| `execute(input, { signal })` | `lib/webmcp.ts`: `createToolCallback` comprueba `throwIfAborted()` antes de la acción síncrona | Usado; no hay red larga que cancelar | [Borrador §4.2.2](https://webmachinelearning.github.io/webmcp/#dictdef-toolexecutecallbackoptions): señal de ejecución distinta de la señal de registro. Para `fetch` o tareas largas debe propagarse. |
| `getTools()` | No se llama desde el adaptador productor | Disponible en API actual | [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api): lista autorizada del contexto; no es un catálogo global de webs. |
| `executeTool(descriptor, args, { signal })` | Lo usa un consumidor compatible o una prueba externa | Disponible en API actual | [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api): argumentos objeto; resultado o `null` con navegación. Argumentos JSON como string deprecados desde Chrome 155. |
| `toolchange` | El panel local deriva del estado; no escucha este evento nativo | Documentado | [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api): evento sobre `document.modelContext` al cambiar la lista. El contador local y descubrimiento nativo se distinguen. |
| `exposedTo`, `fromOrigins`, `allow="tools"` | TacoAgent no integra frames de otros orígenes | Fuera del recorrido | [Borrador §4.2–4.4](https://webmachinelearning.github.io/webmcp/): exposición y consulta explícitas; registrar en iframe cruzado exige delegación. No equivalen a autorización de negocio. |
| `toolname`, `tooldescription` | `app/page.tsx`: formulario `searchRestaurants` | Usado | [API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api): el navegador deriva una herramienta del formulario; quitar un atributo requerido retira el registro. |
| `toolautosubmit` | Formulario de búsqueda | Usado | [API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api): permite el envío por invocación del agente. No sustituye consentimiento de compras u otras acciones. |
| `SubmitEvent.agentInvoked`, `respondWith(Promise)` | `app/page.tsx`: `onSearch` | Usado | [API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api): primero `preventDefault()`; el resultado serializado vuelve al consumidor. El envío manual conserva su ruta UI. |
| `toolactivated`, `toolcancel`, `toolName` | Ejemplo de la charla; no controlan pedidos en TacoAgent | Documentado | [API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api): target `document.modelContext`; eventos no cancelables. En formularios se activan tras rellenar y se cancelan por cancelación/reset. `window.on…` no soportado desde Chrome 156. |
| `:tool-form-active`, `:tool-submit-active` | Ejemplo CSS de la charla | Documentado | [API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api): formulario y submit durante la interacción, hasta envío/cancelación/reset. Mantener foco visible. |
| `annotations` | `app/page.tsx`: `makeTools` | Usadas como hints | [Seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools): `readOnlyHint`, `consequentialHint`, `untrustedContentHint` orientan al cliente; no fuerzan validación, permisos ni revisión. |
| `readOnlyHint` | Verdadero sólo para `viewCart` | Coherente con lectura pura | [Skill upstream](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md): abrir un menú cambia UI y no es una consulta pura. |
| `consequentialHint` y checkout | `checkout` sólo abre revisión; `confirmOrder` es UI | Handoff ficticio | [Seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools): anotar acciones reales significativas. Este demo no cobra ni envía; no registra confirmación como herramienta. |
| `inputSchema` y validación | `app/page.tsx`: esquemas; `lib/demo-state.ts`: forma y reglas de negocio | Dos responsabilidades | [Borrador §3](https://webmachinelearning.github.io/webmcp/): discusión abierta de validación. El store rechaza null, arrays, primitivas y extras; comprueba IDs, disponibilidad y cantidad entera 1–10. |
| Errores del negocio | `lib/demo-state.ts`: `{ success: false, message }` | Resultado estructurado | [Guía moderna](https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools): mensajes de excepciones no se reenvían como explicación útil; devolver errores accionables. La forma del payload la define la app. |
| Contexto seguro y detección | `lib/webmcp.ts`: comprueba existencia de `registerTool` | Usado | [Guía moderna](https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools): API de contexto seguro. Usar HTTPS o localhost para desarrollo y comprobar soporte real. |
| Registro condicional | `lib/demo-state.ts`: `toolNames`; `lib/webmcp.ts`: cola/abort | Usado | [Diseñar por estado](https://developer.chrome.com/docs/ai/webmcp/build-tools): exponer capacidades útiles en el estado actual y validar igualmente al ejecutar. |
| TypeScript upstream | `lib/webmcp.ts` conserva un contrato local mínimo | Recurso de la charla | [webmcp-types](https://github.com/webmachinelearning/webmcp-types): declaraciones e inferencia desde esquema; no polyfill ni soporte de ejecución. No se afirma que el paquete esté instalado. |

Los callbacks del demo y los botones de UI comparten `DemoStore`; el «Ensayo guiado» es ejecución local identificada sin IA. La evidencia de navegador registrada durante este trabajo cubre búsqueda declarativa, menú, agotado, agregado y revisión. No demuestra selección autónoma universal por cualquier modelo. Las pruebas del store y del registro comprueban reglas del demo, no la conformidad de toda la plataforma.

## Ejemplos actuales de eventos y foco

Los dos bloques son ejemplos didácticos para un navegador compatible, no código que deba copiarse a ciegas sobre un cliente sin API.

```js
if (document.modelContext) {
  document.modelContext.addEventListener('toolactivated', ({ toolName }) => {
    console.log('Herramienta activada:', toolName)
  })
  document.modelContext.addEventListener('toolcancel', ({ toolName }) => {
    console.log('Operación cancelada:', toolName)
  })
}
```

```css
form:tool-form-active { outline: 3px dashed #174ea6; }
button[type="submit"]:tool-submit-active { outline: 3px solid #137333; }
```

## Versiones y afirmaciones que se corrigieron

| Afirmación previa | Redacción comprobada para la charla |
| --- | --- |
| «Ya es un estándar W3C» | Propuesta de estándar web; **Draft Community Group Report, 27 octubre 2026**, sin condición de W3C Standard ni Standards Track. [Estado publicado](https://webmachinelearning.github.io/webmcp/). |
| «navigator.modelContext actual» | Usar `document.modelContext`; Chromium 150 deprecó la ruta anterior. `unregisterTool`, `provideContext` y `clearContext` ya no están soportados según la [guía moderna](https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools). |
| «abort siempre cancela lo que corre» | La señal del registro retira disponibilidad; la señal de ejecución gestiona cancelación. Son ciclos diferentes. [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api). |
| «No funciona headless / requiere pestaña visible» | El diseño principal es un flujo local con persona; puede existir ejecución headless. No se inventa una prohibición general. [Limitaciones oficiales](https://developer.chrome.com/docs/ai/webmcp). |
| «No hay discovery» | Existe descubrimiento autorizado mediante API; el cliente debe visitar el sitio para conocer sus herramientas. [Introducción](https://developer.chrome.com/docs/ai/webmcp). |
| «Hereda autenticación: ya está autorizado» | Se ejecuta en contexto de la página; la aplicación conserva autenticación, autorización y revisión. [Seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools). |
| «Es MCP en JavaScript» | API inspirada en MCP, con alcance distinto; pueden coexistir. [Comparación oficial](https://developer.chrome.com/docs/ai/webmcp/compare-mcp). |
| «MCP exige siempre initialize y sesión persistente» | No describir revisiones viejas como actuales. MCP **2026-07-28** documenta metadatos por petición y compatibilidad con revisiones anteriores. Mantener la comparación en JSON-RPC/servicios/transportes. [Transportes vigentes](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports). |
| «Gemini in Chrome ya consume todas las herramientas» | I/O anunció soporte futuro; no es prueba de disponibilidad actual. Las extensiones de ejemplo son distintas de Gemini in Chrome. [I/O](https://developer.chrome.com/blog/chrome-at-io26?hl=en), [introducción actual](https://developer.chrome.com/docs/ai/webmcp). |
| «Reporting fuera de banda ya disponible» | Propuesta del autor para cerrar puntos ciegos; no se agrega una API imaginaria al demo. [Artículo original](https://bandarra.me/posts/webmcp-feedback-loop). |

## Probar hoy y alcance del material social

Primero detectar `document.modelContext` en el navegador de la demo. Si falta, seguir la [configuración local oficial](https://developer.chrome.com/docs/ai/webmcp): flag `chrome://flags/#enable-webmcp-testing`, habilitar y relanzar cuando corresponda. El origin trial comenzó en Chrome 149; eso no garantiza que cualquier instalación o cliente tenga todas las extensiones de API. [Estado de implementación](https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md).

En [DevTools → Application → WebMCP](https://developer.chrome.com/docs/devtools/application/webmcp) se inspeccionan herramientas, argumentos, resultados e historial y se ejecutan pruebas manuales. Después hay que evaluar selección por el agente y completar el flujo de usuario, incluida revisión. Types, Skill, flags y extensiones cumplen funciones diferentes.

Los nueve enlaces de X se reintentaron directamente: **seis 403 y tres Cache miss**; búsquedas de los nueve IDs no recuperaron contenido primario. Un resultado secundario menciona el primer ID, pero no se usa para atribuirle texto. Los temas se contrastan en repositorios oficiales, documentación y webs de sus autores. El [mapa de cobertura](fuentes-y-cobertura.md) enumera cada enlace y las tres publicaciones de LinkedIn, identifica el texto que aportó el usuario y enlaza el artículo primario de feedback. El enlace corto de LinkedIn continúa sin resolver. No se afirma haber leído vídeos o publicaciones inaccesibles.
