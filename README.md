# WebMCP · Charla, agenda y taller

Material en español de **Aileen Villanueva** para una sesión de **30 minutos**, actualizado el **29 de octubre de 2026**.

La presentación actual contiene **22 slides** y recorre cinco partes: **por qué WebMCP**, **qué es**, **dónde usarlo**, **MCP frente a WebMCP**, y **estado de la propuesta y cómo empezar hoy**. El demo principal es la **agenda compartida** con un taller de seis checkpoints. TacoAgent permanece como otro ejemplo en la página principal.

## Abrir la sesión

Requiere Node.js **20.19 o superior** y npm.

```sh
npm ci
npm run dev
```

Con el servidor en el puerto 3000:

| Material | Enlace |
| --- | --- |
| Presentación actual · 22 slides | [localhost:3000/slides/index.html](http://localhost:3000/slides/index.html) |
| Agenda completa · modo nativo | [localhost:3000/agenda/index.html](http://localhost:3000/agenda/index.html) |
| Taller · checkpoint 0 | [localhost:3000/agenda/taller/index.html?paso=0](http://localhost:3000/agenda/taller/index.html?paso=0) |
| Agenda · simulador local sin IA | [localhost:3000/agenda/index.html?modo=simulador](http://localhost:3000/agenda/index.html?modo=simulador) |
| Taller · simulador local sin IA | [localhost:3000/agenda/taller/index.html?paso=0&modo=simulador](http://localhost:3000/agenda/taller/index.html?paso=0&modo=simulador) |
| TacoAgent · otro ejemplo | [localhost:3000](http://localhost:3000) |

Si usas otro puerto, cambia sólo `3000` en esos enlaces. Las rutas estáticas terminan explícitamente en **`index.html`** para funcionar también en Next y en el despliegue. En las slides usa **←/→** para navegar, **G** para el índice, **N** para notas y fuentes y **F** para pantalla completa. Consulta el [guion de la presentación](docs/guion-presentacion.md).

## Demo principal: agenda compartida

La interfaz humana y las herramientas usan las mismas funciones y validaciones. La agenda contiene sesiones ficticias: no reserva lugares, envía datos ni persiste cambios fuera de la pestaña.

| Herramienta | Propósito |
| --- | --- |
| `listar_sesiones` | Consultar catálogo y agenda actuales |
| `agregar_sesion` | Añadir una sesión sin duplicados ni traslapes |
| `seleccionar_sesion` | Seleccionar una sesión de la agenda o quitar la selección |
| `editar_sesion_seleccionada` | Editar el título local, sólo mientras exista una selección editable |
| `preparar_confirmacion` | Abrir una revisión en la interfaz; la confirmación queda en el botón humano |

En la app final, observa **4 → 5 → 4 herramientas** al seleccionar y quitar la selección. Prueba un conflicto horario, revisa el resultado recuperable y confirma la agenda ficticia desde la interfaz. El inspector integrado permite llamadas manuales; no incorpora un LLM. El simulador se identifica expresamente y ejecuta JavaScript local, sin fingir una conexión WebMCP.

## Taller: construir la integración

El taller conserva la app humana y añade capacidades en seis etapas independientes:

| Checkpoint | Qué se construye |
| --- | --- |
| 0 | App humana funcionando, sin herramientas |
| 1 | Lectura del estado actual |
| 2 | Primera mutación; respuesta deliberadamente vaga para discutirla |
| 3 | Resultados claros: alta, reintento y conflicto recuperable |
| 4 | Herramienta de edición según la selección |
| 5 | Preparación de revisión y confirmación en la interfaz |

Cambia `paso=0` por `paso=1` hasta `paso=5` en la URL del taller. Cambiar de checkpoint recarga y reinicia la agenda. El ejercicio editable está en [`agenda/taller/pasos/ejercicio.ts`](agenda/taller/pasos/ejercicio.ts); cada checkpoint muestra su código. Consulta la [guía completa del taller](agenda/docs/TALLER.md) y el [README del demo de agenda](agenda/README.md).

Para desarrollar, verificar o volver a publicar el subproyecto:

```sh
cd agenda
npm ci
npm test
npm run typecheck
npm run publicar:next
```

`publicar:next` construye Vite con base `/agenda/` y copia el resultado a `public/agenda/`. Ese resultado compilado queda incluido en el repositorio: ejecutar la app Next no exige instalar las dependencias del taller. Las **28 pruebas** originales de la agenda y el taller se conservan; cubren reglas de negocio, cancelación, registros y los seis checkpoints.

## Probar WebMCP nativo

En un Chrome compatible, habilita `chrome://flags/#enable-webmcp-testing`, pulsa **Relaunch** y vuelve a localhost o HTTPS. La agenda detecta `document.modelContext` y requiere `registerTool`, `getTools` y `executeTool`; el indicador informa si está usando el navegador nativo o el simulador.

El [WebMCP Model Context Tool Inspector oficial](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd) también permite descubrir e invocar herramientas. Las llamadas manuales no requieren un modelo; su modo de lenguaje natural con Gemini necesita una API key propia. El soporte depende de la versión y configuración del navegador: consulta la [guía oficial vigente](https://developer.chrome.com/docs/ai/webmcp).

Los registros usan `document.modelContext.registerTool(tool, { signal })` y se retiran con `AbortController.abort()`. La API declarativa se explica en las slides y se puede ver en TacoAgent; la agenda implementa la API imperativa.

## Otro ejemplo: TacoAgent

En `/` se conserva la tienda ficticia TacoAgent: búsqueda declarativa, menú, carrito y revisión de pedidos. No hay cobros ni envíos reales. Sus herramientas son `searchRestaurants`, `getRestaurantInfo`, `addToCart`, `viewCart`, `clearCart` y `checkout`. El [guion del demo](docs/guion-demo.md#variante-opcional-tacoagent) incluye esta variante opcional.

## Verificación y fuentes

Para la app Next y TacoAgent:

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

La [nota de dependencias](docs/dependencias-2026-10-29.md) documenta las actualizaciones y alertas restantes. Las pruebas con adaptadores no sustituyen la verificación nativa en un navegador compatible.

- [Especificación WebMCP](https://webmachinelearning.github.io/webmcp/): borrador de Community Group, no estándar W3C publicado.
- [API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api) y [API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api).
- [Buenas prácticas](https://developer.chrome.com/docs/ai/webmcp/best-practices) y [seguridad](https://developer.chrome.com/docs/ai/webmcp/secure-tools).
- [Tipos TypeScript upstream](https://github.com/webmachinelearning/webmcp-types) y [skill de GoogleChromeLabs](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/webmcp-skills/skills/build-webmcp-tools/SKILL.md).
- [Closing the WebMCP Feedback Loop, André Cipriani Bandarra](https://bandarra.me/posts/webmcp-feedback-loop): propuestas de observabilidad, no una API de reporting ya desplegada.

[Repositorio del demo](https://github.com/aileenvl/webmcp-demo) · [Repositorio de la presentación](https://github.com/aileenvl/webmcp-presentation) · [Despliegue existente](https://webmcp-demo-ten.vercel.app). Una rama o PR no actualiza producción por sí sola; la versión pública depende del despliegue de Vercel.
