# Guion de WebMCP en español

**Aileen Villanueva · 29 de octubre de 2026 · 30 minutos**

Presentación adaptada de la charla «Prepara tu webapp para los agentes de nuestro día a día». La explicación ocupa unos 21 minutos, el demo 7 y el cierre 2. Si necesitas recortar, omite el ejemplo MCP del minuto 5 y limita la sección Types a 30 segundos.

## Recorrido de las slides

| Tiempo | Slide | Idea para decir en voz alta |
| --- | --- | --- |
| 0:00–1:00 | 1. WebMCP | «Vamos a darle a nuestra web un contrato que un agente pueda usar. Lo veremos con una app ficticia de comida.» |
| 1:00–3:00 | 2. La interacción con una web | «Una intención como agregar comida al carrito puede tener una función explícita. La app sigue validando y mostrando el resultado.» |
| 3:00–5:00 | 3. Qué expone WebMCP | «La página declara nombre, descripción, schema y función. El navegador conecta esas capacidades con un agente.» |
| 5:00–6:30 | 4. MCP y WebMCP | «MCP conecta clientes y servidores. WebMCP expone capacidades del documento web activo. Podemos usar ambos.» |
| 6:30–8:00 | 5. Dos APIs complementarias | «HTML para formularios. JavaScript para acciones y disponibilidad dinámica.» |
| 8:00–10:00 | 6. Una herramienta declarativa | «Los campos del formulario describen parámetros. toolautosubmit decide si el agente puede enviarlo directamente.» |
| 10:00–12:00 | 7. Una herramienta imperativa | «El schema ayuda al agente. La función aplica las reglas de negocio y actualiza la misma UI.» |
| 12:00–14:00 | 8. Herramientas según el estado | «Con el carrito vacío, checkout todavía no tiene sentido. La disponibilidad debe reflejar ese estado.» |
| 14:00–16:00 | 9. Seguridad en cada acción | «Una annotation comunica intención. El código valida, el backend autoriza y una persona revisa las acciones con consecuencias.» |
| 16:00–17:30 | 10. Types y Skill | «Los tipos y la Skill ayudan a implementar bien. El navegador sigue necesitando soporte real.» |
| 17:30–19:00 | 11. El feedback | «También necesitamos saber qué falló después de lanzar. El reporting out-of-band es una propuesta, y hoy podemos instrumentar nuestras funciones.» |
| 19:00–20:30 | 12. Preparación | «Primero verificamos soporte. El Inspector permite ver e invocar las herramientas de esta página.» |
| 20:30–21:30 | 13. Demo | «Veremos búsqueda, carrito, errores, herramientas dinámicas y una revisión humana.» |
| 21:30–28:30 | Demo en TacoAgent | Seguir el recorrido de abajo. |
| 28:30–30:00 | 14. Recursos | «Contrato claro, disponibilidad según estado y reglas aplicadas en código. Estas son las tres decisiones para empezar.» |

Las notas completas y las fuentes están en `public/slides/slides-content.mjs`, en el panel N de la presentación web y en las notas de la presentación editable.

## Preparación antes de subir al escenario

1. Abrir la presentación y TacoAgent en pestañas separadas.
2. En un Chrome compatible, habilitar `chrome://flags/#enable-webmcp-testing` y reiniciar si hace falta.
3. Comprobar que `document.modelContext` existe en la pestaña del demo. La disponibilidad depende de la versión, canal, flag y configuración del navegador.
4. Abrir [WebMCP Model Context Tool Inspector](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd).
5. Empezar con carrito vacío y datos ficticios. Los pedidos del demo son simulados.
6. Tener abierto el código de `lib/webmcp.ts` para mostrar el registro y `AbortSignal`.

## Demo de siete minutos

### 0:00–1:00 · La UI y sus herramientas

Mostrar TacoAgent como lo usaría una persona. Abrir el Inspector y observar las herramientas disponibles. Explicar que la herramienta de búsqueda procede del formulario, mientras las operaciones del carrito proceden de JavaScript.

Una invocación manual desde el Inspector demuestra la integración WebMCP. Si usas un cliente con un modelo conectado y lenguaje natural, identifica ese cliente. No presentar una prueba manual como si un agente autónomo la hubiera decidido.

