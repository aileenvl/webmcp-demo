import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgenda } from '../src/agenda.js';
import { createToolRegistry, defineTools, type NativeContext, type Tool } from '../src/tools.js';

async function execute(tools: Tool[], name: string, input: unknown, signal = new AbortController().signal) {
  const tool = tools.find(item => item.name === name);
  assert.ok(tool, `Falta ${name}`);
  // Evitamos el schema deliberadamente: también debe validar la lógica real.
  return JSON.parse(String(await tool.execute(input as Record<string, unknown>, { signal }))) as { ok: boolean; code: string };
}

// Doble de prueba del adaptador. No representa una integración con Chrome nativo.
function nativeDouble() {
  const definitions = new Map<WebMCP.RegisteredTool, Tool>();
  const registrations: { tool: Tool; signal: AbortSignal | undefined }[] = [];
  const calls: { tool: WebMCP.RegisteredTool; input: object | undefined; signal: AbortSignal | undefined }[] = [];
  let discoveries = 0;
  const context: NativeContext = {
    async registerTool(tool: Tool, options?: WebMCP.ModelContextRegisterToolOptions) {
      const registered: WebMCP.RegisteredTool = {
        name: tool.name, title: tool.title ?? tool.name, description: tool.description,
        inputSchema: tool.inputSchema, window: {} as Window, origin: 'http://localhost:5173',
      };
      registrations.push({ tool, signal: options?.signal });
      definitions.set(registered, tool);
      options?.signal?.addEventListener('abort', () => definitions.delete(registered), { once: true });
    },
    async getTools() { discoveries++; return [...definitions.keys()]; },
    async executeTool(tool, input, options) {
      calls.push({ tool, input, signal: options?.signal });
      const definition = definitions.get(tool);
      assert.ok(definition, 'executeTool debe recibir el objeto descubierto, no un nombre');
      return String(await definition.execute(input as Record<string, unknown>, { signal: options?.signal ?? new AbortController().signal }));
    },
  };
  return { context, registrations, calls, definitions, get discoveries() { return discoveries; } };
}

test('registro contextual: 4 herramientas, selección 5, quitar selección 4', async () => {
  const agenda = createAgenda();
  const registry = createToolRegistry(undefined);
  await registry.sync(defineTools(agenda), 'ninguna');
  assert.equal((await registry.list()).length, 4);
  agenda.add({ sessionId: 'webmcp' });
  agenda.select({ sessionId: 'webmcp' });
  await registry.sync(defineTools(agenda), 'webmcp');
  assert.equal((await registry.list()).length, 5);
  agenda.select({ sessionId: null });
  await registry.sync(defineTools(agenda), 'ninguna');
  assert.equal((await registry.list()).length, 4);
  await assert.rejects(registry.call('editar_sesion_seleccionada', { title: 'No debe pasar' }), /no disponible/);
});

test('una herramienta capturada no edita una selección diferente', async () => {
  const agenda = createAgenda();
  agenda.add({ sessionId: 'webmcp' });
  agenda.add({ sessionId: 'accesibilidad' });
  agenda.select({ sessionId: 'webmcp' });
  const captured = defineTools(agenda);
  agenda.select({ sessionId: 'accesibilidad' });
  assert.equal((await execute(captured, 'editar_sesion_seleccionada', { title: 'Incorrecto' })).code, 'STALE_SELECTION');
  assert.equal(agenda.snapshot().agenda[1]!.title, 'Accesibilidad que se siente');
});

test('ninguna herramienta puede confirmar; preparar sólo abre revisión humana', async () => {
  const agenda = createAgenda();
  const tools = defineTools(agenda);
  assert.deepEqual(tools.map(tool => tool.name), ['listar_sesiones', 'agregar_sesion', 'seleccionar_sesion', 'preparar_confirmacion']);
  await execute(tools, 'agregar_sesion', { sessionId: 'webmcp' });
  assert.equal((await execute(tools, 'preparar_confirmacion', {})).code, 'CONFIRMATION_REQUIRED');
  assert.equal(agenda.snapshot().finalized, false);
  assert.equal(agenda.snapshot().confirmationPending, true);
});

test('listar y preparar rechazan null, arrays, primitivos y campos extra sin lanzar', async () => {
  const agenda = createAgenda();
  agenda.add({ sessionId: 'webmcp' });
  const tools = defineTools(agenda);
  for (const name of ['listar_sesiones', 'preparar_confirmacion']) {
    for (const input of [null, undefined, [], 'texto', 7, true, { extra: true }]) {
      assert.equal((await execute(tools, name, input)).code, 'INVALID_INPUT');
    }
  }
  assert.equal(agenda.snapshot().confirmationPending, false);
  assert.equal((await execute(tools, 'listar_sesiones', {})).code, 'STATE');
});

test('llamada cancelada y entradas inválidas no modifican la agenda', async () => {
  const agenda = createAgenda();
  const tools = defineTools(agenda);
  const controller = new AbortController();
  controller.abort();
  assert.equal((await execute(tools, 'agregar_sesion', { sessionId: 'webmcp' }, controller.signal)).code, 'ABORTED');
  assert.equal((await execute(tools, 'agregar_sesion', { sessionId: 'webmcp', extra: true })).code, 'INVALID_INPUT');
  assert.equal(agenda.snapshot().agenda.length, 0);
});

