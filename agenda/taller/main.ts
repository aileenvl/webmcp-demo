import { createAgenda, type AgendaResult } from '../src/agenda.js';
import { createToolRegistry } from '../src/tools.js';
import { stages } from './checkpoints.js';
import { defineTools as exerciseTools, id as exerciseId } from './pasos/ejercicio.js';
import exerciseSource from './pasos/ejercicio.ts?raw';
import './taller.css';
import '../src/style.css';

const appUrl = `${import.meta.env.BASE_URL}index.html`;
const workshopUrl = `${import.meta.env.BASE_URL}taller/index.html`;
const query = new URLSearchParams(location.search);
const isExercise = query.get('paso') === 'ejercicio';
const stage = stages.find(s => s.id === Number(query.get('paso') ?? '0')) ?? stages[0];
const stageId = isExercise ? exerciseId : stage.id;
const defineTools = isExercise ? exerciseTools : stage.defineTools;
const stageSources = import.meta.glob<string>('./pasos/0*.ts', { query: '?raw', import: 'default' });

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const simulated = new URLSearchParams(location.search).get('modo') === 'simulador';
const native = document.modelContext;
const supported = !!native && typeof native.registerTool === 'function' && typeof native.getTools === 'function' && typeof native.executeTool === 'function';
const enabled = simulated || supported;
const route = simulated ? 'Simulador local (no WebMCP nativo)' : supported ? 'Inspector WebMCP nativo · manual, sin LLM' : 'WebMCP nativo no disponible';
const registry = createToolRegistry(!simulated && supported ? native : undefined);
let ready = false;
let renderNumber = 0;
let invocation = 0;
let registryFailed = false;
let pendingCall: AbortController | undefined;
const agenda = createAgenda(() => { if (ready) void render(); });