### 1:00–2:00 · Búsqueda declarativa

En `searchRestaurants`, usar la cocina mexicana. Si el formulario espera selección manual para enviar, pulsar «Buscar» como persona. Mostrar `toolname` y `tooldescription` en el HTML. Los nombres exactos de campos deben coincidir con los que muestra el Inspector.

### 2:00–3:30 · Consulta y carrito

Ejecutar `getRestaurantInfo` con el ID real `taco-loco`.

```json
{ "restaurantId": "taco-loco" }
```

Ejecutar `addToCart`. Copiar el schema del Inspector si el build cambia campos.

```json
{
  "restaurantId": "taco-loco",
  "menuItemId": "taco-carnitas",
  "quantity": 2
}
```

El producto «Tacos de Carnitas» representa una orden de tres tacos en los datos ficticios. Quantity 2 significa dos órdenes. Mostrar el carrito y comprobar el resultado con `viewCart`.

### 3:30–4:30 · Un error recuperable

Repetir `addToCart` con `quantity: 0`, o usar `menuItemId: "quesadilla"`, que figura sin stock. Leer el error y explicar qué parámetro debe corregir el agente. El carrito válido debe conservarse.

### 4:30–5:30 · Disponibilidad dinámica

Mostrar las operaciones del carrito que aparecen cuando hay productos. Vaciar con `clearCart` y observar el cambio. Agregar otra vez una orden para continuar. Mostrar en código el `AbortController` y la señal asociada al registro.

### 5:30–7:00 · Revisión y confirmación

Abrir `checkout` y usar datos ficticios, por ejemplo nombre «Demo JSConf» y dirección «Calle Ejemplo 123». Mostrar productos y total en la revisión. La persona confirma el pedido simulado en la UI. Explicar que la herramienta no puede autoaprobar ese paso.

## Respaldo si no hay soporte nativo

Decir: «Este navegador no ofrece la API nativa en esta sesión. Haré el mismo recorrido manual y veremos a qué función corresponde cada paso.»

Buscar comida mexicana, abrir Taco Loco, agregar una orden, revisar el carrito y completar la revisión con los controles de la app. Mostrar el snippet de registro y explicar qué vería el Inspector en un navegador compatible. El respaldo demuestra el flujo de negocio y el diseño de herramientas. No demuestra una llamada WebMCP nativa.

## Preguntas frecuentes

**¿Ya es un estándar W3C?** La publicación actual es un borrador de Community Group. La API todavía evoluciona.

**¿Reemplaza MCP?** Expone capacidades del documento activo. Puede complementar integraciones MCP.

**¿El schema garantiza que la acción sea segura?** La app debe validar entradas, estado y permisos en código. Las annotations son señales para el agente.

**¿Compartir la sesión evita implementar autorización?** El backend debe seguir autorizando cada operación.

**¿Reporting out-of-band ya es una API que puedo activar?** El artículo de André Bandarra plantea una propuesta. Hoy puedes instrumentar tus herramientas y flujos con tu telemetría habitual.

**¿Qué cambió respecto a mi charla anterior?** La API vigente usa `document.modelContext`, el registro acepta `AbortSignal`, el contenido separa implementación disponible y propuestas, y el demo incorpora revisión humana para finalizar.

## Fuentes primarias

- [Documentación de Chrome](https://developer.chrome.com/docs/ai/webmcp)
- [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api)
- [API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api)
- [Seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools)
- [Guía de herramientas JavaScript](https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools)
- [Borrador de especificación](https://webmachinelearning.github.io/webmcp/)
- [WebMCP Types](https://github.com/webmachinelearning/webmcp-types)
- [Skill oficial de desarrollo](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md)
- [Propuesta de feedback fuera del flujo del agente](https://bandarra.me/posts/webmcp-feedback-loop)

Los enlaces X compartidos no fueron accesibles durante la verificación. Las afirmaciones técnicas se apoyan en las fuentes primarias anteriores. Los ejemplos de Aisle, Alza y Roque Nights proceden del texto de LinkedIn aportado en la conversación.
