export const slides = [
  {
    "id": 1,
    "type": "title",
    "title": "WebMCP",
    "subtitle": "Prepara tu webapp para los agentes de nuestro día a día\nAileen Villanueva",
    "color": "dark",
    "caption": "Definición, casos de uso, implementación y demo de TacoAgent",
    "notes": "0:00–0:20. Hoy empezamos por una definición directa de WebMCP. Después veremos para qué sirve, cómo usarla, sus diferencias con MCP, el estado de la propuesta y el demo de TacoAgent. La presentación conserva los casos concretos y los ejemplos técnicos de la charla original, actualizados con fuentes actuales. El plan es unos veinte minutos de teoría, ocho de demo y dos de cierre. Es una estimación para ensayar.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp"
    ],
    "section": "Título"
  },
  {
    "id": 2,
    "type": "content",
    "title": "Qué es WebMCP",
    "color": "dark",
    "content": [
      "Una propuesta de API del navegador para exponer herramientas desde un documento web",
      "La página declara nombre, propósito, entradas y una función de ejecución",
      "Un cliente compatible descubre esas capacidades y envía argumentos",
      "La aplicación ejecuta sus reglas y devuelve un resultado"
    ],
    "caption": "El sitio publica capacidades. El cliente aporta la decisión y el modelo, si lo utiliza.",
    "notes": "0:20–1:00. WebMCP permite que una página exponga funciones a clientes compatibles a través del navegador. Una herramienta representa una capacidad concreta del producto. Tiene nombre, descripción, esquema de entrada e implementación. La página decide qué publicar y sigue siendo responsable de sus reglas. Registrar funciones no incorpora automáticamente un LLM ni crea un chatbot. Primero entendamos este contrato y después veamos el problema que resuelve.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp",
      "https://webmachinelearning.github.io/webmcp/"
    ],
    "section": "Qué es WebMCP"
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
    "notes": "1:00–1:45. Sarah Drasner muestra una misma reserva con dos rutas de control. Una interpreta la interfaz y otra llama tres herramientas declaradas por la página. La comparación ayuda a explicar dónde vive el contrato de acciones. Los nodos y tools pertenecen a ese ejemplo didáctico. No son un benchmark ni permiten prometer una mejora universal.",
    "sources": [
      "https://webmcp-demo-sdras.netlify.app/",
      "https://github.com/sdras/webmcp-demo"
    ],
    "section": "Qué es WebMCP"
  },
  {
    "id": 4,
    "type": "bento",
    "title": "Quién hace qué",
    "color": "dark",
    "stats": [
      {
        "icon": "code",
        "label": "La página declara",
        "description": "Publica capacidades y ejecuta las reglas de la app."
      },
      {
        "icon": "chrome",
        "label": "El navegador media",
        "description": "Hace accesibles las herramientas del documento."
      },
      {
        "icon": "bot",
        "label": "El cliente elige",
        "description": "Selecciona la herramienta y sus argumentos."
      },
      {
        "icon": "user-check",
        "label": "La persona revisa",
        "description": "Expresa su objetivo y confirma los efectos que lo requieren."
      }
    ],
    "caption": "Disponibilidad, decisión y autorización son responsabilidades distintas.",
    "notes": "1:45–2:15. La página registra las acciones que sabe ejecutar. El navegador las hace accesibles dentro del contexto del documento. Un cliente o agente compatible las descubre y elige una llamada. Cuando llega la llamada, la aplicación debe validar argumentos, usuario y estado. Al terminar, comunica un resultado y actualiza la UI. Si la acción requiere revisión, la persona debe poder ver y aprobar el efecto concreto. Estos papeles son distintos: una herramienta disponible no equivale a una acción autorizada.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/compare-mcp",
      "https://developer.chrome.com/docs/ai/webmcp/secure-tools"
    ],
    "section": "Qué es WebMCP"
  },
  {
    "id": 5,
    "type": "content",
    "title": "Una llamada completa",
    "color": "dark",
    "content": [
      "El cliente elige getRestaurantInfo y restaurantId: taco-loco",
      "El navegador entrega la llamada a la herramienta registrada",
      "DemoStore valida el ID y abre el menú del restaurante",
      "La respuesta devuelve productos; la UI muestra el mismo menú"
    ],
    "caption": "Intención, argumentos, reglas, resultado y estado visible",
    "notes": "2:15–2:45. Una petición atraviesa varias responsabilidades. El cliente decide llamar getRestaurantInfo con el ID del restaurante. El navegador entrega esa llamada al callback que registró la página. DemoStore busca el restaurante, valida el identificador y actualiza la selección. El resultado devuelve el menú y la interfaz lo muestra. Si un resultado dice que la operación funcionó, debemos poder comprobar el mismo efecto en la app.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/build-tools"
    ],
    "section": "Qué es WebMCP"
  },
  {
    "id": 6,
    "type": "bento",
    "title": "Para qué se usa",
    "color": "dark",
    "stats": [
      {
        "icon": "plane",
        "label": "Viajes",
        "description": "Buscar itinerarios, fechas y pasajeros con datos estructurados."
      },
      {
        "icon": "message-circle",
        "label": "Formularios complejos",
        "description": "Capturar solicitudes de soporte sin perder validaciones."
      },
      {
        "icon": "shopping-cart",
        "label": "Comercio",
        "description": "Consultar catálogo, preparar carrito y abrir revisión."
      },
      {
        "icon": "settings",
        "label": "Trabajo y diagnósticos",
        "description": "Consultar configuraciones y operar el contexto seleccionado."
      }
    ],
    "caption": "Capacidades del producto con entradas y resultados que se puedan comprobar.",
    "notes": "2:45–3:15. Estos casos recuperan el recorrido de la charla original. En viajes se pueden expresar varias fechas, trayectos y pasajeros. En soporte, un formulario conserva campos y validaciones. En comercio, el catálogo y el carrito ofrecen acciones claras. En herramientas de trabajo, el contexto seleccionado puede definir qué operación tiene sentido. Son familias de diseño, no una promesa de que cada sitio ya exponga estas capacidades.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp",
      "https://developer.chrome.com/blog/chrome-at-io26"
    ],
    "section": "Para qué sirve"
  },
  {
    "type": "content",
    "title": "Viajes: búsqueda y reserva",
    "content": [
      "Expresar tramos de un viaje multidestino con fechas y pasajeros",
      "Devolver alternativas con precio, disponibilidad y restricciones",
      "Preparar una selección y comunicar si una opción cambió",
      "La persona revisa los detalles antes de confirmar la reserva"
    ],
    "caption": "Expedia y Booking.com: experimentos anunciados en Google I/O 2026.",
    "notes": "3:15–3:45. El ejemplo de diseño es una búsqueda de viaje con varios tramos. La herramienta puede aceptar fechas y pasajeros y devolver opciones estructuradas, con restricciones que el cliente pueda explicar. Preparar una selección no debe confundirse con confirmar una reserva. Chrome anunció en Google I/O 2026 que Expedia y Booking.com estaban experimentando con WebMCP. Esa mención histórica no verifica que hayan desplegado este flujo concreto ni lo atribuye a sus productos actuales.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp",
      "https://developer.chrome.com/blog/chrome-at-io26"
    ],
    "id": 7,
    "color": "dark",
    "section": "Para qué sirve"
  },
  {
    "type": "content",
    "title": "Comercio: catálogo, carrito y revisión",
    "content": [
      "Consultar productos con IDs, precio, opciones y stock",
      "Agregar productos y devolver el carrito actualizado",
      "Preparar checkout con un resumen visible",
      "La persona revisa y autoriza la compra en el flujo correspondiente"
    ],
    "caption": "Shopify, Etsy, Instacart y Target: experimentos anunciados en Google I/O 2026.",
    "notes": "3:45–4:15. Este es un ejemplo de diseño de comercio. Cada paso tiene una entrada y un resultado que se pueden comprobar. TacoAgent lo muestra con datos ficticios: consulta, carrito y revisión humana. PayPal publica otro caso con su propio flujo de aprobación. La lista de marcas viene del anuncio de experimentación de Google I/O 2026. No atribuye estas acciones específicas a un despliegue de Shopify, Etsy, Instacart o Target.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp",
      "https://developer.chrome.com/blog/chrome-at-io26",
      "https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/"
    ],
    "id": 8,
    "color": "dark",
    "section": "Para qué sirve"
  },
  {
    "type": "content",
    "title": "Soporte y aplicaciones de trabajo",
    "content": [
      "Preparar datos de la persona en formularios médicos o legales para revisión humana",
      "Consultar estado de un caso y devolver el siguiente paso útil",
      "Publicar diagnósticos de lectura antes de cambiar configuraciones",
      "Ofrecer acciones sólo sobre el proyecto o elemento seleccionado"
    ],
    "caption": "Ejemplos de diseño: captura y revisión de datos, sin emitir decisiones médicas o legales.",
    "notes": "4:15–4:45. No todo es reservar o comprar. Un formulario de soporte puede describir los datos que requiere y conservar su validación. Si el portal utiliza un formulario médico o legal, el ejemplo consiste en preparar campos con datos que aporta la persona para revisión humana. No emite decisiones médicas o legales ni afirma una adopción real. Una consulta de estado puede devolver un resultado que permita continuar. Un diagnóstico de lectura puede explicar una configuración antes de modificarla. En una herramienta de trabajo, seleccionar un proyecto o elemento determina qué acciones se ofrecen. El principio es reutilizar capacidades de negocio que ya existen, manteniendo sus permisos y controles.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp",
      "https://developer.chrome.com/docs/ai/webmcp/build-tools"
    ],
    "id": 9,
    "color": "dark",
    "section": "Para qué sirve"
  },
  {
    "id": 10,
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
    "notes": "4:45–5:25. En el texto compartido por André Bandarra aparecen tres ejemplos concretos. Aisle habilita la finalización del plano de mesas cuando todos los invitados tienen asiento y las reglas se cumplen. Alza publica la operación de extender una pared cuando hay exactamente una pared seleccionada. Roque Nights coordina la retirada con las llamadas que siguen activas. La idea común es evitar un catálogo lleno de acciones que todavía no tienen sentido. La función debe volver a validar el estado cuando la invocan.",
    "sources": [
      "https://www.linkedin.com/feed/update/urn:li:activity:7520892911392030720/",
      "https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools"
    ],
    "section": "Para qué sirve"
  },
  {
    "id": 11,
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
    "notes": "5:25–6:10. PayPal comparó la compra de una tarjeta de regalo en una tienda de ensayo y reportó las cifras de esta slide. Son resultados direccionales de un sandbox pequeño que varían con tienda, catálogo y asistente. Las herramientas preparan la compra. La persona revisa y aprueba el pago dentro de PayPal.",
    "sources": [
      "https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/"
    ],
    "section": "Para qué sirve"
  },
  {
    "type": "comparison",
    "title": "Beneficios y límites",
    "leftContent": [
      "Qué puede aportar",
      "• Menos exploración de controles para acciones declaradas",
      "• Argumentos y resultados explícitos",
      "• La UI y las herramientas comparten estado y lógica"
    ],
    "rightContent": [
      "Qué sigue siendo necesario",
      "• Un navegador y un cliente compatibles",
      "• Validación, autorización y sincronización de UI",
      "• Evaluar decisiones y recuperación con un agente"
    ],
    "caption": "Los resultados dependen del flujo. No hay una mejora universal de costo o velocidad.",
    "notes": "6:10–6:45. Un contrato explícito puede reducir el trabajo de interpretar controles y facilita comprobar entradas y resultados. Compartir la lógica de la aplicación evita inventar otra implementación para el agente. Esos beneficios no garantizan que todas las tareas sean más rápidas ni que los inputs tipados vuelvan determinista a un modelo. Tampoco se elimina toda interacción visual. El cliente debe descubrir las herramientas y el desarrollador sigue validando, autorizando y evaluando el comportamiento.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp",
      "https://developer.chrome.com/docs/ai/webmcp/secure-tools"
    ],
    "id": 12,
    "color": "dark",
    "section": "Para qué sirve"
  },
  {
    "type": "content",
    "title": "Adopción gradual en una app existente",
    "content": [
      "Elegir una capacidad útil, pequeña y comprobable",
      "Nombrar una acción del producto con entradas y resultados claros",
      "Reutilizar la misma lógica que usan los botones y formularios",
      "Registrar sólo cuando el contexto permita la operación",
      "Probar contrato y errores, después evaluar con un agente"
    ],
    "caption": "Una herramienta atómica por acción. La UI humana sigue funcionando.",
    "notes": "6:45–7:15. No necesitamos reescribir la aplicación. Podemos empezar con una lectura como viewCart, comprobar su resultado y añadir después una mutación pequeña. Un nombre específico explica mejor la acción que un nombre genérico como interactuar. Reutilizamos las funciones del producto y mantenemos la interfaz humana. Registramos cada capacidad en el contexto correcto. Después probamos argumentos, resultados y cambios visibles, y evaluamos si un agente elige bien la herramienta.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/build-tools",
      "https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools"
    ],
    "id": 13,
    "color": "dark",
    "section": "Cómo usar WebMCP"
  },
  {
    "id": 14,
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
    "notes": "7:15–7:45. La API declarativa encaja cuando ya existe un formulario que expresa la acción. HTML aporta el nombre de la herramienta y los campos que el navegador convierte en parámetros. La API imperativa permite declarar funciones en JavaScript y decidir cuándo deben existir. TacoAgent combina ambas: searchRestaurants procede del formulario HTML, mientras abrir un menú, consultar o modificar el carrito y solicitar revisión se ofrecen con JavaScript. La UI y las herramientas comparten el mismo estado y las mismas reglas.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/declarative-api",
      "https://developer.chrome.com/docs/ai/webmcp/imperative-api"
    ],
    "section": "Cómo usar WebMCP"
  },
  {
    "id": 15,
    "type": "code",
    "title": "HTML: un formulario como herramienta",
    "color": "dark",
    "code": "<form toolname=\"searchRestaurants\"\n  tooldescription=\"Busca restaurantes por cocina\"\n  toolautosubmit>\n  <label>Cocina <select name=\"cuisine\">\n    <option value=\"mexicana\">Mexicana</option>\n  </select></label>\n  <button type=\"submit\">Buscar</button>\n</form>",
    "codeLanguage": "API declarativa · Extracto del formulario de TacoAgent",
    "caption": "toolautosubmit permite al agente enviar esta búsqueda. La UI sigue visible.",
    "notes": "7:45–8:25. El formulario real de TacoAgent declara searchRestaurants y describe una búsqueda de restaurantes. cuisine y priceRange son sus parámetros. Este extracto muestra cocina mexicana; la UI completa también permite filtrar precio. toolautosubmit permite al agente enviar directamente esta búsqueda. El handler de submit usa la misma función de búsqueda que el recorrido humano y devuelve su resultado cuando la llamada procede del agente. Podemos quitar toolautosubmit en un formulario cuyo envío deba quedar en manos de la persona.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/declarative-api"
    ],
    "section": "Cómo usar WebMCP"
  },
  {
    "type": "code",
    "title": "Responder a una búsqueda declarativa",
    "code": "function onSearch(event) {\n  event.preventDefault();\n  const data = new FormData(event.currentTarget);\n  const result = search(Object.fromEntries(data));\n  const nativeEvent = event.nativeEvent;\n  if (nativeEvent.agentInvoked &&\n      typeof nativeEvent.respondWith === \"function\") {\n    nativeEvent.respondWith(Promise.resolve(result));\n  }\n}",
    "codeLanguage": "Extracto JavaScript del handler React de TacoAgent",
    "caption": "La misma búsqueda actualiza la UI y devuelve el resultado al cliente.",
    "notes": "8:25–9:00. El handler previene la navegación normal y lee los campos del formulario. search aplica la búsqueda, actualiza los resultados visibles y devuelve un objeto. Cuando el evento nativo procede de una invocación del agente, respondWith entrega ese resultado. Este fragmento resume el handler React de TacoAgent: event.nativeEvent es el SubmitEvent y el código TypeScript declara sus propiedades experimentales. La respuesta se asocia durante el handler, aunque el trabajo se pueda representar con una promesa.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/declarative-api",
      "https://github.com/aileenvl/webmcp-demo"
    ],
    "id": 16,
    "color": "dark",
    "section": "Cómo usar WebMCP"
  },
  {
    "id": 17,
    "type": "code",
    "title": "JavaScript: una herramienta de lectura",
    "color": "dark",
    "code": "await document.modelContext.registerTool({\n  name: \"viewCart\",\n  description: \"Consulta el carrito y total en MXN\",\n  inputSchema: { type: \"object\", properties: {} },\n  annotations: { readOnlyHint: true },\n  execute: async (input, { signal }) => {\n    signal.throwIfAborted();\n    return store.run(\"viewCart\", input);\n  }\n});",
    "codeLanguage": "API imperativa · Lectura del mismo DemoStore de la app",
    "caption": "viewCart funciona también con el carrito vacío y devuelve un resultado estructurado.",
    "notes": "9:00–9:40. viewCart es una primera herramienta de lectura fácil de comprobar. En el código de TacoAgent, la definición llama al mismo DemoStore que utiliza la UI. El resultado contiene success, message, items, itemCount, total y currency. El nombre, la descripción y el esquema explican el contrato. readOnlyHint comunica intención de lectura, pero la implementación debe hacerla cumplir. El fragmento resume la definición: el registro real pasa una señal para controlar su ciclo de vida y el adaptador también muestra el último resultado en la interfaz. El callback actual comprueba también la señal de la ejecución antes de llamar a la lógica de negocio.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/imperative-api"
    ],
    "section": "Cómo usar WebMCP"
  },
  {
    "type": "code",
    "title": "Schema y validación de cantidad",
    "code": "const quantitySchema = {\n  type: \"integer\", minimum: 1, maximum: 10\n};\nconst { quantity } = params;\nif (typeof quantity !== \"number\" ||\n    !Number.isInteger(quantity) ||\n    quantity < 1 || quantity > 10) {\n  return { success: false, message: \"Cantidad inválida\" };\n}",
    "codeLanguage": "Extractos de inputSchema.properties.quantity y DemoStore",
    "caption": "El esquema guía al cliente. La función vuelve a validar al ejecutar.",
    "notes": "9:40–10:20. El esquema describe quantity como un entero entre uno y diez. La función comprueba esas reglas de nuevo con los datos que recibe. También valida el restaurante, el producto, la selección y el stock. No debemos asumir que todos los clientes o navegadores validarán completamente el JSON Schema antes de llamar al callback. En el código real de TacoAgent se devuelve un mensaje concreto para que el cliente pueda corregir la entrada.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/secure-tools",
      "https://developer.chrome.com/docs/ai/webmcp/build-tools",
      "https://github.com/aileenvl/webmcp-demo"
    ],
    "id": 18,
    "color": "dark",
    "section": "Cómo usar WebMCP"
  },
  {
    "type": "content",
    "title": "Resultados que permiten recuperarse",
    "content": [
      "Producto agotado: success false y una explicación para elegir otro",
      "Cantidad inválida: informar que debe ser un entero entre 1 y 10",
      "Operación válida: devolver productos, cantidad, total y moneda",
      "La UI conserva un estado coherente después de un error"
    ],
    "caption": "Un «Listo» genérico no explica qué cambió ni qué debe corregirse.",
    "notes": "10:20–11:00. Una respuesta útil permite decidir el siguiente paso. Si la quesadilla está agotada, el cliente puede elegir otro producto. Si quantity es inválida, el mensaje explica el rango. Cuando agregar funciona, la respuesta incluye el carrito y su total. La aplicación no debe introducir cambios parciales antes de devolver un error. En TacoAgent no prometemos reintentos idempotentes: cada llamada a addToCart agrega productos, así que consultamos el estado antes de repetir una operación dudosa.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/build-tools",
      "https://github.com/aileenvl/webmcp-demo"
    ],
    "id": 19,
    "color": "dark",
    "section": "Cómo usar WebMCP"
  },
  {
    "id": 20,
    "type": "code",
    "title": "Registro dinámico con AbortSignal",
    "color": "dark",
    "code": "const context = document.modelContext;\nconst controller = new AbortController();\nawait context.registerTool(tool, {\n  signal: controller.signal\n});\n\n// Cuando desaparece su precondición\ncontroller.abort();",
    "codeLanguage": "Extracto de ToolRegistry en lib/webmcp.ts",
    "caption": "addToCart aparece al abrir un menú. clearCart y checkout requieren productos.",
    "notes": "11:00–11:40. TacoAgent empieza con getRestaurantInfo y viewCart como herramientas imperativas, además de la búsqueda declarativa. Abrir un menú incorpora addToCart. Cuando hay productos, aparecen clearCart y checkout. Al vaciar o confirmar el carrito, esas dos operaciones se retiran. ToolRegistry mantiene los registros que siguen siendo válidos y usa AbortController para retirar los demás. La función también revalida el estado al ejecutar. Retirar el registro no cancela automáticamente una ejecución que ya esté activa.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/imperative-api",
      "https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools"
    ],
    "section": "Cómo usar WebMCP"
  },
  {
    "type": "code",
    "title": "Eventos de formularios declarativos",
    "code": "const context = document.modelContext;\ncontext.addEventListener(\"toolactivated\", ({ toolName }) => {\n  console.info(\"Herramienta activada:\", toolName);\n});\ncontext.addEventListener(\"toolcancel\", ({ toolName }) => {\n  console.info(\"Herramienta cancelada:\", toolName);\n});",
    "codeLanguage": "Eventos en document.modelContext",
    "caption": "toolactivated y toolcancel permiten reflejar el estado del formulario.",
    "notes": "11:40–12:15. La API declarativa comunica cuándo se activa una herramienta de formulario y cuándo se cancela. El código actual escucha en document.modelContext y recibe toolName. Puede servir para anunciar el estado o sincronizar feedback visible. Los eventos no son cancelables y no reemplazan la validación de submit. En código antiguo pueden aparecer handlers sobre window: las propiedades window.ontoolactivated y window.ontoolcancel dejaron de estar soportadas desde Chrome 156, según la documentación actual.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/declarative-api"
    ],
    "id": 21,
    "color": "dark",
    "section": "Cómo usar WebMCP"
  },
  {
    "type": "code",
    "title": "Feedback visual con CSS",
    "code": "form:tool-form-active {\n  outline: 3px solid #174ea6;\n}\nbutton:tool-submit-active {\n  outline: 3px dashed #137333;\n}",
    "codeLanguage": "Pseudo-clases nativas de la API declarativa",
    "caption": "El formulario y el submit activo permanecen visibles durante la interacción.",
    "notes": "12:15–12:45. Estas pseudo-clases permiten mostrar qué formulario está operando el cliente y qué botón de envío está activo. El ejemplo usa un contorno continuo para el formulario y uno discontinuo para el botón, además de color. Los estados desaparecen al enviar, cancelar o restablecer el formulario. Es una mejora progresiva: la UI humana debe seguir siendo comprensible en un navegador que no soporte estas pseudo-clases.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/declarative-api"
    ],
    "id": 22,
    "color": "dark",
    "section": "Cómo usar WebMCP"
  },
  {
    "type": "comparison",
    "title": "Tipos y Skill para implementar",
    "leftContent": [
      "webmcp-types",
      "• npm i -D webmcp-types",
      "• Declaraciones TypeScript para la API",
      "• Inferencia de execute desde inputSchema"
    ],
    "rightContent": [
      "Skill oficial",
      "• build-webmcp-tools",
      "• Diseño, seguridad y flujos con consecuencias",
      "• Guía para tu agente de programación"
    ],
    "caption": "Ayudan a desarrollar. El soporte de navegador y cliente sigue siendo un requisito.",
    "notes": "12:45–13:15. webmcp-types aporta las declaraciones TypeScript oficiales y permite inferir argumentos desde el esquema en el patrón documentado. Cuando el proyecto configura compilerOptions.types, añadimos la entrada sin borrar las existentes. La Skill oficial de GoogleChromeLabs reúne prácticas para construir herramientas, gestionar seguridad y diseñar acciones con consecuencias. Podemos dársela al agente que programa la integración. Ni el paquete ni la Skill añaden la implementación de la API a un navegador.",
    "sources": [
      "https://github.com/webmachinelearning/webmcp-types",
      "https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md",
      "https://www.linkedin.com/feed/update/urn:li:activity:7517933168335847424/"
    ],
    "id": 23,
    "color": "dark",
    "section": "Cómo usar WebMCP"
  },
  {
    "type": "comparison",
    "title": "DevTools: probar y evaluar",
    "leftContent": [
      "Invocación manual",
      "• Ver registro, schema y disponibilidad",
      "• Ejecutar con argumentos controlados",
      "• Comparar resultados, errores y UI"
    ],
    "rightContent": [
      "Evaluación con un agente",
      "• Comprobar si entiende la intención",
      "• Observar elección de tool y argumentos",
      "• Medir recuperación, éxito y tiempo"
    ],
    "caption": "Chrome DevTools > Application > WebMCP. Run tool no evalúa una decisión de un LLM.",
    "notes": "13:15–13:55. DevTools ofrece el panel WebMCP dentro de Application. Podemos inspeccionar herramientas disponibles, ver invocaciones y probar una llamada con argumentos concretos. Esto permite verificar la lógica independientemente de un modelo. Para evaluar al agente necesitamos tareas representativas y un cliente compatible: observamos si elige la herramienta correcta, cómo usa los resultados y cómo se recupera. La extensión Inspector es opcional, y una llamada manual nativa sigue siendo una prueba manual.",
    "sources": [
      "https://developer.chrome.com/docs/devtools/application/webmcp",
      "https://developer.chrome.com/docs/ai/webmcp/evals"
    ],
    "id": 24,
    "color": "dark",
    "section": "Cómo usar WebMCP"
  },
  {
    "id": 25,
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
    "notes": "13:55–14:45. Un esquema ayuda a llamar bien una herramienta, pero el código valida las entradas y el estado. Los límites del navegador y los permisos de negocio son controles distintos. Si hay backend, debe autorizar las operaciones. Las anotaciones comunican intención, no hacen cumplir esas reglas por sí solas. En TacoAgent, checkout sólo abre la revisión y devuelve pending-human-review. La persona compara el contenido y el total, y pulsa Confirmar pedido ficticio. La confirmación no está registrada como herramienta y un cambio en el carrito invalida la revisión.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/secure-tools"
    ],
    "section": "Cómo usar WebMCP"
  },
  {
    "id": 26,
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
    "notes": "14:45–15:40. André Bandarra describe un problema después del lanzamiento: las llamadas exitosas dejan señales, pero un agente que abandona puede no comunicar qué capacidad le faltó. Una herramienta como fileSupportTicket intenta resolverlo dentro del mismo flujo, con posibles permisos adicionales y puntos ciegos. Su artículo propone un canal fuera de ese flujo, inspirado en Reporting API. Esa propuesta no es una API WebMCP estandarizada que activemos hoy. Mientras tanto podemos observar nuestras funciones, errores y recorridos, minimizando datos sensibles.",
    "sources": [
      "https://bandarra.me/posts/webmcp-feedback-loop",
      "https://www.linkedin.com/feed/update/urn:li:activity:7508545474149142528/"
    ],
    "section": "Cómo usar WebMCP"
  },
  {
    "id": 27,
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
    "notes": "15:40–16:20. MCP conecta aplicaciones cliente con servidores que pueden ejecutarse localmente o en otro lugar. WebMCP se centra en las capacidades que una página ofrece desde su documento. Una herramienta puede depender del proyecto abierto, la selección o el borrador que una persona tiene en pantalla. Esa diferencia de contexto explica muchos de sus casos de uso. No hace falta presentar MCP como exclusivamente backend ni pensar que WebMCP es un servidor de red. Tampoco basta compartir sesión para autorizar cualquier operación.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/compare-mcp",
      "https://modelcontextprotocol.io/specification/2026-07-28"
    ],
    "section": "Diferencias con MCP"
  },
  {
    "type": "comparison",
    "title": "Protocolo MCP y API WebMCP",
    "leftContent": [
      "MCP",
      "• Mensajes JSON-RPC entre cliente y servidor",
      "• Transportes estándar: stdio y Streamable HTTP",
      "• Servidores locales o remotos"
    ],
    "rightContent": [
      "WebMCP",
      "• API del navegador expuesta al documento",
      "• Registro, descubrimiento e invocación de tools",
      "• No crea un endpoint MCP de red automáticamente"
    ],
    "caption": "La forma de conexión y el contexto de ejecución son distintos.",
    "notes": "16:20–17:00. MCP define un protocolo de mensajes y transportes para conectar clientes y servidores. La revisión actual documenta stdio y Streamable HTTP. WebMCP ofrece una API del navegador para capacidades de una página. Registrar una función en document.modelContext no publica por sí mismo un servidor MCP de red. Esa diferencia de arquitectura ayuda a elegir la integración sin reducir MCP a una API REST o a una conexión exclusivamente server-to-server.",
    "sources": [
      "https://modelcontextprotocol.io/specification/2026-07-28/basic/transports",
      "https://modelcontextprotocol.io/specification/2026-07-28",
      "https://developer.chrome.com/docs/ai/webmcp/compare-mcp"
    ],
    "id": 28,
    "color": "dark",
    "section": "Diferencias con MCP"
  },
  {
    "id": 29,
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
    "notes": "17:00–17:30. Imaginemos un catálogo que utilizan varias aplicaciones. Un servidor MCP puede ofrecer consultas sobre ese servicio a distintos clientes. La tienda abierta, en cambio, puede exponer mediante WebMCP el menú seleccionado y el carrito que la persona está preparando. Las dos integraciones pueden coexistir y apoyarse en el mismo backend. La decisión depende de dónde vive la capacidad y del contexto que necesita para ejecutarse. En una compra, preparar el carrito y aprobar el pago siguen siendo pasos distintos.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp/compare-mcp"
    ],
    "section": "Diferencias con MCP"
  },
  {
    "id": 30,
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
    "notes": "17:30–18:15. WebMCP avanza como propuesta abierta de API web. La publicación actual del Community Group es del 27 de octubre de 2026. Podemos probar implementaciones y aportar feedback sin confundir ese estado con una recomendación W3C. La disponibilidad depende del navegador y del cliente que utilicemos. Antes de presentar TacoAgent comprobaremos document.modelContext en la pestaña concreta. Las slides no convierten una prueba en otro entorno en una garantía de compatibilidad para este navegador.",
    "sources": [
      "https://webmachinelearning.github.io/webmcp/",
      "https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md",
      "https://developer.chrome.com/docs/ai/webmcp"
    ],
    "section": "Estándares"
  },
  {
    "type": "content",
    "title": "Una API que sigue evolucionando",
    "content": [
      "API actual: document.modelContext",
      "navigator.modelContext quedó deprecada desde Chromium 150",
      "El ciclo de vida actual utiliza registerTool con AbortSignal",
      "Revisar snippets antiguos y comprobar navegador y cliente"
    ],
    "caption": "Guía de Chrome actualizada el 20 de octubre de 2026.",
    "notes": "18:15–19:00. La evolución de la API es una razón práctica para revisar el código de una charla previa. La guía actual usa document.modelContext y registra herramientas con una señal para controlar su vida. navigator.modelContext quedó deprecada en Chromium 150. Métodos antiguos como unregisterTool, provideContext y clearContext ya no corresponden al patrón vigente. Esto no obliga a empezar de cero: ajustamos el adaptador y comprobamos comportamiento en el navegador y cliente que vamos a utilizar.",
    "sources": [
      "https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools",
      "https://developer.chrome.com/docs/ai/webmcp/imperative-api"
    ],
    "id": 31,
    "color": "dark",
    "section": "Estándares"
  },
  {
    "id": 32,
    "type": "code",
    "title": "Empezar hoy: comprobar soporte",
    "color": "dark",
    "code": "Boolean(document.modelContext)\n\n// true: registra una herramienta y abre DevTools.\n// false: para desarrollo local, habilita\n// chrome://flags/#enable-webmcp-testing\n// y reinicia el navegador.",
    "codeLanguage": "Primero detectar. Configurar sólo si falta soporte.",
    "caption": "La guía de Chrome explica los requisitos del entorno",
    "notes": "19:00–20:00. El primer paso es comprobar la API en la pestaña que vamos a usar. No hay que reinstalar el navegador o activar flags si el soporte ya existe. Si document.modelContext está disponible, podemos registrar una herramienta y verla en DevTools. Si falta, seguimos la guía de desarrollo local: navegador compatible, flag cuando corresponda y reinicio. El sitio debe ejecutarse en un contexto adecuado, como localhost o HTTPS. Tipos y extensiones no sustituyen la implementación del navegador.",
    "sources": [
      "https://developer.chrome.com/docs/ai/webmcp"
    ],
    "section": "Estándares"
  },
  {
    "id": 33,
    "type": "code",
    "title": "TacoAgent: recorrido del demo",
    "color": "dark",
    "content": [
      "Consultar restaurantes y abrir un menú con getRestaurantInfo",
      "Agregar productos con addToCart y comprobar viewCart",
      "Probar un producto agotado y observar el error",
      "checkout solicita revisión: pending-human-review",
      "La persona confirma el pedido ficticio desde la UI"
    ],
    "caption": "3 tools al inicio, 4 con menú, 6 con carrito y 4 después de confirmar.",
    "notes": "20:00–28:00. Abrimos TacoAgent y comprobamos el indicador nativo. searchRestaurants busca comida mexicana. getRestaurantInfo abre Taco Loco y habilita addToCart. Mostramos un producto agotado antes de agregar dos órdenes de tacos de carnitas. viewCart permite comparar respuesta y total de MXN 25.98 con la UI. Con productos aparecen clearCart y checkout. checkout devuelve pending-human-review y abre el resumen. La persona pulsa Confirmar pedido ficticio. La operación es local, sin cobro ni envío. Si usamos Ensayo guiado, decimos que son llamadas JavaScript locales sin IA; no las rotulamos como WebMCP nativo.",
    "sources": [
      "http://127.0.0.1:3001/",
      "https://github.com/aileenvl/webmcp-demo"
    ],
    "demoUrl": "http://127.0.0.1:3001/",
    "code": "getRestaurantInfo\n{\"restaurantId\":\"taco-loco\"}\n\naddToCart\n{\"restaurantId\":\"taco-loco\",\n \"menuItemId\":\"taco-carnitas\",\"quantity\":2}\n\ncheckout\n{}",
    "codeLanguage": "Entradas JSON. viewCart y checkout reciben {}.",
    "section": "Demo: TacoAgent"
  },
  {
    "id": 34,
    "type": "content",
    "title": "Demo en acción",
    "color": "dark",
    "content": [
      "Abrir TacoAgent para recorrer menú, carrito y revisión",
      "Usar el video local como respaldo sin conexión",
      "La página declara, el cliente elige y la aplicación valida",
      "La persona revisa antes de confirmar"
    ],
    "caption": "Recorrido completo y video de respaldo disponibles desde esta slide.",
    "notes": "28:00–30:00. Volvemos a la idea central: una capacidad útil tiene propósito, argumentos, reglas y un resultado comprobable. TacoAgent mostró cómo combinar un formulario declarativo con funciones imperativas y disponibilidad dinámica. La revisión humana cierra el flujo. Podemos volver a abrir el demo o reproducir el video guardado como respaldo. Para empezar en otro producto, elegir una lectura o un borrador pequeño, probar errores y UI y después evaluar las decisiones con un agente compatible. Abrimos preguntas.",
    "sources": [
      "http://127.0.0.1:3001/",
      "https://github.com/aileenvl/webmcp-demo"
    ],
    "demoUrl": "http://127.0.0.1:3001/",
    "videoUrl": "http://127.0.0.1:3001/demo-backup/TacoAgent-WebMCP-respaldo.mp4",
    "section": "Demo: TacoAgent"
  }
]