$('app').innerHTML = `
<header><a class="brand" href="${appUrl}">a<span>↗</span>genda</a><p>JSConfMX · Aileen Villanueva<br><span>29 octubre 2026 · sesiones ficticias</span></p><button id="reset" class="quiet">↺ Reiniciar demo</button></header>
<main>
  <section class="workshop-nav"><p class="eyebrow">TALLER DE CONSTRUCCIÓN · CHECKPOINT ${stageId}</p><h1>${escape(isExercise ? 'Ejercicio editable' : stage.title)}</h1><nav aria-label="Checkpoints">${stages.map(s => `<a href="${workshopUrl}?paso=${s.id}${simulated ? '&modo=simulador' : ''}" ${!isExercise && s.id === stage.id ? 'aria-current="step"' : ''}>${s.id} · ${escape(s.title)}</a>`).join('')}<a href="${workshopUrl}?paso=ejercicio${simulated ? '&modo=simulador' : ''}" ${isExercise ? 'aria-current="step"' : ''}>✎ Ejercicio</a><a href="${appUrl}">App final ↗</a></nav><p>Cambiar checkpoint recarga y reinicia la agenda. Para editar en vivo: <code>taller/pasos/ejercicio.ts</code>. La app final en <code>${appUrl}</code> se conserva.</p><details><summary>Ver el código de este checkpoint</summary><pre id="checkpoint-source"></pre></details><p id="checkpoint-note">${stageId === 2 ? 'Ejercicio deliberado: agregar_sesion devuelve «Listo.» aunque haya conflicto. Las reglas de datos siguen activas. Se corrige en el paso 3.' : stageId === 0 ? 'App normal: ningún contrato ni callback se registra como herramienta.' : 'Publicamos capacidades pequeñas y conservamos las reglas normales de la app.'}</p></section>
  <section class="intro"><div><p class="eyebrow">WEBMCP / DEMO EN VIVO</p><h2>Construir, probar, explicar.</h2><p class="lead">Las personas usan botones. Los agentes pueden descubrir herramientas.<br>Ambos comparten la misma lógica y la misma agenda.</p></div><div class="concept"><span>UI humana</span><b>↘</b><strong>Funciones de la app</strong><b>↗</b><span>Herramientas</span></div></section>
  <div class="mode" id="mode" role="status"><span class="dot"></span><strong>${route}</strong><span id="mode-note">${stageId === 0 ? 'Sin herramientas registradas: sólo funciona la UI humana.' : simulated ? 'Llamadas JavaScript directas para ensayar.' : supported ? 'Registro y llamadas reales mediante document.modelContext.' : 'Puedes usar la app y activar el simulador para practicar.'}</span><a id="switch-mode" href="${workshopUrl}?paso=${isExercise ? 'ejercicio' : stage.id}${simulated ? '' : '&modo=simulador'}">${simulated ? 'Comprobar modo nativo' : 'Usar simulador'}</a></div>
  <div class="workspace">
    <section class="human"><div class="section-heading"><span class="step">01</span><div><h2>Tu agenda</h2><p>La interfaz que ve la persona</p></div><span class="badge" id="agenda-status">Borrador</span></div>
      <h3>Catálogo de ejemplo</h3><div id="catalog"></div>
      <div class="subheading"><h3>Mi selección</h3><span id="count">0 sesiones</span></div><div id="agenda"></div>
      <form id="edit-form" hidden><label for="title">Título local de la sesión seleccionada</label><div class="row"><input id="title" maxlength="80" required /><button>Guardar título</button></div></form>
      <div class="row actions"><button id="prepare" class="primary">Revisar agenda</button><button id="clear" class="quiet">Quitar selección</button><button id="reopen" class="quiet" hidden>Reabrir agenda</button></div>
      <div id="review" class="review" hidden><h3>¿Confirmas esta agenda ficticia?</h3><p id="review-summary"></p><p>Se marca como finalizada sólo en memoria. No reserva lugares ni envía datos.</p><div class="row"><button id="confirm" class="primary">Confirmar agenda</button><button id="cancel" class="quiet">Cancelar</button></div></div>
      <p id="feedback" class="feedback" role="status" aria-live="polite">Empieza añadiendo una sesión o llamando una herramienta.</p>
    </section>
    <section class="inspector"><div class="section-heading"><span class="step">02</span><div><h2>Herramientas a la vista</h2><p id="inspector-subtitle">${simulated ? 'Simulador didáctico · sin navegador WebMCP' : 'Inspector manual · sin agente ni modelo de IA'}</p></div><span class="badge" id="tool-count">— tools</span></div>
      <p class="hint">${stageId >= 4 ? 'Observa el registro: editar_sesion_seleccionada sólo existe cuando seleccionas una sesión editable.' : stageId === 0 ? 'Todavía no registramos herramientas. La app humana ya funciona.' : 'Compara el código, ejecuta la herramienta y observa su efecto en la app.'}</p>
      <div id="registry" class="registry" aria-live="polite"></div>
      <form id="tool-form"><label for="tool">Herramienta</label><select id="tool" ${enabled ? '' : 'disabled'}></select><label for="input">Entrada JSON</label><textarea id="input" rows="3" spellcheck="false" ${enabled ? '' : 'disabled'}>{}</textarea><div class="presets"><span>Ejemplos:</span><button type="button" data-example="add">Añadir WebMCP</button><button type="button" data-example="conflict">Provocar conflicto</button><button type="button" data-example="select">Seleccionar</button><button type="button" data-example="edit">Editar</button><button type="button" data-example="review">Revisar</button></div><button id="execute" class="primary" ${enabled ? '' : 'disabled'}>Ejecutar herramienta</button></form>
      <details id="schema-details"><summary>Ver descripción y JSON Schema</summary><pre id="schema"></pre></details>
      <div class="subheading"><h3>Última llamada</h3><span id="last-route">Esperando</span></div><pre id="result" aria-live="polite">El resultado estructurado aparecerá aquí.</pre>
    </section>
  </div>
  <section class="explain"><span class="step">03</span><div><h2>Qué estás viendo</h2><p><code>registerTool</code> publica nombre, descripción, esquema y función. <code>getTools</code> descubre el registro. <code>executeTool</code> llama una herramienta. El navegador no incorpora un LLM por registrar herramientas.</p><p>Este demo usa la API imperativa. La API declarativa añade anotaciones a formularios HTML; no se implementa aquí. WebMCP sigue siendo una propuesta en evolución.</p></div></section>
</main><footer>Todo es local y temporal. Recargar o «Reiniciar demo» vuelve al inicio. <a href="https://developer.chrome.com/docs/ai/webmcp/imperative-api" target="_blank" rel="noreferrer">API oficial de Chrome ↗</a></footer>`;

