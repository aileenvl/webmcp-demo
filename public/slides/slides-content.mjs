export const slides = [
  {
    "id": 1,
    "type": "title",
    "title": "WebMCP",
    "subtitle": "Prepara tu webapp para los agentes de nuestro día a día\nAileen Villanueva",
    "color": "dark",
    "caption": "Una charla con ejemplos actuales y un demo de agenda",
    "notes": "0:00–0:30. Hoy recorreremos cinco partes: por qué nace WebMCP, qué es, para qué se usa, cómo difiere de MCP y el estado de la propuesta de estándar junto con cómo empezar a usarlo hoy. Primero veremos una misma reserva con dos formas de controlarla. Después iremos al código y terminaremos con una agenda real del demo: la aplicación valida horarios y una persona confirma. La presentación está actualizada al 29 de octubre de 2026. El plan para 30 minutos es unos 17 de explicación, 10–12 de taller central y 1–3 de cierre. Son estimaciones para ensayar, no una duración humana cronometrada.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp"
    ]
  },
  {
    "id": 2,
    "type": "content",
    "title": "Por qué nace WebMCP",
    "color": "dark",
    "content": [
      "La persona pide: «Agrega esta charla a mi agenda»",
      "El agente debe entender qué acciones ofrece la página y con qué datos",
      "Una UI puede exigir interpretar el DOM, el árbol de accesibilidad o capturas",
      "WebMCP propone un contrato explícito para las acciones que el sitio permite"
    ],
    "caption": "La UI sigue disponible para la persona",
    "notes": "0:30–1:10. La petición humana es sencilla, pero un agente necesita traducirla a acciones de la aplicación. Si el sitio sólo ofrece una interfaz visual, tiene que interpretar el DOM, el árbol de accesibilidad o capturas de la página, encontrar controles y comprobar qué cambió. Esas técnicas siguen siendo útiles. WebMCP nace para que el sitio también pueda explicar directamente sus capacidades: qué acción existe, qué argumentos acepta y qué devuelve. El contrato complementa una buena UI y la accesibilidad.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp",
      "https://webmachinelearning.github.io/webmcp/"
    ]
  },
  {
    "id": 3,
    "type": "comparison",
    "title": "Sarah: misma reserva, dos rutas",
    "color": "dark",
    "leftContent": [
      "Interpretar la interfaz",
      "• El mismo widget de reserva",
      "• DOM, atributos y controles para interpretar",
      "• La demo muestra unos 40+ nodos"
    ],
    "rightContent": [
      "Llamar herramientas",
      "• El mismo objetivo y los mismos datos",
      "• Tres herramientas declaradas por el sitio",
      "• Argumentos y resultados explícitos"
    ],
    "caption": "Sarah Drasner · Ejemplo didáctico, no un benchmark de rendimiento",
    "notes": "1:10–2:00. Sarah Drasner muestra una misma reserva con dos rutas de control. Una interpreta la interfaz y otra llama tres herramientas declaradas por la página. La comparación ayuda a explicar dónde vive el contrato de acciones. Los nodos y tools pertenecen a ese ejemplo didáctico. No son un benchmark ni permiten prometer una mejora universal.",
    "sources": [
      "https://webmcp-demo-sdras.netlify.app/",
      "https://github.com/sdras/webmcp-demo"
    ]
  },
  {
    "id": 4,
    "type": "content",
    "title": "La UI y el contrato de acciones",
    "color": "dark",
    "content": [
      "La UI muestra el catálogo, la selección y el resultado",
      "El contrato nombra una acción del producto: agregar_sesion",
      "El esquema describe entradas; la aplicación valida las reglas",
      "La respuesta y el estado visible deben contar la misma historia"
    ],
    "caption": "Una herramienta útil expresa una acción, no una secuencia de clics",
    "notes": "2:00–2:40. Una interfaz explica el producto a las personas. El contrato de herramientas añade otra forma de operar ese producto. En la agenda, agregar_sesion significa añadir una sesión conocida al borrador. No significa buscar un botón y hacer clic. Esa acción tiene reglas que ya pertenecen a la app: no duplicar, no cruzar horarios y no modificar una agenda finalizada. El callback debe reutilizar esa lógica. Si devuelve ADDED, la sesión también debe verse en la agenda.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/build-tools"
    ]
  },
  {
    "id": 5,
    "type": "content",
    "title": "Qué es WebMCP",
    "color": "dark",
    "content": [
      "Una propuesta de API web para exponer herramientas desde un documento",
      "Cada herramienta declara nombre, propósito, entradas y ejecución",
      "Un cliente compatible descubre capacidades y envía argumentos",
      "La función de la página ejecuta la acción y devuelve un resultado"
    ],
    "caption": "Publicar herramientas no añade un modelo ni crea un chatbot",
    "notes": "2:40–3:20. WebMCP permite que una página exponga funciones a clientes compatibles a través del navegador. El desarrollador decide qué capacidades publicar. Una herramienta tiene un nombre claro, una descripción, un esquema de entrada y una implementación. El modelo o cliente que consume esas capacidades vive fuera de ese contrato: instalar tipos o registrar una función no añade automáticamente un LLM a la app. La página conserva el control de su lógica y la persona conserva su interfaz.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp",
      "https://webmachinelearning.github.io/webmcp/"
    ]
  },
  {
    "id": 6,
    "type": "stats",
    "title": "Quién hace qué",
    "color": "dark",
    "stats": [
      {
        "icon": "code",
        "label": "La página declara",
        "description": "Registra capacidades y aplica las reglas de la aplicación."
      },
      {
        "icon": "chrome",
        "label": "El navegador media",
        "description": "Expone herramientas en el contexto del documento."
      },
      {
        "icon": "bot",
        "label": "El cliente elige",
        "description": "Decide qué herramienta invocar y con qué argumentos."
      }
    ],
    "caption": "La persona expresa el objetivo y revisa las acciones que lo requieren",
    "notes": "3:20–4:00. La página registra las acciones que sabe ejecutar. El navegador las hace accesibles dentro del contexto del documento. Un cliente o agente compatible las descubre y elige una llamada. Cuando llega la llamada, la aplicación debe validar argumentos, usuario y estado. Al terminar, comunica un resultado y actualiza la UI. Si la acción requiere revisión, la persona debe poder ver y aprobar el efecto concreto. Estos papeles son distintos: una herramienta disponible no equivale a una acción autorizada.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/compare-mcp",
      "https://developer.chrome.com/docs/ai/webmcp/secure-tools"
    ]
  },
  {
    "id": 7,
    "type": "comparison",
    "title": "Dos formas de declarar herramientas",
    "color": "dark",
    "leftContent": [
      "Declarativa: HTML",
      "• Parte de un formulario existente",
      "• toolname y tooldescription describen la acción",
      "• Los campos definen los parámetros"
    ],
    "rightContent": [
      "Imperativa: JavaScript",
      "• Registra funciones con document.modelContext",
      "• Define inputSchema y execute",
      "• Puede cambiar con el estado de la página"
    ],
    "caption": "Las APIs son complementarias. Nuestro demo de agenda usa la imperativa.",
    "notes": "4:00–4:40. La API declarativa encaja cuando ya existe un formulario que expresa la acción. HTML aporta el nombre de la herramienta y los campos que el navegador convierte en parámetros. La API imperativa permite declarar funciones en JavaScript y decidir cuándo deben existir. Podemos combinar ambas dentro del mismo producto. La agenda que veremos utiliza sólo la imperativa para que se vea con claridad cómo el registro sigue la selección y cómo UI y herramientas comparten la lógica.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/declarative-api",
      "https://developer.chrome.com/docs/ai/webmcp/imperative-api"
    ]
  },
  {
    "id": 8,
    "type": "bento",
    "title": "Para qué se usa",
    "color": "dark",
    "stats": [
      {
        "icon": "shopping-cart",
        "label": "Comercio",
        "description": "Consultar productos y preparar un carrito para revisión."
      },
      {
        "icon": "calendar",
        "label": "Agendas y reservas",
        "description": "Listar opciones y comprobar horarios antes de confirmar."
      },
      {
        "icon": "settings",
        "label": "Aplicaciones de trabajo",
        "description": "Aplicar filtros y preparar cambios de configuración."
      },
      {
        "icon": "puzzle",
        "label": "Herramientas creativas",
        "description": "Ofrecer acciones sobre el elemento seleccionado."
      }
    ],
    "caption": "Elegir capacidades del producto con entradas y resultados comprobables",
    "notes": "4:40–5:20. Los mejores primeros casos suelen ser acciones que la aplicación ya puede ejecutar de forma clara. Una búsqueda, una selección o un borrador tienen entradas y resultados fáciles de verificar. En comercio podemos descubrir productos y preparar un carrito. En una agenda podemos detectar cruces de horario. Una herramienta de diseño puede editar sólo el elemento seleccionado. El objetivo no es exponer cada función interna: es ofrecer capacidades útiles que representen lo que una persona quiere conseguir.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp"
    ]
  },
  {
    "id": 9,
    "type": "content",
    "title": "Herramientas según el estado",
    "color": "dark",
    "content": [
      "Aisle: finalize_chart sólo cuando todos están sentados y no hay violaciones",
      "Alza: extend_selected_wall sólo mientras hay una pared seleccionada",
      "Roque Nights: espera a las llamadas activas antes de retirar herramientas",
      "La disponibilidad refleja el trabajo que la UI permite en ese momento"
    ],
    "caption": "Ejemplos del WebMCP Hackathon descritos por André Bandarra",
    "notes": "5:20–6:10. En el texto compartido por André Bandarra aparecen tres ejemplos concretos. Aisle habilita la finalización del plano de mesas cuando todos los invitados tienen asiento y las reglas se cumplen. Alza publica la operación de extender una pared cuando hay exactamente una pared seleccionada. Roque Nights coordina la retirada con las llamadas que siguen activas. La idea común es evitar un catálogo lleno de acciones que todavía no tienen sentido. La función debe volver a validar el estado cuando la invocan.",
    "sources": [
      "https://www.linkedin.com/feed/update/urn:li:activity:7520892911392030720/",
      "https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools"
    ]
  },
  {
    "id": 10,
    "type": "bento",
    "title": "PayPal: resultados de un sandbox",
    "color": "dark",
    "stats": [
      {
        "icon": "cpu",
        "label": "≈ 4.6×",
        "description": "Menor costo en uso de inferencia de modelos."
      },
      {
        "icon": "clock",
        "label": "≈ 2×",
        "description": "Checkout más rápido en la mediana."
      },
      {
        "icon": "code",
        "label": "3 frente a 30+",
        "description": "Llamadas estructuradas frente a pasos de interacción con la UI."
      },
      {
        "icon": "user-check",
        "label": "El comprador aprueba",
        "description": "PayPal conserva la revisión y la autorización del pago."
      }
    ],
    "caption": "PayPal, 16 sep 2026 · Benchmark interno pequeño en una tienda sandbox. Los resultados varían.",
    "notes": "6:10–7:10. PayPal comparó la compra de una tarjeta de regalo en una tienda de ensayo y reportó las cifras de esta slide. Son resultados direccionales de un sandbox pequeño que varían con tienda, catálogo y asistente. Las herramientas preparan la compra. La persona revisa y aprueba el pago dentro de PayPal.",
    "sources": [
      "https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/"
    ]
  },
  {
    "id": 11,
    "type": "comparison",
    "title": "Cómo difiere de MCP",
    "color": "dark",
    "leftContent": [
      "MCP",
      "• Protocolo entre clientes y servidores locales o remotos",
      "• Expone herramientas, recursos y otros servicios",
      "• No requiere una página abierta"
    ],
    "rightContent": [
      "WebMCP",
      "• APIs del navegador para capacidades de una página",
      "• Herramientas ligadas al documento y su estado",
      "• Comparte el contexto de la web activa"
    ],
    "caption": "Contextos distintos. Compartir contexto no elimina la autorización.",
    "notes": "7:10–8:10. MCP conecta aplicaciones cliente con servidores que pueden ejecutarse localmente o en otro lugar. WebMCP se centra en las capacidades que una página ofrece desde su documento. Una herramienta puede depender del proyecto abierto, la selección o el borrador que una persona tiene en pantalla. Esa diferencia de contexto explica muchos de sus casos de uso. No hace falta presentar MCP como exclusivamente backend ni pensar que WebMCP es un servidor de red. Tampoco basta compartir sesión para autorizar cualquier operación.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/compare-mcp",
      "https://modelcontextprotocol.io/specification/2025-11-25"
    ]
  },
  {
    "id": 12,
    "type": "content",
    "title": "MCP y WebMCP pueden convivir",
    "color": "dark",
    "content": [
      "Un servidor MCP puede ofrecer datos o servicios a varios clientes",
      "WebMCP puede operar la selección y el borrador de la página abierta",
      "Ambos pueden reutilizar las mismas reglas y servicios de negocio",
      "La aplicación sigue validando. La persona revisa lo que tiene consecuencias."
    ],
    "caption": "El criterio es dónde vive la capacidad y qué contexto necesita",
    "notes": "8:10–8:50. Imaginemos un servicio de eventos usado por varias aplicaciones. Un servidor MCP podría ofrecer datos de ese servicio a distintos clientes. La página de una conferencia, en cambio, puede exponer la agenda que la persona está editando y la sesión que tiene seleccionada. Las dos integraciones pueden coexistir y apoyarse en el mismo backend. La decisión de arquitectura depende de dónde vive la capacidad y del contexto que necesita para ejecutarse correctamente.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/compare-mcp"
    ]
  },
  {
    "id": 13,
    "type": "content",
    "title": "La propuesta de estándar web, hoy",
    "color": "dark",
    "content": [
      "Especificación abierta en el Web Machine Learning Community Group",
      "Publicación actual del borrador: 27 de octubre de 2026",
      "Chrome ofrece implementación experimental y herramientas de desarrollo",
      "La API y su disponibilidad evolucionan según navegador y cliente"
    ],
    "caption": "Draft Community Group Report. No es un estándar W3C ni está en Standards Track.",
    "notes": "8:50–9:40. Cuando hablamos de WebMCP como una propuesta de estándar web, hablamos de un proceso abierto y de una API que sigue evolucionando. La publicación actual del Community Group es del 27 de octubre de 2026. Podemos probar implementaciones hoy y aportar feedback sin confundir ese estado con una recomendación W3C. El demo de referencia ya se comprobó con la API nativa en Chrome 156 en una sesión previa. Eso es evidencia de ese entorno, no una promesa de soporte universal ni una nueva prueba realizada para estas slides.",
    "sources": [
      "https://webmachinelearning.github.io/webmcp/",
      "https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md",
      "https://developer.chrome.com/docs/ai/webmcp"
    ]
  },
  {
    "id": 14,
    "type": "code",
    "title": "Empezar hoy: comprobar soporte",
    "color": "dark",
    "code": "Boolean(document.modelContext)\n\n// true: registra una herramienta y abre DevTools.\n// false: para desarrollo local, habilita\n// chrome://flags/#enable-webmcp-testing\n// y reinicia el navegador.",
    "codeLanguage": "Primero detectar. Configurar sólo si falta soporte.",
    "caption": "La guía de Chrome explica los requisitos del entorno",
    "notes": "9:40–10:20. El primer paso es comprobar la API en la pestaña que vamos a usar. No hay que reinstalar el navegador o activar flags si el soporte ya existe. Si document.modelContext está disponible, podemos registrar una herramienta y verla en DevTools. Si falta, seguimos la guía de desarrollo local: navegador compatible, flag cuando corresponda y reinicio. El sitio debe ejecutarse en un contexto adecuado, como localhost o HTTPS. Tipos y extensiones no sustituyen la implementación del navegador.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp"
    ]
  },
  {
    "id": 15,
    "type": "code",
    "title": "HTML: un formulario como herramienta",
    "color": "dark",
    "code": "<form toolname=\"buscar_sesiones\"\n  tooldescription=\"Busca sesiones por título\">\n  <label>Título\n    <input name=\"titulo\" required>\n  </label>\n  <button type=\"submit\">Buscar</button>\n</form>",
    "codeLanguage": "API declarativa · Ejemplo ilustrativo",
    "caption": "Sin toolautosubmit, la persona realiza el envío. La interfaz sigue visible.",
    "notes": "10:20–11:10. Este ejemplo ilustrativo toma un formulario de búsqueda y declara su propósito. El nombre de la herramienta describe la acción y el campo titulo define un parámetro requerido. Sin toolautosubmit, el agente puede preparar los datos y la persona realiza el envío. Si el desarrollador añade ese atributo, permite el envío automático del formulario. Conviene decidirlo según el efecto de la acción. El demo de agenda usa JavaScript; este formulario sirve para mostrar la otra ruta de integración.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/declarative-api"
    ]
  },
  {
    "id": 16,
    "type": "code",
    "title": "JavaScript: una herramienta de lectura",
    "color": "dark",
    "code": "await document.modelContext.registerTool({\n  name: \"listar_sesiones\",\n  description: \"Lee catálogo y agenda actual\",\n  inputSchema: { type: \"object\", properties: {} },\n  annotations: { readOnlyHint: true },\n  execute: async () => JSON.stringify({\n    code: \"STATE\", ...agenda.snapshot()\n  })\n});",
    "codeLanguage": "API imperativa · El callback reutiliza la lógica de la app",
    "caption": "El schema describe el contrato. El código valida y aplica las reglas.",
    "notes": "11:10–12:10. Una herramienta de lectura es un primer paso fácil de comprobar. listar_sesiones devuelve el catálogo, la agenda y su estado. El nombre y la descripción ayudan al cliente a elegirla. El esquema expresa los argumentos y execute reutiliza el objeto de negocio. El ejemplo es un extracto: la implementación del demo también valida que llegue un objeto vacío. readOnlyHint declara intención de lectura, pero la aplicación debe hacerla cumplir. El resultado STATE debe coincidir con lo que muestra la UI.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/imperative-api"
    ]
  },
  {
    "id": 17,
    "type": "code",
    "title": "Registro dinámico con AbortSignal",
    "color": "dark",
    "code": "const lifetime = new AbortController();\nawait document.modelContext.registerTool(\n  editarSesionSeleccionadaTool,\n  { signal: lifetime.signal }\n);\n\n// Cuando la selección deja de ser válida\nlifetime.abort();",
    "codeLanguage": "La herramienta contextual existe mientras tiene sentido",
    "caption": "En la agenda: 4 herramientas, luego 5 al seleccionar y 4 al limpiar.",
    "notes": "12:10–13:10. El registro acepta una señal que controla la vida de la herramienta. En la agenda hay cuatro herramientas base. Al seleccionar una sesión ya añadida aparece editar_sesion_seleccionada. Al limpiar la selección vuelve a haber cuatro. Hay que validar la selección dentro de execute aunque la herramienta estuviera disponible al iniciar la llamada. La señal de registro no cancela por sí misma ejecuciones ya activas. Si una operación sigue usando recursos, coordinamos su finalización antes de desmontarlos.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/imperative-api",
      "https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools"
    ]
  },
  {
    "id": 18,
    "type": "bento",
    "title": "Types, Skill y DevTools",
    "color": "dark",
    "stats": [
      {
        "icon": "type",
        "label": "Tipos TypeScript",
        "description": "npm i -D webmcp-types. Inferencia desde inputSchema."
      },
      {
        "icon": "book-open",
        "label": "Skill oficial",
        "description": "build-webmcp-tools: diseño, seguridad y flujos con consecuencias."
      },
      {
        "icon": "wrench",
        "label": "DevTools",
        "description": "Application > WebMCP: registro, entradas, resultados e invocaciones."
      },
      {
        "icon": "play",
        "label": "Probar y evaluar",
        "description": "Run tool prueba una llamada. Un agente compatible prueba la decisión."
      }
    ],
    "caption": "La extensión Inspector es opcional. Una invocación manual no prueba a un LLM.",
    "notes": "13:10–14:00. Los tipos oficiales se instalan con npm install --save-dev webmcp-types y ayudan a inferir los argumentos desde inputSchema. La Skill de GoogleChromeLabs reúne prácticas de desarrollo y seguridad para dárselas a un agente de programación. En Chrome DevTools abrimos Application y después WebMCP para ver el registro, los parámetros, resultados y llamadas. Podemos usar Run tool para probar la función sin esperar la decisión de un modelo. Evaluar si un agente elige bien es una prueba diferente. La extensión Inspector es una alternativa opcional.",
    "sources": [
      "https://github.com/webmachinelearning/webmcp-types",
      "https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md",
      "https://developer.chrome.com/docs/devtools/application/webmcp"
    ]
  },
  {
    "id": 19,
    "type": "bento",
    "title": "Seguridad en la aplicación",
    "color": "dark",
    "stats": [
      {
        "icon": "list-checks",
        "label": "Validación",
        "description": "Comprobar argumentos, IDs y estado en cada ejecución."
      },
      {
        "icon": "key",
        "label": "Autorización",
        "description": "Aplicar permisos en el backend cuando exista."
      },
      {
        "icon": "shield",
        "label": "Contenido no confiable",
        "description": "Tratar datos externos como datos, aunque lleguen de una herramienta."
      },
      {
        "icon": "user-check",
        "label": "Revisión humana",
        "description": "Preparar un resumen no confirma una agenda ni aprueba un pago."
      }
    ],
    "caption": "Las annotations comunican intención. El código aplica los controles.",
    "notes": "14:00–15:10. Un esquema claro ayuda a llamar bien la herramienta, pero el código debe validar las entradas y el estado actual. Los límites del navegador y los permisos de negocio son controles distintos. Si hay backend, debe autorizar las operaciones. Las anotaciones como readOnlyHint o untrustedContentHint comunican intención y tratamiento del contenido. No hacen cumplir esas reglas por sí solas. En la agenda, preparar_confirmacion sólo abre una revisión. La confirmación pertenece al botón de la persona y cualquier cambio invalida lo revisado.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/secure-tools"
    ]
  },
  {
    "id": 20,
    "type": "content",
    "title": "Feedback cuando un agente falla",
    "color": "dark",
    "content": [
      "Un agente puede fallar y dejar sólo una disculpa al usuario",
      "fileSupportTicket dentro del flujo puede añadir permisos y perder fallos",
      "Propuesta: reportes fuera del flujo del agente, inspirados en Reporting API",
      "Hoy: telemetría propia de herramientas, errores y abandonos"
    ],
    "caption": "André Bandarra · El reporting OOB todavía no es una API WebMCP estandarizada.",
    "notes": "15:10–17:00. André Bandarra describe un problema después del lanzamiento: las llamadas exitosas dejan señales, pero un agente que abandona puede no comunicar qué capacidad le faltó. Una herramienta como fileSupportTicket intenta resolverlo dentro del mismo flujo, con posibles permisos adicionales y puntos ciegos. Su artículo propone un canal fuera de ese flujo, inspirado en Reporting API. Esa propuesta no es una API WebMCP estandarizada que activemos hoy. Mientras tanto podemos observar nuestras funciones, errores y recorridos, minimizando datos sensibles.",
    "sources": [
      "https://bandarra.me/posts/webmcp-feedback-loop"
    ]
  },
  {
    "id": 21,
    "type": "demo",
    "title": "Taller: construir la agenda paso a paso",
    "color": "dark",
    "content": [
      "0 App normal: los botones ya funcionan, todavía sin tools",
      "1 Lectura: listar_sesiones devuelve STATE",
      "2 Mutación y 3 respuesta útil: ADDED, ALREADY_ADDED y TIME_CONFLICT",
      "4 Contexto: seleccionar habilita editar_sesion_seleccionada",
      "5 Revisión: CONFIRMATION_REQUIRED y confirmación desde la UI"
    ],
    "caption": "Taller central estimado: 10–12 minutos. Datos ficticios y locales. Inspector manual, sin LLM.",
    "notes": "17:00–28:00. El taller central recorre seis checkpoints y estima 10–12 minutos dentro de los 30 de la charla. En el paso 0 mostramos una app con botones y cero tools. En el paso 1 publicamos listar_sesiones y ejecutamos {} para leer STATE. El paso 2 agrega mutación y JSON Schema, pero devuelve «Listo.» deliberadamente: el estado se protege, la respuesta no explica el resultado. En el paso 3 conservamos la respuesta del dominio: ADDED, ALREADY_ADDED y TIME_CONFLICT con una alternativa. El paso 4 incorpora selección y edición contextual. El paso 5 prepara revisión y deja confirmar a la persona. En el checkpoint 5 y la app final se observan cuatro, cinco y cuatro tools al seleccionar y limpiar. Cada cambio de checkpoint recarga y reinicia datos. Esta es una inspección manual sin LLM, con llamadas nativas cuando la pantalla lo indica. Si no hay tiempo, la app final sirve para un recorrido compacto de 5–7 minutos. Estas duraciones son estimaciones para el ensayo.",
    "sources": [
      "http://127.0.0.1:3001/agenda/taller/index.html?paso=0",
      "http://127.0.0.1:3001/agenda/index.html"
    ],
    "demoUrl": "http://127.0.0.1:3001/agenda/taller/index.html?paso=0"
  },
  {
    "id": 22,
    "type": "content",
    "title": "El primer paso en tu web",
    "color": "dark",
    "content": [
      "Elegir una acción útil con un resultado que puedas comprobar",
      "Declarar el contrato y reutilizar las reglas de la aplicación",
      "Probar errores y estado visible; después evaluar con un agente",
      "Docs: developer.chrome.com/docs/ai/webmcp",
      "Taller guiado: /agenda/taller/index.html?paso=0"
    ],
    "caption": "La página declara. El cliente elige. La aplicación valida. La persona revisa.",
    "notes": "28:00–30:00. Para empezar no hace falta rehacer la web. Podemos elegir una acción de lectura o un borrador que tenga un resultado comprobable. Detectamos soporte, declaramos la herramienta y probamos entradas válidas, errores y cambios visibles. Después evaluamos las decisiones con un agente compatible. Ya vimos por qué nace WebMCP, qué es, dónde sirve, cómo convive con MCP y cuál es el estado de la propuesta. Las fuentes, tipos, Skill y DevTools están enlazados en esta presentación. Abrimos preguntas. El taller central ya mostró la construcción; la app final queda como respaldo para repetir el recorrido.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp",
      "https://github.com/webmachinelearning/webmcp-types",
      "https://github.com/GoogleChromeLabs/webmcp-tools",
      "http://127.0.0.1:3001/agenda/taller/index.html?paso=0"
    ],
    "demoUrl": "http://127.0.0.1:3001/agenda/taller/index.html?paso=0"
  }
]
