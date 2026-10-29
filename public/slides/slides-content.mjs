export const slides = [
  {
    id: 1, type: 'title', title: 'WebMCP', color: 'dark',
    subtitle: 'Prepara tu webapp para los agentes de nuestro día a día\nAileen Villanueva',
    notes: '0:00–1:00. Hoy veremos cómo una web ofrece acciones estructuradas a un agente. Usaremos TacoAgent, una app ficticia de pedidos. Duración: 30 minutos, con 23 minutos de explicación y 7 de demo. No se realizan cobros ni pedidos reales. Base de esta charla: mi repositorio previo, actualizado el 29 octubre 2026.',
    sources: ['https://github.com/aileenvl/webmcp-presentation', 'https://webmachinelearning.github.io/webmcp/']
  },
  {
    id: 2, type: 'content', title: 'La interacción con una web', color: 'dark',
    content: ['La persona pide: «Agrega dos órdenes de tacos»', 'La interfaz ofrece menús, formularios y botones', 'WebMCP permite declarar una acción: addToCart', 'El sitio valida los datos y actualiza el mismo carrito'],
    notes: '1:00–3:00. Explicar el problema sin prometer que toda automatización visual desaparece. Los agentes todavía pueden necesitar navegar y usar la UI. WebMCP añade un contrato explícito para las operaciones que la aplicación decide ofrecer. La lógica de negocio debe ser la misma que usa una persona. Preguntar al público qué pasos esperan que el agente confirme.',
    sources: ['https://developer.chrome.com/docs/ai/webmcp']
  },
  {
    id: 3, type: 'content', title: 'Qué expone WebMCP', color: 'dark',
    content: ['Nombre y descripción de cada herramienta', 'Esquema de entrada y función que ejecuta la acción', 'Resultados estructurados para continuar el flujo', 'El navegador conecta al agente con el documento', 'Estado actual: borrador de Community Group, API en evolución'],
    notes: '3:00–5:00. Arquitectura: agente, navegador y documento activo. Las funciones viven en la página y comparten su estado. Esto no concede permisos nuevos: las reglas del backend siguen aplicando. La especificación del 27 octubre 2026 es un Draft Community Group Report, no una recomendación W3C. No prometer compatibilidad universal ni ahorros de tokens medidos.',
    sources: ['https://webmachinelearning.github.io/webmcp/', 'https://developer.chrome.com/docs/ai/webmcp/imperative-api']
  },
  {
    id: 4, type: 'comparison', title: 'MCP y WebMCP', color: 'dark',
    leftContent: ['MCP', '• Conecta clientes con servidores de herramientas', '• Integra datos y servicios', '• Transporte y autenticación dependen de la integración'],
    rightContent: ['WebMCP', '• Expone capacidades desde el documento web', '• Trabaja con el estado de la página abierta', '• El navegador media la interacción con el agente'],
    notes: '5:00–6:30. Son complementarios. Evitar describir MCP como exclusivamente server-to-server o exigir un backend remoto. WebMCP no crea automáticamente un servidor MCP de red. Compartir estado de la página no evita la autorización. Usar como ejemplo un servidor MCP de catálogo y herramientas WebMCP para manipular el carrito abierto.',
    sources: ['https://modelcontextprotocol.io/specification/2025-11-25', 'https://webmachinelearning.github.io/webmcp/']
  },
  {
    id: 5, type: 'comparison', title: 'Dos APIs complementarias', color: 'dark',
    leftContent: ['Declarativa: HTML', '• Convierte formularios en herramientas', '• Usa toolname y tooldescription', '• Búsqueda y captura de datos'],
    rightContent: ['Imperativa: JavaScript', '• Declara esquemas y callbacks', '• Usa document.modelContext', '• Registra según el estado de la app'],
    notes: '6:30–8:00. Se pueden combinar. TacoAgent usa búsqueda declarativa y carrito imperativo. Actualización importante de la charla previa: la API vigente usa document.modelContext. navigator.modelContext quedó deprecada en Chromium 150. Detectar soporte antes de registrar y conservar la UI manual.',
    sources: ['https://developer.chrome.com/docs/ai/webmcp/declarative-api', 'https://developer.chrome.com/docs/ai/webmcp/imperative-api']
  },
  {
    id: 6, type: 'code', title: 'Una herramienta declarativa', color: 'dark',
    code: `<form toolname="searchRestaurants"
  tooldescription="Busca restaurantes por cocina">
  <label for="cuisine">Tipo de cocina</label>
  <input id="cuisine" name="cuisine"
    toolparamdescription="Ejemplo: mexicana"
    required>
  <button type="submit">Buscar</button>
</form>`,
    codeLanguage: 'HTML · sin toolautosubmit, la persona envía el formulario',
    notes: '8:00–10:00. El navegador deriva parámetros de los campos. El handler de submit conserva su función. Sin toolautosubmit el agente prepara valores y una persona envía. Con toolautosubmit el agente puede enviar. Esa decisión debe corresponder al riesgo. Este fragmento es didáctico: el formulario real puede incluir más filtros. Mostrar en código dónde se valida el formulario.',
    sources: ['https://developer.chrome.com/docs/ai/webmcp/declarative-api']
  },
  {
    id: 7, type: 'code', title: 'Una herramienta imperativa', color: 'dark',
    code: `if (document.modelContext) {
  await document.modelContext.registerTool({
    name: "viewCart",
    description: "Consulta productos y total del carrito",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => getCartSnapshot()
  });
}`,
    codeLanguage: 'JavaScript · getCartSnapshot lee el estado de la app',
    notes: '10:00–12:00. Desglosar nombre, descripción, schema, annotation y execute. getCartSnapshot representa un helper de negocio. readOnlyHint comunica intención, no impide mutaciones por sí mismo. Los errores deben ser claros y recuperables. El schema ayuda al agente, pero la función también valida valores y permisos. La UI debe reflejar el resultado antes de que el agente continúe.',
    sources: ['https://developer.chrome.com/docs/ai/webmcp/imperative-api', 'https://developer.chrome.com/docs/ai/webmcp/secure-tools']
  },
  {
    id: 8, type: 'code', title: 'Herramientas según el estado', color: 'dark',
    code: `// Solo mientras el carrito permita esta operación
const lifetime = new AbortController();
await document.modelContext.registerTool(
  checkoutTool,
  { signal: lifetime.signal }
);

// Al vaciar el carrito o salir del flujo
lifetime.abort();`,
    codeLanguage: 'JavaScript · AbortSignal controla la disponibilidad',
    notes: '12:00–14:00. No registrar cincuenta acciones al cargar si todavía no tienen sentido. Menú abierto: addToCart disponible. Carrito vacío: checkout no disponible. AbortSignal retira la herramienta al cambiar de estado. Revalidar precondiciones al ejecutar. Coordinar llamadas en curso antes de desmontar recursos. La especificación actual retira con abort, no con unregisterTool. Ejemplos del texto aportado por el usuario: Aisle habilita finalize_chart cuando todos están sentados, Alza ofrece extend_selected_wall con una pared seleccionada y Roque Nights espera llamadas activas.',
    sources: ['https://developer.chrome.com/docs/ai/webmcp/imperative-api', 'https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools', 'https://www.linkedin.com/feed/update/urn:li:activity:7520892911392030720/']
  },
  {
    id: 9, type: 'content', title: 'Seguridad en cada acción', color: 'dark',
    content: ['Validar cantidad, stock y estado dentro de execute', 'Mantener autenticación y autorización en el backend', 'Tratar contenido externo como datos no confiables', 'Pedir revisión humana para acciones con consecuencias', 'Las annotations describen intención, el código aplica las reglas'],
    notes: '14:00–16:00. Parámetros y resultados externos son datos no confiables. readOnlyHint, untrustedContentHint y consequentialHint son señales. Una revisión de pedido debe mostrar productos, total y destino. El agente no debe poder autoaprobar ese paso. TacoAgent simula pedidos y no representa seguridad de un backend de producción. Usar datos ficticios en la demo. Preguntar: ¿qué acciones de sus productos necesitan revisión?',
    sources: ['https://developer.chrome.com/docs/ai/webmcp/secure-tools']
  },
  {
    id: 10, type: 'code', title: 'Types y Skill para desarrollar', color: 'dark',
    code: `npm install --save-dev webmcp-types

// tsconfig.json
{
  "compilerOptions": {
    "types": ["webmcp-types"]
  }
}`,
    codeLanguage: 'TypeScript 5+ · inferencia desde inputSchema',
    notes: '16:00–17:30. webmcp-types pertenece a Web Machine Learning. Si compilerOptions.types ya tiene entradas, añadir sin borrar. La inferencia desde inputSchema ayuda con los argumentos de execute. GoogleChromeLabs publica la Skill build-webmcp-tools con prácticas de desarrollo y seguridad. Tipos y Skill ayudan a implementar, pero no añaden soporte al navegador. Alinear versión de tipos y API probada.',
    sources: ['https://github.com/webmachinelearning/webmcp-types', 'https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md']
  },
  {
    id: 11, type: 'content', title: 'El feedback después del lanzamiento', color: 'dark',
    content: ['Registrar herramienta, resultado, latencia y error recuperable', 'Observar dónde se corta un flujo de varios pasos', 'Evitar datos personales en los registros', 'El reporte fuera del flujo del agente es una propuesta', 'Hoy podemos instrumentar nuestras propias funciones'],
    notes: '17:30–19:00. André Bandarra señala un punto ciego: un agente que falla no necesariamente deja un ticket. Su artículo propone reporting out-of-band inspirado en Reporting API y telemetría agregada. No es una API WebMCP estandarizada o disponible que podamos activar hoy. Una herramienta in-band fileSupportTicket introduce permisos y no captura todos los abandonos. Nuestra app sí puede registrar sus invocaciones con minimización de datos.',
    sources: ['https://bandarra.me/posts/webmcp-feedback-loop', 'https://www.linkedin.com/feed/update/urn:li:activity:7508545474149142528/']
  },
  {
    id: 12, type: 'content', title: 'Preparación del demo', color: 'dark',
    content: ['Chrome compatible y soporte WebMCP habilitado', 'Desarrollo local: chrome://flags/#enable-webmcp-testing', 'Reiniciar y comprobar document.modelContext', 'Instalar WebMCP Model Context Tool Inspector', 'Sin API nativa: recorrido manual de respaldo'],
    notes: '19:00–20:30. El origin trial comenzó en Chrome 149. La disponibilidad depende del canal, flag, token del sitio y cliente agente. Para local habilitar flag, reiniciar y usar localhost o HTTPS. Comprobar document.modelContext en la sesión concreta. El Inspector permite inspeccionar e invocar herramientas. Una llamada manual del Inspector prueba integración, no demuestra por sí sola un agente autónomo o un LLM. Identificar el respaldo manual claramente.',
    sources: ['https://developer.chrome.com/docs/ai/webmcp', 'https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd']
  },
  {
    id: 13, type: 'demo', title: 'Demo: TacoAgent', color: 'dark',
    content: ['1. Buscar restaurantes de comida mexicana', '2. Consultar menú y agregar dos órdenes de tacos', '3. Probar una cantidad inválida y leer el error', '4. Observar las herramientas según menú y carrito', '5. Revisar y confirmar un pedido simulado'],
    notes: '20:30–21:30 presentar el recorrido. Demo de 21:30 a 28:30: UI humana primero, Inspector después. searchRestaurants: cocina mexicana. getRestaurantInfo: copiar un ID real. addToCart: copiar IDs reales, quantity 2. Probar quantity 0 para error. viewCart: confirmar total y UI. Observar clearCart/checkout según estado. Checkout debe abrir revisión y dejar la confirmación final a la persona. Si falla el soporte nativo, usar los controles manuales y explicar su correspondencia con las herramientas. No describir el respaldo como un agente conectado.',
    sources: ['https://github.com/aileenvl/webmcp-demo']
  },
  {
    id: 14, type: 'content', title: 'Recursos para continuar', color: 'dark',
    content: ['Contrato claro: nombre, schema, validación y resultado', 'Disponibilidad que refleje el estado real de la app', 'Control humano y feedback para mejorar el flujo', 'Docs: developer.chrome.com/docs/ai/webmcp', 'Código: github.com/aileenvl/webmcp-demo'],
    notes: '28:30–30:00. Cierre y preguntas. Empezar por una búsqueda de solo lectura y comprobar el ciclo completo. Tres decisiones: contrato explícito, herramientas disponibles cuando corresponde, reglas aplicadas en código con revisión humana. Contacto: https://www.linkedin.com/in/aileen-villanueva-31155666/ y https://twitter.com/aileenvl. La Skill, los tipos y la spec están en las fuentes. Los enlaces X del usuario no fueron accesibles, por lo que no atribuimos afirmaciones a esos posts.',
    sources: ['https://developer.chrome.com/docs/ai/webmcp', 'https://webmachinelearning.github.io/webmcp/', 'https://github.com/webmachinelearning/webmcp-types', 'https://github.com/GoogleChromeLabs/webmcp-tools', 'https://github.com/aileenvl/webmcp-demo']
  }
]
