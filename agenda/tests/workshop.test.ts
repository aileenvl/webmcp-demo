import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgenda } from '../src/agenda.js';
import { createToolRegistry, defineTools, type NativeContext, type Tool } from '../src/tools.js';
import { stages } from '../taller/checkpoints.js';

type Agenda = ReturnType<typeof createAgenda>;
function checkpoint(id: number, agenda: Agenda): Tool[] {
  const stage = stages.find(item => item.id === id);
  assert.ok(stage, `Falta el checkpoint ${id}`);
  return stage.defineTools(agenda);
}
async function call(tools: Tool[], name: string, input: unknown, signal = new AbortController().signal) {
  const tool = tools.find(item => item.name === name);
  assert.ok(tool, `Falta la herramienta ${name}`);
  return tool.execute(input as Record<string, unknown>, { signal });
}
async function result(tools: Tool[], name: string, input: unknown) {
  return JSON.parse(String(await call(tools, name, input))) as { ok: boolean; code: string; message?: string };
}
const names = (tools: Tool[]) => tools.map(tool => tool.name).sort();

// Comprueba el adaptador del taller con un doble de prueba, no Chrome real.
function nativeDouble() {
  const definitions = new Map<WebMCP.RegisteredTool, Tool>();
  const signals: AbortSignal[] = [];
  const context: NativeContext = {
    async registerTool(tool: Tool, options?: WebMCP.ModelContextRegisterToolOptions) {
      assert.ok(options?.signal, 'Cada checkpoint necesita una señal de registro');
      const registered: WebMCP.RegisteredTool = {
        name: tool.name, title: tool.title ?? tool.name, description: tool.description,
        inputSchema: tool.inputSchema, window: {} as Window, origin: 'http://localhost:5173',
      };
      const signal = options.signal;
      signals.push(signal);
      definitions.set(registered, tool);
      signal.addEventListener('abort', () => definitions.delete(registered), { once: true });
    },
    async getTools() { return [...definitions.keys()]; },
    async executeTool(registered, input, options) {
      const definition = definitions.get(registered);
      assert.ok(definition, 'La llamada usa el objeto descubierto en el checkpoint actual');
      return String(await definition.execute(input as Record<string, unknown>, {
        signal: options?.signal ?? new AbortController().signal,
      }));
    },
  };
  return { context, definitions, signals };
}

test('los seis checkpoints son únicos y registran sólo las capacidades construidas', () => {
  assert.deepEqual(stages.map(stage => stage.id), [0, 1, 2, 3, 4, 5]);
  const agenda = createAgenda();
  assert.deepEqual(stages.map(stage => stage.defineTools(agenda).length), [0, 1, 2, 2, 3, 4]);
  agenda.add({ sessionId: 'webmcp' });
  agenda.select({ sessionId: 'webmcp' });
  assert.deepEqual(stages.map(stage => stage.defineTools(agenda).length), [0, 1, 2, 2, 4, 5]);
  agenda.prepareConfirmation();
  agenda.confirm();
  assert.deepEqual(stages.map(stage => stage.defineTools(agenda).length), [0, 1, 2, 2, 3, 4]);
});

test('checkpoint 0 conserva la app humana sin registrar herramientas', async () => {
  const agenda = createAgenda();
  const native = nativeDouble();
  const registry = createToolRegistry(native.context);
  await registry.sync(checkpoint(0, agenda), 'paso-0');
  assert.deepEqual(await registry.list(), []);
  assert.equal(native.signals.length, 0);
  assert.equal(agenda.add({ sessionId: 'webmcp' }).code, 'ADDED');
  assert.equal(agenda.snapshot().agenda.length, 1);
  await assert.rejects(registry.call('listar_sesiones', {}), /no disponible/);
});

test('checkpoint 1 lee estado actual sin mutarlo ni ofrecer escritura', async () => {
  const agenda = createAgenda();
  const tools = checkpoint(1, agenda);
  assert.deepEqual(names(tools), ['listar_sesiones']);
  assert.equal(tools[0]!.annotations?.readOnlyHint, true);
  const before = agenda.snapshot();
  assert.equal((await result(tools, 'listar_sesiones', {})).code, 'STATE');
  assert.deepEqual(agenda.snapshot(), before);
  agenda.add({ sessionId: 'webmcp' });
  const state = JSON.parse(String(await call(tools, 'listar_sesiones', {}))) as { agenda: unknown[] };
  assert.equal(state.agenda.length, 1, 'La lectura no captura un snapshot antiguo');
});

test('checkpoint 2 ilustra una respuesta vaga sin debilitar reglas de negocio', async () => {
  const agenda = createAgenda();
  const tools = checkpoint(2, agenda);
  assert.equal(await call(tools, 'agregar_sesion', { sessionId: 'webmcp' }), 'Listo.');
  assert.equal(agenda.snapshot().agenda.length, 1);
  assert.equal(await call(tools, 'agregar_sesion', { sessionId: 'webmcp' }), 'Listo.');
  assert.equal(await call(tools, 'agregar_sesion', { sessionId: 'tipos' }), 'Listo.');
  assert.equal(agenda.snapshot().agenda.length, 1, 'La respuesta ambigua no duplica ni permite conflictos');
});