function show(result: AgendaResult) {
  $('feedback').textContent = `${result.ok ? '✓' : '↳'} ${result.message}`;
  $('feedback').dataset.ok = String(result.ok);
}
const human = (action: () => AgendaResult) => { show(action()); };
function showSchema() {
  const definition = defineTools(agenda).find(t => t.name === $<HTMLSelectElement>('tool').value);
  $('schema').textContent = definition ? JSON.stringify({ description: definition.description, inputSchema: definition.inputSchema }, null, 2) : 'No disponible.';
}
function preset(name: string, input: object) {
  const select = $<HTMLSelectElement>('tool');
  if (![...select.options].some(option => option.value === name)) {
    show({ ok: false, code: 'NOT_AVAILABLE', message: 'Esta herramienta aún no existe en este checkpoint. Avanza de etapa o, para editar, selecciona una sesión.' });
    return;
  }
  select.value = name;
  $<HTMLTextAreaElement>('input').value = JSON.stringify(input, null, 2);
  showSchema();
}
async function render() {
  const number = ++renderNumber;
  const state = agenda.snapshot();
  $('agenda-status').textContent = state.finalized ? 'Finalizada · local' : 'Borrador';
  $('count').textContent = `${state.agenda.length} ${state.agenda.length === 1 ? 'sesión' : 'sesiones'}`;
  $('catalog').innerHTML = state.catalog.map(s => `<article class="session"><div class="time">${s.start}<span>${s.end}</span></div><div><h4>${escape(s.title)}</h4><code>${s.id}</code></div><button data-add="${s.id}" ${state.finalized ? 'disabled' : ''}>${state.agenda.some(a => a.id === s.id) ? 'Añadida ✓' : '+ Añadir'}</button></article>`).join('');
  $('agenda').innerHTML = state.agenda.length ? state.agenda.map(s => `<button class="agenda-item ${state.selectedId === s.id ? 'selected' : ''}" data-select="${s.id}" aria-pressed="${state.selectedId === s.id}" ${state.finalized ? 'disabled' : ''}><span>${s.start} — ${s.end}</span><strong>${escape(s.title)}</strong><em>${state.selectedId === s.id ? 'Seleccionada ●' : 'Seleccionar →'}</em></button>`).join('') : '<p class="empty">Tu agenda está vacía.<br>Añade WebMCP para empezar.</p>';
  const selected = state.agenda.find(s => s.id === state.selectedId);
  $('edit-form').hidden = !selected || state.finalized;
  $<HTMLInputElement>('title').value = selected?.title ?? '';
  $<HTMLButtonElement>('prepare').disabled = state.finalized || !state.agenda.length;
  $<HTMLButtonElement>('clear').disabled = !state.selectedId || state.finalized;
  $('reopen').hidden = !state.finalized;
  $('review').hidden = !state.confirmationPending;
  $('review-summary').textContent = state.agenda.map(s => `${s.start} ${s.title}`).join(' · ');
  if (!enabled) { $('registry').textContent = 'No hay registro nativo disponible. Activa el simulador para ensayar.'; return; }
  try {
    await registry.sync(defineTools(agenda), `${state.selectedId}:${state.finalized}`);
    const list = await registry.list();
    if (number !== renderNumber) return;
    const select = $<HTMLSelectElement>('tool');
    const previous = select.value;
    select.innerHTML = list.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
    if (list.some(t => t.name === previous)) select.value = previous;
    else { select.value = 'listar_sesiones'; $<HTMLTextAreaElement>('input').value = '{}'; }
    $<HTMLButtonElement>('execute').disabled = !list.length || !!pendingCall;
    $<HTMLSelectElement>('tool').disabled = !list.length;
    document.querySelectorAll<HTMLButtonElement>('[data-example]').forEach(button => { button.disabled = !list.some(t => t.name === examples[button.dataset.example!][0]); });
    $('registry').innerHTML = list.length ? list.map(t => `<span class="tool-chip ${t.name.startsWith('editar') ? 'contextual' : ''}">${t.name}</span>`).join('') : '0 herramientas: usa los botones humanos de la izquierda.';
    $('tool-count').textContent = `${list.length} tools`;
    showSchema();
  } catch (error) {
    registryFailed = true;
    $('mode-note').textContent = `Falló el registro nativo: ${String(error)}. Puedes cambiar al simulador.`;
    $('registry').textContent = 'Registro no verificado. Consulta el mensaje de estado.';
    $<HTMLButtonElement>('execute').disabled = true;
  }
}

