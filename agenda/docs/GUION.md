# Guion de práctica · 5–7 minutos

**Objetivo:** mostrar una página que ofrece funciones explícitas y comparte su estado con las personas. No hace falta afirmar experiencia previa ni fingir que el inspector es un agente.

## Antes de salir al escenario

- Ejecuta `npm ci`, `npm run check`, `npm run dev`.
- Abre http://127.0.0.1:5173 y comprueba **Inspector WebMCP nativo · manual, sin LLM** y **4 tools**.
- Si el registro falla, usa el simulador de forma explícita y di qué cambió.
- Aumenta zoom si el proyector lo necesita; la app se adapta a una sola columna.
- Deja abierta la terminal y pulsa “Reiniciar demo”. Los ejemplos sólo rellenan JSON: después pulsa “Ejecutar herramienta”.

## 0:00 · Presentar la idea

Di: “Voy a usar una agenda ficticia. A la izquierda está la app normal. A la derecha veo las herramientas que esta página registra. Este inspector es manual, sin un LLM; sirve para comprobar el contrato real de WebMCP.”

Si usas fallback, sustituye la última frase por: “Este navegador no tiene la API disponible. Voy a usar un simulador local de llamadas JavaScript; no es WebMCP nativo.”

## 0:40 · Descubrir

1. Deja `listar_sesiones` y entrada `{}`.
2. Pulsa **Ejecutar herramienta**.
3. Espera `ok: true`, `code: "STATE"`, catálogo con tres sesiones y `agenda: []`.

Di: “La herramienta tiene nombre, descripción y esquema. Un agente compatible podría descubrir estos mismos contratos. Aquí yo elijo cuál llamar.”

## 1:15 · Mutar con la misma lógica

1. Pulsa ejemplo **Añadir WebMCP** y después **Ejecutar herramienta**.
2. Espera `code: "ADDED"`; a la izquierda aparece “WebMCP paso a paso”, 10:00–10:30.
3. Ejecuta otra vez: `ALREADY_ADDED`, una sola sesión.

Di: “La llamada acaba de ejecutar `agenda.add`, la misma función del botón Añadir. Un reintento no duplica la sesión.”

## 2:00 · Error que permite continuar

1. Pulsa **Provocar conflicto** y **Ejecutar herramienta**.
2. La entrada es `{"sessionId":"tipos"}` (10:15–10:45).
3. Espera `ok: false`, `TIME_CONFLICT`, y sugerencia `accesibilidad` (10:30–11:00). La agenda queda igual.
4. Cambia la entrada a `{"sessionId":"accesibilidad"}` y ejecuta; debe devolver `ADDED`.

Di: “La app aplica una regla del dominio. El error cuenta qué ocurrió y propone una alternativa concreta. La interfaz y la herramienta respetan la misma regla.”

## 3:00 · Herramienta contextual

1. Pulsa ejemplo **Seleccionar** y **Ejecutar herramienta**.
2. Espera `SELECTED` y observa **5 tools**. Aparece `editar_sesion_seleccionada`.
3. Pulsa ejemplo **Editar** y **Ejecutar herramienta**: `EDITED`, título “WebMCP en JSConfMX” en la UI.
4. Pulsa el botón humano **Quitar selección**: vuelve a **4 tools**.

Di: “El registro cambia con el estado de la página. Al salir del contexto, retiro la herramienta con el AbortSignal del registro.”

## 4:15 · Control humano

1. Pulsa ejemplo **Revisar** y **Ejecutar herramienta**.
2. Espera `CONFIRMATION_REQUIRED` y revisión visible. La agenda aún está en borrador.
3. Pulsa **Cancelar**: la agenda sigue editable.
4. Vuelve a ejecutar la herramienta de revisión y pulsa **Confirmar agenda** en la UI.
5. Espera “Finalizada · local”. **Reabrir agenda** permite editar de nuevo.

Di: “La herramienta preparó la revisión. La persona confirma en la interfaz. Este ejemplo no expone una herramienta de confirmación ni hace reservas reales.”

## 5:30 · Enseñar el código

Abre `src/tools.ts`. Señala, sin leer todo el archivo:

- `name`: el verbo que puede descubrir un agente.
- `description`: para qué usarlo.
- `inputSchema`: qué entrada admite.
- `execute`: llamada a la función compartida de la app.
- `context.registerTool(definition, {signal: controller.signal})` y `controller.abort()`: ciclo del registro.

Cierra con: “WebMCP no crea un agente por sí solo. La página publica capacidades y conserva sus reglas, estado visible y controles humanos.”

## Recuperarte sin improvisar

| Situación | Acción y frase |
| --- | --- |
| WebMCP no disponible | Usa “Usar simulador”. “Voy a demostrar el contrato con llamadas JS directas; esta parte no es nativa.” |
| Entrada no válida | Corrige el JSON o usa un ejemplo. “También validamos las entradas al llegar a la lógica de negocio.” |
| No aparece Editar | Añade WebMCP y selecciónala. “Esta herramienta sólo existe dentro de ese contexto.” |
| Registro nativo falla | No lo declares exitoso. Cambia al simulador identificado o muestra el código y el guion. |
| Puerto ocupado | Detén el servidor anterior o comprueba qué app lo ocupa. No abras un puerto alternativo a ciegas. |
| Te pierdes en el estado | “Reiniciar demo” y vuelve a Añadir WebMCP. No depende de red ni de datos previos. |
| Se recarga la página | Todo vuelve al estado inicial, intencionalmente. |

## Prompts para un agente compatible, opcionales

Estos textos son peticiones de ejemplo, **no una función de chat integrada ni una prueba realizada con un LLM**:

1. “Consulta las sesiones ficticias y añade WebMCP a mi agenda.”
2. “Intenta añadir TypeScript. Si hay un conflicto, explícame la alternativa.”
3. “Selecciona WebMCP y cambia su título local a WebMCP en JSConfMX.”
4. “Prepara una revisión de mi agenda; yo confirmaré desde la página.”

El resultado concreto depende del agente, sus permisos y su compatibilidad con la implementación del navegador.
