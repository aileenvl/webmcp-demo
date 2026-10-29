import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgenda } from '../src/agenda.js';

test('el fixture empieza vacío y no permite alterar el estado desde snapshot', () => {
  const app = createAgenda();
  const snapshot = app.snapshot();
  assert.deepEqual(snapshot.agenda, []);
  assert.equal(snapshot.catalog.length, 3);
  snapshot.catalog[0]!.title = 'alterado';
  assert.notEqual(app.snapshot().catalog[0]!.title, 'alterado');
});

test('añadir dos veces no duplica una sesión ni dispara otro cambio', () => {
  let changes = 0;
  const app = createAgenda(() => changes++);
  assert.equal(app.add({ sessionId: 'webmcp' }).code, 'ADDED');
  const revision = app.snapshot().revision;
  assert.equal(app.add({ sessionId: 'webmcp' }).code, 'ALREADY_ADDED');
  assert.equal(app.snapshot().agenda.length, 1);
  assert.equal(app.snapshot().revision, revision);
  assert.equal(changes, 1);
});

test('un traslape devuelve una alternativa y no cambia la agenda', () => {
  const app = createAgenda();
  app.add({ sessionId: 'webmcp' });
  const result = app.add({ sessionId: 'tipos' });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'TIME_CONFLICT');
  assert.match(result.message, /accesibilidad/);
  assert.equal(app.snapshot().agenda.length, 1);
  assert.equal(app.add({ sessionId: 'accesibilidad' }).ok, true);
});

test('valida entradas desconocidas, extras y límites de título', () => {
  const app = createAgenda();
  for (const input of [null, [], 'webmcp', {}, { sessionId: 1 }, { sessionId: 'no' }, { sessionId: 'webmcp', extra: true }]) {
    assert.equal(app.add(input).ok, false);
  }
  app.add({ sessionId: 'webmcp' });
  app.select({ sessionId: 'webmcp' });
  for (const input of [null, { title: '' }, { title: ' ' }, { title: 'x'.repeat(81) }, { title: 'ok', extra: true }]) {
    assert.equal(app.editSelected(input).ok, false);
  }
  assert.equal(app.editSelected({ title: '  Mi WebMCP  ' }).ok, true);
  assert.equal(app.snapshot().agenda[0]!.title, 'Mi WebMCP');
});

test('la edición sólo existe al seleccionar una sesión de la agenda', () => {
  const app = createAgenda();
  assert.equal(app.editSelected({ title: 'Nuevo' }).code, 'NO_SELECTION');
  assert.equal(app.select({ sessionId: 'webmcp' }).ok, false);
  app.add({ sessionId: 'webmcp' });
  assert.equal(app.select({ sessionId: 'webmcp' }).ok, true);
  assert.equal(app.snapshot().selectedId, 'webmcp');
  assert.equal(app.select({ sessionId: null }).ok, true);
  assert.equal(app.editSelected({ title: 'Nuevo' }).code, 'NO_SELECTION');
});

test('preparar no finaliza; cancelar deja la agenda editable', () => {
  const app = createAgenda();
  assert.equal(app.prepareConfirmation().code, 'EMPTY_AGENDA');
  app.add({ sessionId: 'webmcp' });
  assert.equal(app.prepareConfirmation().code, 'CONFIRMATION_REQUIRED');
  const revision = app.snapshot().revision;
  app.prepareConfirmation();
  assert.equal(app.snapshot().revision, revision);
  assert.equal(app.snapshot().finalized, false);
  assert.equal(app.snapshot().confirmationPending, true);
  app.cancelConfirmation();
  assert.equal(app.snapshot().confirmationPending, false);
  assert.equal(app.confirm().code, 'NO_CONFIRMATION');
  assert.equal(app.add({ sessionId: 'accesibilidad' }).ok, true);
});

test('editar invalida la revisión preparada y obliga a revisar otra vez', () => {
  const app = createAgenda();
  app.add({ sessionId: 'webmcp' });
  app.select({ sessionId: 'webmcp' });
  app.prepareConfirmation();
  app.editSelected({ title: 'Título cambiado' });
  assert.equal(app.snapshot().confirmationPending, false);
  assert.equal(app.confirm().code, 'NO_CONFIRMATION');
  app.prepareConfirmation();
  assert.equal(app.confirm().code, 'FINALIZED');
  const revision = app.snapshot().revision;
  assert.equal(app.confirm().code, 'ALREADY_FINALIZED');
  assert.equal(app.snapshot().revision, revision);
});

test('finalizar bloquea mutaciones hasta reabrir y reset restaura el fixture', () => {
  const app = createAgenda();
  app.add({ sessionId: 'webmcp' });
  app.select({ sessionId: 'webmcp' });
  app.prepareConfirmation();
  app.confirm();
  assert.equal(app.add({ sessionId: 'accesibilidad' }).code, 'AGENDA_FINALIZED');
  assert.equal(app.select({ sessionId: null }).code, 'AGENDA_FINALIZED');
  assert.equal(app.editSelected({ title: 'Nuevo' }).code, 'AGENDA_FINALIZED');
  assert.equal(app.cancelConfirmation().code, 'AGENDA_FINALIZED');
  app.reopen();
  assert.equal(app.snapshot().finalized, false);
  assert.equal(app.add({ sessionId: 'accesibilidad' }).ok, true);
  app.prepareConfirmation();
  app.reset();
  assert.deepEqual(app.snapshot().agenda, []);
  assert.equal(app.snapshot().selectedId, null);
  assert.equal(app.snapshot().confirmationPending, false);
  assert.equal(app.confirm().code, 'NO_CONFIRMATION');
});
