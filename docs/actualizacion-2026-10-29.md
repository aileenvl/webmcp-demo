# Adaptación de la charla · 29 de octubre de 2026

La sesión actual dura **30 minutos**, contiene **22 slides** y utiliza la **agenda compartida con su taller de seis checkpoints** como demo principal. Se integra el demo de agenda ya desarrollado; se conservan su lógica, validaciones, registro contextual, soluciones y ejercicios. TacoAgent queda disponible como ejemplo adicional de comercio y API declarativa.

## Hilo de las 22 slides

| Parte | Slides | Contenido |
| --- | --- | --- |
| Por qué nace WebMCP | 2–4 | Intención humana, acciones de una página y el ejemplo de reserva de Sarah |
| Qué es | 5–7 | Capacidades del documento, papel del navegador y APIs imperativa y declarativa |
| Para qué se usa | 8–10 | Casos concretos, herramientas según el contexto y el sandbox de PayPal |
| Cómo difiere de MCP | 11–12 | Servidores locales o remotos y capacidades de la página abierta; convivencia |
| Estado de la propuesta y empezar hoy | 13–20 | Soporte, contratos, registro dinámico, Types, Skill, DevTools, seguridad y feedback |

La slide 1 abre la charla; la 21 conduce el taller y la 22 propone un primer paso y abre preguntas. El [guion de la presentación](guion-presentacion.md) distribuye **17 minutos de explicación, 11 de taller y 2 de cierre**. Es una estimación para ensayar, no una presentación humana cronometrada.

## Demo central y taller

La app final se sirve en **`/agenda/index.html`** y el taller empieza en **`/agenda/taller/index.html?paso=0`**. Los checkpoints son independientes; navegar entre ellos reinicia la agenda:

1. **0 · App humana:** botones y reglas de negocio, con cero herramientas.
2. **1 · Lectura:** `listar_sesiones` devuelve el estado actual.
3. **2 · Mutación:** `agregar_sesion` conserva las reglas, pero devuelve una respuesta deliberadamente vaga.
4. **3 · Resultados:** distingue alta, reintento sin duplicados y conflicto recuperable.
5. **4 · Contexto:** selección y edición disponible sólo en su contexto válido.
6. **5 · Revisión:** `preparar_confirmacion` abre el resumen; la persona confirma en la interfaz.

En el checkpoint 4 hay **3 → 4 → 3** herramientas al seleccionar y quitar la selección. En el checkpoint 5 y la app final hay **4 → 5 → 4**. La diferencia es la incorporación de `preparar_confirmacion` en el último paso.

Las funciones compartidas validan IDs, entradas, horarios y selección. Agregar de nuevo una sesión conserva una sola entrada; un traslape devuelve una explicación y una alternativa. Modificar el borrador invalida la revisión preparada. No hay reservas, pagos, correos ni persistencia fuera de la pestaña.

El inspector integrado ofrece llamadas manuales mediante `document.modelContext`; no incorpora un LLM. El simulador, identificado expresamente, ejecuta funciones JavaScript sin reemplazar la API del navegador. La [guía del demo](guion-demo.md) contiene entradas y resultados para presentar; la [guía extensa del taller](../agenda/docs/TALLER.md) explica cada cambio de código.

## Material reciente incorporado

- **Sarah:** la reserva se explica con el mismo widget y objetivo por dos rutas. La comparación es didáctica, no un benchmark universal.
- **Registro dinámico:** los ejemplos Aisle, Alza y Roque Nights del texto de André aportado por Aileen muestran cuándo una herramienta tiene sentido y cómo coordinar su retirada. La agenda vuelve concreto ese principio con `editar_sesion_seleccionada`.
- **PayPal:** se conserva el alcance de su prueba interna pequeña en sandbox y la revisión del comprador. Las cifras del caso se presentan con sus límites en las slides y sus notas.
- **Types, Skill y DevTools:** se incluyen recursos actuales para desarrollar e inspeccionar contratos. Los tipos no añaden soporte al navegador y los hints no sustituyen validación o autorización.
- **Feedback:** el paso 2 permite observar una salida insuficiente y el paso 3 la corrige. El reporting fuera de banda del artículo de André se explica como propuesta; el resultado local del inspector es otra señal disponible en el demo.

La cobertura y atribución detalladas están en [Fuentes y cobertura](fuentes-y-cobertura.md) y en las notas de cada slide. Los enlaces de X y el enlace corto de LinkedIn no se recuperaron íntegramente: no se atribuye contenido supuesto a esos IDs. Los ejemplos de LinkedIn se apoyan en el texto aportado y en fuentes primarias.

## API y estado de la propuesta

La implementación usa **`document.modelContext`**, registro asíncrono con `registerTool(tool, { signal })`, descubrimiento con `getTools()` e invocación con `executeTool(tool, argumentos)`. La señal de registro permite retirar herramientas mediante `abort()`; retirar un registro no equivale a cancelar automáticamente una ejecución ya activa. Las funciones vuelven a validar el estado al recibir una llamada.

El documento publicado el **27 de octubre de 2026** es un **Draft Community Group Report**: WebMCP es una propuesta abierta en evolución y no un W3C Standard publicado ni un documento de Standards Track. La charla explica cómo probarlo hoy en un navegador compatible con ese estado real.

TacoAgent permanece en `/`, con su búsqueda declarativa y recorrido ficticio de carrito. Su `checkout` prepara una revisión y su confirmación ocurre por separado en la interfaz. Es una variante opcional de la demostración.

## Fuentes primarias

- [Especificación WebMCP](https://webmachinelearning.github.io/webmcp/).
- [Introducción de Chrome](https://developer.chrome.com/docs/ai/webmcp) y [comparación con MCP](https://developer.chrome.com/docs/ai/webmcp/compare-mcp).
- [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api) y [declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api).
- [Demo de Sarah Drasner](https://webmcp-demo-sdras.netlify.app/) y [código original](https://github.com/sdras/webmcp-demo).
- [Caso PayPal](https://developer.paypal.com/community/blog/WebMCP_PayPal_Agent_Ready/).
- [Seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools) y [DevTools WebMCP](https://developer.chrome.com/docs/devtools/application/webmcp).
- [Tipos upstream](https://github.com/webmachinelearning/webmcp-types) y [Skill de GoogleChromeLabs](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md).
- [Closing the WebMCP Feedback Loop, André Cipriani Bandarra](https://bandarra.me/posts/webmcp-feedback-loop).