test('checkpoint 3 corrige el resultado: distingue alta, reintento y conflicto recuperable', async () => {
  const agenda = createAgenda();
  const tools = checkpoint(3, agenda);
  assert.equal((await result(tools, 'agregar_sesion', { sessionId: 'webmcp' })).code, 'ADDED');
  assert.equal((await result(tools, 'agregar_sesion', { sessionId: 'webmcp' })).code, 'ALREADY_ADDED');
  const conflict = await result(tools, 'agregar_sesion', { sessionId: 'tipos' });
  assert.equal(conflict.ok, false);
  assert.equal(conflict.code, 'TIME_CONFLICT');
  assert.match(conflict.message ?? '', /accesibilidad/);
  assert.equal(agenda.snapshot().agenda.length, 1);
  assert.equal((await result(tools, 'agregar_sesion', { sessionId: 'accesibilidad' })).code, 'ADDED');
  assert.equal(agenda.snapshot().agenda.length, 2);
  assert.equal((await result(tools, 'agregar_sesion', { sessionId: 'webmcp', extra: true })).code, 'INVALID_INPUT');
});

test('checkpoint 4 añade selección y retira edición al salir del contexto', async () => {
  const agenda = createAgenda();
  const registry = createToolRegistry(undefined);
  agenda.add({ sessionId: 'webmcp' });
  agenda.add({ sessionId: 'accesibilidad' });
  await registry.sync(checkpoint(4, agenda), 'sin-seleccion');
  assert.equal((await registry.list()).length, 3);
  await registry.call('seleccionar_sesion', { sessionId: 'webmcp' });
  const captured = checkpoint(4, agenda);
  await registry.sync(captured, 'webmcp');
  assert.equal((await registry.list()).length, 4);
  const edited = JSON.parse(String(await registry.call('editar_sesion_seleccionada', { title: 'WebMCP en JSConfMX' }))) as { code: string };
  assert.equal(edited.code, 'EDITED');
  assert.equal(agenda.snapshot().agenda[0]!.title, 'WebMCP en JSConfMX');
  agenda.select({ sessionId: 'accesibilidad' });
  assert.equal((await result(captured, 'editar_sesion_seleccionada', { title: 'No debe editar' })).code, 'STALE_SELECTION');
  assert.equal(agenda.snapshot().agenda[1]!.title, 'Accesibilidad que se siente');
  agenda.select({ sessionId: null });
  await registry.sync(checkpoint(4, agenda), 'sin-seleccion');
  assert.equal((await registry.list()).length, 3);
  await assert.rejects(registry.call('editar_sesion_seleccionada', { title: 'Ausente' }), /no disponible/);
});

test('checkpoint 5 sólo prepara revisión y conserva la confirmación en la UI humana', async () => {
  const agenda = createAgenda();
  agenda.add({ sessionId: 'webmcp' });
  const tools = checkpoint(5, agenda);
  assert.deepEqual(names(tools), names(defineTools(agenda)));
  assert.equal((await result(tools, 'preparar_confirmacion', {})).code, 'CONFIRMATION_REQUIRED');
  assert.equal(agenda.snapshot().confirmationPending, true);
  assert.equal(agenda.snapshot().finalized, false);
  agenda.cancelConfirmation();
  assert.equal(agenda.snapshot().confirmationPending, false);
  assert.equal(agenda.confirm().code, 'NO_CONFIRMATION');
  await result(tools, 'preparar_confirmacion', {});
  agenda.confirm();
  assert.equal(agenda.snapshot().finalized, true);
  assert.deepEqual(names(checkpoint(5, agenda)), names(defineTools(agenda)));
  assert.equal((await result(tools, 'agregar_sesion', { sessionId: 'accesibilidad' })).code, 'AGENDA_FINALIZED');
});

test('cambiar de checkpoint aborta registros previos y volver a 0 deja cero herramientas', async () => {
  const agenda = createAgenda();
  const native = nativeDouble();
  const registry = createToolRegistry(native.context);
  await registry.sync(checkpoint(1, agenda), 'paso-1');
  const firstSignal = native.signals[0]!;
  assert.equal(native.definitions.size, 1);
  await registry.sync(checkpoint(3, agenda), 'paso-3');
  assert.equal(firstSignal.aborted, true);
  assert.equal(native.definitions.size, 2);
  assert.equal(JSON.parse(String(await registry.call('agregar_sesion', { sessionId: 'webmcp' }))).code, 'ADDED');
  agenda.select({ sessionId: 'webmcp' });
  await registry.sync(checkpoint(4, agenda), 'paso-4-webmcp');
  assert.equal(native.definitions.size, 4);
  await registry.sync(checkpoint(0, agenda), 'paso-0');
  assert.equal(native.definitions.size, 0);
  assert.ok(native.signals.every(signal => signal.aborted));
  assert.deepEqual(await registry.list(), []);
});
