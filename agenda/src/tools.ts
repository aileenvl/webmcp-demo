import type { createAgenda } from './agenda.js';

type Agenda = ReturnType<typeof createAgenda>;
export type Tool = WebMCP.ModelContextTool;
export type NativeContext = Pick<WebMCP.ModelContext, 'registerTool' | 'getTools' | 'executeTool'>;
const empty = { type: 'object', properties: {}, additionalProperties: false };
const isEmptyObject = (input: unknown) => input !== null && typeof input === 'object'
  && !Array.isArray(input) && Object.keys(input).length === 0;
const sessionInput = {
  type: 'object', properties: { sessionId: { type: 'string', enum: ['webmcp', 'tipos', 'accesibilidad'] } },
  required: ['sessionId'], additionalProperties: false,
};

// 1. Describe las acciones. UI y herramientas llaman al MISMO objeto agenda.
export function defineTools(agenda: Agenda): Tool[] {
  const tool = (name: string, description: string, inputSchema: object,
    action: (input: unknown) => unknown, readOnlyHint = false): Tool => ({
    name, description, inputSchema,
    annotations: { readOnlyHint, untrustedContentHint: true },
    execute: (input, { signal }) => {
      if (signal.aborted) return JSON.stringify({ ok: false, code: 'ABORTED', message: 'Llamada cancelada.' });
      // La API entrega texto. JSON mantiene códigos y datos fáciles de leer.
      return JSON.stringify(action(input));
    },
  });
  const tools = [
    tool('listar_sesiones', 'Lee el catálogo ficticio y la agenda actual. No modifica datos.', empty,
      input => isEmptyObject(input) ? { ok: true, code: 'STATE', ...agenda.snapshot() }
        : { ok: false, code: 'INVALID_INPUT', message: 'Envía un objeto vacío: {}.' }, true),
    tool('agregar_sesion', 'Agrega una sesión por ID. Repetirla no la duplica. Devuelve conflictos y una alternativa.', sessionInput, agenda.add),
    tool('seleccionar_sesion', 'Selecciona una sesión que ya está en tu agenda y habilita su herramienta de edición. null quita la selección.',
      { ...sessionInput, properties: { sessionId: { type: ['string', 'null'], enum: ['webmcp', 'tipos', 'accesibilidad', null] } } }, agenda.select),
    tool('preparar_confirmacion', 'Abre una revisión de la agenda. NO confirma: la persona debe pulsar Confirmar en la interfaz.', empty,
      input => isEmptyObject(input) ? agenda.prepareConfirmation()
        : { ok: false, code: 'INVALID_INPUT', message: 'Envía un objeto vacío: {}.' }),
  ];
  const { selectedId, finalized } = agenda.snapshot();
  if (selectedId && !finalized) {
    tools.push(tool('editar_sesion_seleccionada', `Cambia el título local de la sesión seleccionada (${selectedId}). Máximo 80 caracteres.`,
      { type: 'object', properties: { title: { type: 'string', minLength: 1, maxLength: 80 } }, required: ['title'], additionalProperties: false },
      input => agenda.snapshot().selectedId === selectedId && !agenda.snapshot().finalized
        ? agenda.editSelected(input)
        : { ok: false, code: 'STALE_SELECTION', message: 'La selección cambió. Descubre las herramientas otra vez.' }));
  }
  return tools;
}

// 2. El registro sigue la vida de la UI. Abort elimina una herramienta registrada.
// El signal de registro NO es el signal de una ejecución que ya está en curso.
export function createToolRegistry(context: NativeContext | undefined) {
  const controllers = new Map<string, AbortController>();
  let tools: Tool[] = [];
  let key = '';
  let queue = Promise.resolve();
  let disposed = false;
  return {
    sync(next: Tool[], lifecycleKey: string): Promise<void> {
      queue = queue.catch(() => {}).then(async () => {
        if (disposed || lifecycleKey === key) return;
        for (const controller of controllers.values()) controller.abort();
        controllers.clear();
        tools = [];
        // Si falla el registro, limpiamos lo parcial. Nunca fingimos éxito nativo.
        try {
          for (const definition of next) {
            const controller = new AbortController();
            controllers.set(definition.name, controller);
            if (context) await context.registerTool(definition, { signal: controller.signal });
            // pagehide puede ocurrir mientras registerTool espera al navegador.
            if (disposed) { controller.abort(); return; }
            tools.push(definition);
          }
          key = lifecycleKey;
        } catch (error) {
          for (const controller of controllers.values()) controller.abort();
          controllers.clear();
          tools = [];
          key = '';
          throw error;
        }
      });
      return queue;
    },
    async list() {
      await queue;
      return context ? (await context.getTools()).filter(t => tools.some(own => own.name === t.name)) : tools;
    },
    async call(name: string, input: object, signal = new AbortController().signal) {
      await queue;
      signal.throwIfAborted();
      if (context) {
        // 3. Inspector NATIVO: descubre el objeto real antes de invocarlo.
        const tool = (await context.getTools()).find(t => t.name === name && tools.some(own => own.name === name));
        signal.throwIfAborted();
        if (!tool) throw new Error('Herramienta no disponible. Actualiza el registro.');
        return context.executeTool(tool, input, { signal });
      }
      // Simulador didáctico separado: llamada JS directa, NO es WebMCP nativo.
      const tool = tools.find(t => t.name === name);
      if (!tool) throw new Error('Herramienta no disponible. Actualiza el registro.');
      return tool.execute(input as Record<string, unknown>, { signal });
    },
    dispose() { disposed = true; for (const controller of controllers.values()) controller.abort(); controllers.clear(); key = ''; tools = []; },
  };
}
