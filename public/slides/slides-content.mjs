export const slides = [
  {
    "id": 1,
    "type": "title",
    "title": "WebMCP",
    "subtitle": "Prepara tu webapp para los agentes de nuestro día a día\nAileen Villanueva",
    "color": "dark",
    "caption": "Una charla con ejemplos actuales y un demo de TacoAgent",
    "notes": "0:00–0:30. Hoy recorreremos cinco partes: por qué nace WebMCP, qué es, para qué se usa, cómo difiere de MCP y el estado de la propuesta de estándar junto con cómo empezar a usarlo hoy. Veremos una misma reserva con dos rutas de control y después el código. Terminaremos en TacoAgent: consultar un menú, preparar un carrito y pedir revisión humana. El plan para 30 minutos es unos 18 de explicación, 10 de demo y 2 de cierre. Son estimaciones para ensayar, no una duración humana cronometrada.",
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
      "La persona pide: «Agrega dos órdenes de tacos a mi carrito»",
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
      "El contrato nombra una acción del producto: addToCart",
      "El esquema describe entradas; la app valida cantidad, menú y stock",
      "La respuesta y el estado visible deben contar la misma historia"
    ],
    "caption": "Una herramienta útil expresa una acción, no una secuencia de clics",
    "notes": "2:00–2:40. Una interfaz explica el producto a las personas. El contrato de herramientas añade otra forma de operar ese producto. En TacoAgent, addToCart significa agregar un producto del menú abierto. La aplicación comprueba el restaurante, que el producto esté disponible y que quantity sea un entero entre uno y diez. El callback reutiliza esa lógica. El resultado describe el cambio y el carrito debe mostrar los mismos productos y total. La herramienta expresa una acción de negocio en vez de una secuencia de clics.",
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
    "caption": "TacoAgent combina búsqueda declarativa y operaciones de carrito imperativas.",
    "notes": "4:00–4:40. La API declarativa encaja cuando ya existe un formulario que expresa la acción. HTML aporta el nombre de la herramienta y los campos que el navegador convierte en parámetros. La API imperativa permite declarar funciones en JavaScript y decidir cuándo deben existir. TacoAgent combina ambas: searchRestaurants procede del formulario HTML, mientras abrir un menú, consultar o modificar el carrito y solicitar revisión se ofrecen con JavaScript. La UI y las herramientas comparten el mismo estado y las mismas reglas.",
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
    "notes": "8:10–8:50. Imaginemos un catálogo que utilizan varias aplicaciones. Un servidor MCP puede ofrecer consultas sobre ese servicio a distintos clientes. La tienda abierta, en cambio, puede exponer mediante WebMCP el menú seleccionado y el carrito que la persona está preparando. Las dos integraciones pueden coexistir y apoyarse en el mismo backend. La decisión depende de dónde vive la capacidad y del contexto que necesita para ejecutarse. En una compra, preparar el carrito y aprobar el pago siguen siendo pasos distintos.",
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
    "notes": "8:50–9:40. WebMCP avanza como propuesta abierta de API web. La publicación actual del Community Group es del 27 de octubre de 2026. Podemos probar implementaciones y aportar feedback sin confundir ese estado con una recomendación W3C. La disponibilidad depende del navegador y del cliente que utilicemos. Antes de presentar TacoAgent comprobaremos document.modelContext en la pestaña concreta. Las slides no convierten una prueba en otro entorno en una garantía de compatibilidad para este navegador.",
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
    "code": "<form toolname=\"searchRestaurants\"\n  tooldescription=\"Busca restaurantes por cocina\"\n  toolautosubmit>\n  <label>Cocina <select name=\"cuisine\">\n    <option value=\"mexicana\">Mexicana</option>\n  </select></label>\n  <button type=\"submit\">Buscar</button>\n</form>",
    "codeLanguage": "API declarativa · Extracto del formulario de TacoAgent",
    "caption": "toolautosubmit permite al agente enviar esta búsqueda. La UI sigue visible.",
    "notes": "10:20–11:10. El formulario real de TacoAgent declara searchRestaurants y describe una búsqueda de restaurantes. cuisine y priceRange son sus parámetros. Este extracto muestra cocina mexicana; la UI completa también permite filtrar precio. toolautosubmit permite al agente enviar directamente esta búsqueda. El handler de submit usa la misma función de búsqueda que el recorrido humano y devuelve su resultado cuando la llamada procede del agente. Podemos quitar toolautosubmit en un formulario cuyo envío deba quedar en manos de la persona.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/declarative-api"
    ]
  },
  {
    "id": 16,
    "type": "code",
    "title": "JavaScript: una herramienta de lectura",
    "color": "dark",
    "code": "await document.modelContext.registerTool({\n  name: \"viewCart\",\n  description: \"Consulta el carrito y total en MXN\",\n  inputSchema: { type: \"object\", properties: {} },\n  annotations: { readOnlyHint: true },\n  execute: async input => store.run(\"viewCart\", input)\n});",
    "codeLanguage": "API imperativa · Lectura del mismo DemoStore de la app",
    "caption": "viewCart funciona también con el carrito vacío y devuelve un resultado estructurado.",
    "notes": "11:10–12:10. viewCart es una primera herramienta de lectura fácil de comprobar. En el código de TacoAgent, la definición llama al mismo DemoStore que utiliza la UI. El resultado contiene success, message, items, itemCount, total y currency. El nombre, la descripción y el esquema explican el contrato. readOnlyHint comunica intención de lectura, pero la implementación debe hacerla cumplir. El fragmento resume la definición: el registro real pasa una señal para controlar su ciclo de vida y el adaptador también muestra el último resultado en la interfaz.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/imperative-api"
    ]
  },
  {
    "id": 17,
    "type": "code",
    "title": "Registro dinámico con AbortSignal",
    "color": "dark",
    "code": "const context = document.modelContext;\nconst controller = new AbortController();\nawait context.registerTool(tool, {\n  signal: controller.signal\n});\n\n// Cuando desaparece su precondición\ncontroller.abort();",
    "codeLanguage": "Extracto de ToolRegistry en lib/webmcp.ts",
    "caption": "addToCart aparece al abrir un menú. clearCart y checkout requieren productos.",
    "notes": "12:10–13:10. TacoAgent empieza con getRestaurantInfo y viewCart como herramientas imperativas, además de la búsqueda declarativa. Abrir un menú incorpora addToCart. Cuando hay productos, aparecen clearCart y checkout. Al vaciar o confirmar el carrito, esas dos operaciones se retiran. ToolRegistry mantiene los registros que siguen siendo válidos y usa AbortController para retirar los demás. La función también revalida el estado al ejecutar. Retirar el registro no cancela automáticamente una ejecución que ya esté activa.",
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
        "description": "Solicitar revisión no confirma un pedido ni aprueba un pago."
      }
    ],
    "caption": "Las annotations comunican intención. El código aplica los controles.",
    "notes": "14:00–15:10. Un esquema ayuda a llamar bien una herramienta, pero el código valida las entradas y el estado. Los límites del navegador y los permisos de negocio son controles distintos. Si hay backend, debe autorizar las operaciones. Las anotaciones comunican intención, no hacen cumplir esas reglas por sí solas. En TacoAgent, checkout sólo abre la revisión y devuelve pending-human-review. La persona compara el contenido y el total, y pulsa Confirmar pedido ficticio. La confirmación no está registrada como herramienta y un cambio en el carrito invalida la revisión.",
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
    "notes": "15:10–18:00. André Bandarra describe un problema después del lanzamiento: las llamadas exitosas dejan señales, pero un agente que abandona puede no comunicar qué capacidad le faltó. Una herramienta como fileSupportTicket intenta resolverlo dentro del mismo flujo, con posibles permisos adicionales y puntos ciegos. Su artículo propone un canal fuera de ese flujo, inspirado en Reporting API. Esa propuesta no es una API WebMCP estandarizada que activemos hoy. Mientras tanto podemos observar nuestras funciones, errores y recorridos, minimizando datos sensibles.",
    "sources": [
      "https://bandarra.me/posts/webmcp-feedback-loop"
    ]
  },
  {
    "id": 21,
    "type": "demo",
    "title": "Demo: WebMCP en acción",
    "color": "dark",
    "content": [
      "Consultar restaurantes y abrir un menú con getRestaurantInfo",
      "Agregar productos con addToCart y comprobar viewCart",
      "Probar un producto agotado y observar el error",
      "checkout solicita revisión: pending-human-review",
      "La persona confirma el pedido ficticio desde la UI"
    ],
    "caption": "TacoAgent · Menú, carrito y revisión humana. Sin cobro ni envío real.",
    "notes": "18:00–28:00. Abrir TacoAgent y comprobar el indicador de soporte nativo. Mostrar primero la UI y después las herramientas. searchRestaurants busca cocina mexicana. getRestaurantInfo con restaurantId taco-loco abre el menú y habilita addToCart. Intentar menuItemId quesadilla para mostrar que un producto agotado no entra al carrito. Agregar dos órdenes de taco-carnitas con quantity 2 y comparar viewCart con el total visible de MXN25.98. Mostrar clearCart y checkout disponibles con productos. checkout devuelve status pending-human-review y abre el diálogo. La persona revisa y pulsa Confirmar pedido ficticio. El pedido es local, sin cobro, envío ni datos personales. El Inspector permite probar llamadas nativas manualmente. Los botones de Ensayo guiado ejecutan JavaScript local sin IA y no demuestran una conexión WebMCP.",
    "sources": [
      "http://127.0.0.1:3001/",
      "https://github.com/aileenvl/webmcp-demo"
    ],
    "demoUrl": "http://127.0.0.1:3001/"
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
      "Demo: TacoAgent, menú y carrito con revisión humana"
    ],
    "caption": "La página declara. El cliente elige. La aplicación valida. La persona revisa.",
    "notes": "28:00–30:00. Para empezar no hace falta rehacer la web. Podemos elegir una capacidad de lectura, como viewCart, con un resultado comprobable. Detectamos soporte, declaramos la herramienta y probamos entradas válidas, errores y cambios visibles. Después evaluamos las decisiones con un agente compatible. Ya vimos por qué nace WebMCP, qué es, dónde sirve, cómo convive con MCP y cuál es el estado de la propuesta. TacoAgent mostró las dos APIs y la revisión humana al final del flujo. Abrimos preguntas. Las fuentes, tipos, Skill y DevTools quedan enlazados en la presentación.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp",
      "https://github.com/webmachinelearning/webmcp-types",
      "https://github.com/GoogleChromeLabs/webmcp-tools",
      "https://github.com/aileenvl/webmcp-demo"
    ],
    "demoUrl": "http://127.0.0.1:3001/"
  }
]
