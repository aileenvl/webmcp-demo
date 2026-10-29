> Contrato del desarrollo original. La integración actual en `aileenvl/webmcp-demo` añade publicación estática bajo `/agenda/` por instrucción de Aileen; conserva las reglas del demo y su modo nativo/simulador.

# Contrato del demo

Proyecto nuevo, local y didáctico para Aileen Villanueva, JSConfMX, 29 octubre 2026.

- Agenda ficticia de tres sesiones; sin cuentas, reservas, datos personales ni red al usar la app.
- Funciones de negocio compartidas entre botones y herramientas.
- API imperativa actual: document.modelContext; registerTool con signal; getTools; executeTool.
- Herramienta de edición disponible únicamente con selección activa y agenda editable.
- Reintentos sin sesiones duplicadas; validación y error de conflicto recuperable.
- Preparar revisión no confirma. Confirmación final humana; cancelar, reabrir y resetear.
- Inspector nativo manual sin LLM. Simulador claramente rotulado y separado, sin suplantar API.
- Pruebas de lógica, ciclo de registro, validación, confirmación y UI; build TypeScript estricto.
- No publicar ni modificar sitios existentes. No cambiar flags o instalar extensiones sin autorización.
