# Evidencia de verificación

Verificado el **29 octubre 2026 UTC** en el proyecto nuevo. Fuentes de API consultadas el 28 octubre.

## Herramientas de desarrollo

- Node 20.20.1, npm 10.8.2.
- Dependencias exactas fijadas en package-lock.json; instalación desde registry.npmjs.org.
- `npm run check`: **20 pruebas aprobadas**, TypeScript estricto y build Vite aprobado.
- Build: 6 módulos; JavaScript ~16.9 kB y CSS ~6.6 kB antes de gzip. Sin librerías de UI, fuentes, imágenes remotas ni SDK de IA.

## Pruebas automatizadas

Ocho pruebas de dominio y doce del registro/adaptador:

- Fixture vacío; snapshot no permite modificar el estado interno.
- Alta idempotente; conflicto sin mutación y alternativa concreta.
- Validación de IDs, null, arrays, primitivos, campos extra, títulos vacíos y longitud.
- Selección válida y edición contextual; referencias antiguas no editan otra selección.
- Herramienta de revisión sin confirmación; cancelar no finaliza; editar invalida revisión.
- Confirmación idempotente; finalización bloquea cambios; reapertura y reset.
- Registro 4 → 5 → 4, señales y retirada de registros.
- `getTools` seguido de `executeTool` con objeto descubierto y argumentos objeto.
- Cancelar durante descubrimiento impide mutar después del reset.
- Dispose antes y durante registro no resucita herramientas; limpieza de fallo parcial.

Los tests nativos usan un doble de prueba. La evidencia real del navegador se detalla abajo.

## Chrome real: integración nativa

Chrome **156.0.8078.49**, macOS, http://127.0.0.1:5173. Se observaron contexto seguro y las tres funciones nativas presentes. **No se modificaron flags ni se instalaron extensiones.**

Recorrido realizado por los controles de la interfaz, con resultados vistos en DOM y captura visual:

1. Registro nativo: cuatro herramientas descubiertas.
2. `listar_sesiones({})` → STATE, catálogo de tres sesiones, agenda vacía.
3. `agregar_sesion({sessionId:"webmcp"})` → ADDED, UI con una sesión.
4. Repetición → ALREADY_ADDED, sin segunda sesión.
5. `agregar_sesion({sessionId:"tipos"})` → TIME_CONFLICT, sugiere accesibilidad; agenda sin cambio.
6. Agregar accesibilidad → ADDED, dos sesiones contiguas.
7. Seleccionar WebMCP → SELECTED y cinco herramientas en el registro real.
8. Editar título → EDITED y nuevo texto en la UI.
9. Quitar selección mediante botón → cuatro herramientas; edición retirada.
10. Preparar revisión → CONFIRMATION_REQUIRED, UI aún Borrador.
11. Cancelar → revisión oculta, agenda editable.
12. Preparar otra vez y confirmar mediante botón → Finalizada · local; controles de mutación bloqueados.
13. Reabrir → Borrador. Reiniciar → cero sesiones, cuatro herramientas.
14. JSON inválido → INSPECTOR_ERROR visible; usar un ejemplo permite continuar.

El inspector usa `getTools()` y `executeTool()` reales, sin sustituir document.modelContext.

La consola observada no mostró errores de la app. Aparecieron avisos de una extensión preexistente del perfil Chrome, procedentes de chrome-extension://, ajena a este proyecto. No se alteró el perfil para eliminarlos.

## Cliente WebMCP del navegador integrado

Como comprobación adicional, el navegador integrado expuso las herramientas de la página mediante su capacidad WebMCP. Se ejecutó el descubrimiento de sus herramientas y una llamada externa al inspector `agregar_sesion` con sessionId webmcp. El resultado fue ADDED y la UI pasó a una sesión. Esto verifica un cliente compatible en este entorno; no garantiza que otros agentes o perfiles tengan la misma integración. No se evaluó una conversación autónoma de varias etapas con un modelo.

## Simulador separado

Se abrió `/?modo=simulador`: rótulo “Simulador local (no WebMCP nativo)”, “Llamadas JavaScript directas” y resultados “JS directo · simulador”. Alta y selección funcionaron, con registro didáctico de cuatro a cinco herramientas. Nunca se inyectó una propiedad en document.modelContext.

## Versión compilada

Se detuvo Vite y se sirvió exclusivamente `dist/` con `python3 -m http.server 5173 --bind 127.0.0.1 --directory dist`. La página volvió a registrar cuatro herramientas nativas y una llamada agregar_sesion devolvió ADDED con la sesión visible en UI. Este es el mismo contenido compilado incluido en el ZIP.

## Límites de la comprobación

- La ruta nativa se probó en Chrome 156 y en el navegador integrado disponible, ambos con soporte. No se instaló otro navegador para forzar ausencia de API.
- El estado sin API tiene inspector deshabilitado por detección; fue revisado en código, no observado en un navegador sin soporte.
- Verificación visual de escritorio, etiquetas de formulario, jerarquía de encabezados y mensajes de estado; sin auditoría WCAG completa ni prueba con lector de pantalla.
- Sin prueba de extensiones de terceros, descarga de modelos, claves API, permisos persistentes, cuentas o red externa.
- No es una prueba de interoperabilidad de todos los navegadores. La propuesta y sus APIs siguen evolucionando.