test('adaptador nativo registra con signal y aborta el registro anterior al cambiar contexto', async () => {
  const native = nativeDouble();
  const agenda = createAgenda();
  const registry = createToolRegistry(native.context);
  await registry.sync(defineTools(agenda), 'ninguna');
  assert.equal(native.registrations.length, 4);
  for (const { signal } of native.registrations) assert.ok(signal && !signal.aborted);
  await registry.sync(defineTools(agenda), 'ninguna');
  assert.equal(native.registrations.length, 4, 'mismo contexto no duplica registros');
  agenda.add({ sessionId: 'webmcp' });
  agenda.select({ sessionId: 'webmcp' });
  await registry.sync(defineTools(agenda), 'webmcp');
  assert.ok(native.registrations.slice(0, 4).every(({ signal }) => signal?.aborted));
  assert.equal((await registry.list()).length, 5);
  registry.dispose();
  assert.ok(native.registrations.every(({ signal }) => signal?.aborted));
  assert.equal(native.definitions.size, 0);
  assert.equal((await registry.list()).length, 0);
  await assert.rejects(registry.call('listar_sesiones', {}), /no disponible/);
});

test('inspector nativo descubre el objeto real y usa executeTool(objeto, argumentos)', async () => {
  const native = nativeDouble();
  const agenda = createAgenda();
  const registry = createToolRegistry(native.context);
  await registry.sync(defineTools(agenda), 'ninguna');
  const input = { sessionId: 'webmcp' };
  const controller = new AbortController();
  const result = JSON.parse(String(await registry.call('agregar_sesion', input, controller.signal))) as { code: string };
  assert.equal(result.code, 'ADDED');
  assert.equal(native.discoveries, 1);
  assert.equal(native.calls.length, 1);
  assert.equal(native.calls[0]!.input, input);
  assert.equal(native.calls[0]!.signal, controller.signal);
  assert.ok(native.definitions.has(native.calls[0]!.tool));
  await registry.call('agregar_sesion', input);
  assert.equal(agenda.snapshot().agenda.length, 1);
});

test('dispose antes de empezar una sincronización impide registrar herramientas después', async () => {
  const native = nativeDouble();
  const registry = createToolRegistry(native.context);
  const pending = registry.sync(defineTools(createAgenda()), 'inicial');
  registry.dispose();
  await pending;
  assert.equal(native.registrations.length, 0);
  assert.equal((await registry.list()).length, 0);
});

test('dispose durante un registro pendiente elimina lo parcial y detiene los siguientes', async () => {
  const native = nativeDouble();
  const register = native.context.registerTool.bind(native.context);
  let release!: () => void;
  let entered!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const started = new Promise<void>(resolve => { entered = resolve; });
  native.context.registerTool = async (tool: Tool, options?: WebMCP.ModelContextRegisterToolOptions) => {
    await register(tool, options);
    entered();
    await gate;
  };
  const registry = createToolRegistry(native.context);
  const pending = registry.sync(defineTools(createAgenda()), 'inicial');
  await started;
  registry.dispose();
  release();
  await pending;
  assert.equal(native.registrations.length, 1);
  assert.equal(native.definitions.size, 0);
  assert.ok(native.registrations[0]!.signal?.aborted);
  assert.equal((await registry.list()).length, 0);
});

test('reset y abort mientras getTools espera impiden una mutación tardía', async () => {
  const native = nativeDouble();
  const discover = native.context.getTools.bind(native.context);
  let release!: () => void;
  let entered!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const started = new Promise<void>(resolve => { entered = resolve; });
  native.context.getTools = async () => { entered(); await gate; return discover(); };
  const agenda = createAgenda();
  const registry = createToolRegistry(native.context);
  await registry.sync(defineTools(agenda), 'inicial');
  const controller = new AbortController();
  const pending = registry.call('agregar_sesion', { sessionId: 'webmcp' }, controller.signal);
  await started;
  controller.abort();
  agenda.reset();
  release();
  await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(native.calls.length, 0);
  assert.equal(agenda.snapshot().agenda.length, 0);
});

test('un signal abortado antes de la llamada evita la mutación en el simulador', async () => {
  const agenda = createAgenda();
  const registry = createToolRegistry(undefined);
  await registry.sync(defineTools(agenda), 'inicial');
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(registry.call('agregar_sesion', { sessionId: 'webmcp' }, controller.signal), { name: 'AbortError' });
  assert.equal(agenda.snapshot().agenda.length, 0);
});

test('un error parcial de registro limpia señales y permite recuperar un contexto nuevo', async () => {
  const native = nativeDouble();
  const register = native.context.registerTool.bind(native.context);
  let fail = true;
  native.context.registerTool = async (tool: Tool, options?: WebMCP.ModelContextRegisterToolOptions) => {
    if (tool.name === 'seleccionar_sesion' && fail) throw new Error('Fallo de prueba');
    await register(tool, options);
  };
  const registry = createToolRegistry(native.context);
  await assert.rejects(registry.sync(defineTools(createAgenda()), 'inicial'), /Fallo de prueba/);
  assert.equal(native.definitions.size, 0);
  assert.ok(native.registrations.every(({ signal }) => signal?.aborted));
  fail = false;
  await registry.sync(defineTools(createAgenda()), 'recuperado');
  assert.equal((await registry.list()).length, 4);
});