$('reset').onclick = () => { pendingCall?.abort(); pendingCall = undefined; invocation++; $('result').textContent = 'El resultado estructurado aparecerá aquí.'; $('last-route').textContent = 'Esperando'; human(agenda.reset); };
$('prepare').onclick = () => human(agenda.prepareConfirmation);
$('clear').onclick = () => human(() => agenda.select({ sessionId: null }));
$('reopen').onclick = () => human(agenda.reopen);
$('confirm').onclick = () => human(agenda.confirm);
$('cancel').onclick = () => human(agenda.cancelConfirmation);
$('catalog').onclick = event => { const button = (event.target as HTMLElement).closest<HTMLElement>('[data-add]'); if (button) human(() => agenda.add({ sessionId: button.dataset.add })); };
$('agenda').onclick = event => { const button = (event.target as HTMLElement).closest<HTMLElement>('[data-select]'); if (button) human(() => agenda.select({ sessionId: button.dataset.select })); };
$('edit-form').onsubmit = event => { event.preventDefault(); human(() => agenda.editSelected({ title: $<HTMLInputElement>('title').value })); };
$('tool').onchange = () => { $<HTMLTextAreaElement>('input').value = '{}'; showSchema(); };
const examples: Record<string, [string, object]> = {
  add: ['agregar_sesion', { sessionId: 'webmcp' }], conflict: ['agregar_sesion', { sessionId: 'tipos' }],
  select: ['seleccionar_sesion', { sessionId: 'webmcp' }], edit: ['editar_sesion_seleccionada', { title: 'WebMCP en JSConfMX' }],
  review: ['preparar_confirmacion', {}],
};
document.querySelectorAll<HTMLButtonElement>('[data-example]').forEach(button => { button.disabled = !enabled; button.onclick = () => preset(...examples[button.dataset.example!]); });
$('tool-form').onsubmit = async event => {
  event.preventDefault();
  if (pendingCall) return; // Un doble clic no dispara dos llamadas.
  const controller = new AbortController();
  pendingCall = controller;
  const id = ++invocation;
  const name = $<HTMLSelectElement>('tool').value;
  const button = $<HTMLButtonElement>('execute');
  button.disabled = true;
  try {
    const input: unknown = JSON.parse($<HTMLTextAreaElement>('input').value);
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('La entrada debe ser un objeto JSON.');
    const raw = await registry.call(name, input, controller.signal);
    let result: unknown = raw;
    if (typeof raw === 'string') { try { result = JSON.parse(raw); } catch { result = raw; } }
    if (id !== invocation) return;
    $('result').textContent = JSON.stringify(result, null, 2);
    $('last-route').textContent = simulated ? 'JS directo · simulador' : 'executeTool · nativo';
    if (result && typeof result === 'object' && 'message' in result) show(result as AgendaResult);
    await render();
  } catch (error) {
    if (id === invocation) { $('result').textContent = JSON.stringify({ ok: false, code: 'INSPECTOR_ERROR', message: String(error) }, null, 2); }
  } finally { if (pendingCall === controller) pendingCall = undefined; button.disabled = !!pendingCall || !enabled || registryFailed || !defineTools(agenda).length; }
};
window.addEventListener('pagehide', () => { pendingCall?.abort(); registry.dispose(); });
ready = true;
$('tool-count').textContent = `${defineTools(agenda).length} tools`;
void render();
const sourceLoader = stageSources[`./pasos/${stage.file}`];
void (isExercise ? Promise.resolve(exerciseSource) : sourceLoader()).then(source => {
  $('checkpoint-source').textContent = source.split('\n').map((line, i) => `${String(i + 1).padStart(2)}  ${line}`).join('\n');
});
