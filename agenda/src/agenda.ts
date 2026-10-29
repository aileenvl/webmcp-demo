// 1. Toda la lógica de la agenda vive aquí. Botones y herramientas la comparten.
// No hay red ni persistencia: recargar o reset() recupera los datos ficticios.
export type Session = { id: string; title: string; start: string; end: string };
export type AgendaSnapshot = {
  catalog: Session[];
  agenda: Session[];
  selectedId: string | null;
  finalized: boolean;
  revision: number;
  confirmationPending: boolean;
};
export type AgendaResult = { ok: boolean; code: string; message: string };

const fixture: Session[] = [
  { id: 'webmcp', title: 'WebMCP paso a paso', start: '10:00', end: '10:30' },
  { id: 'tipos', title: 'TypeScript sin misterio', start: '10:15', end: '10:45' },
  { id: 'accesibilidad', title: 'Accesibilidad que se siente', start: '10:30', end: '11:00' },
];

// JSON Schema ayuda a describir entradas; esta validación protege la lógica real.
function field(input: unknown, key: string): unknown {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined;
  const record = input as Record<string, unknown>;
  return Object.keys(record).length === 1 && Object.hasOwn(record, key) ? record[key] : undefined;
}

export function createAgenda(onChange: () => void = () => {}) {
  let agenda: Session[] = [];
  let selectedId: string | null = null;
  let finalized = false;
  let revision = 0;
  let reviewedRevision: number | null = null;
  const result = (ok: boolean, code: string, message: string): AgendaResult => ({ ok, code, message });
  const locked = () => result(false, 'AGENDA_FINALIZED', 'La agenda está finalizada. Pulsa «Reabrir» antes de cambiarla.');
  function changed() {
    revision++;
    reviewedRevision = null; // Un cambio exige una nueva revisión humana.
    onChange();
  }

  return {
    snapshot(): AgendaSnapshot {
      return {
        catalog: fixture.map(session => ({ ...session })),
        agenda: agenda.map(session => ({ ...session })),
        selectedId, finalized, revision,
        confirmationPending: reviewedRevision === revision,
      };
    },

    add(input: unknown): AgendaResult {
      if (finalized) return locked();
      const sessionId = field(input, 'sessionId');
      if (typeof sessionId !== 'string') return result(false, 'INVALID_INPUT', 'Envía sólo {sessionId: "webmcp"}, "tipos" o "accesibilidad".');
      const session = fixture.find(item => item.id === sessionId);
      if (!session) return result(false, 'UNKNOWN_SESSION', 'No existe esa sesión. Consulta el catálogo y usa su id.');
      if (agenda.some(item => item.id === sessionId)) return result(true, 'ALREADY_ADDED', 'Esa sesión ya está en la agenda; no la duplicamos.');
      // HH:MM tiene orden lexicográfico porque todos los horarios son del mismo día.
      const conflict = agenda.find(item => session.start < item.end && item.start < session.end);
      if (conflict) {
        const alternatives = fixture.filter(candidate => !agenda.some(item => item.id === candidate.id || (candidate.start < item.end && item.start < candidate.end)));
        const suggestion = alternatives.length ? ` Prueba ${alternatives.map(item => `"${item.id}" (${item.start}–${item.end})`).join(' o ')}.` : ' Conserva la agenda actual o reinicia el ejemplo.';
        return result(false, 'TIME_CONFLICT', `"${session.title}" se cruza con "${conflict.title}" (${conflict.start}–${conflict.end}).${suggestion}`);
      }
      agenda.push({ ...session });
      agenda.sort((a, b) => a.start.localeCompare(b.start));
      changed();
      return result(true, 'ADDED', `Añadida: ${session.title}.`);
    },

    select(input: unknown): AgendaResult {
      if (finalized) return locked();
      const sessionId = field(input, 'sessionId');
      if (sessionId !== null && typeof sessionId !== 'string') return result(false, 'INVALID_INPUT', 'Envía sólo {sessionId: "id"} o {sessionId: null} para quitar la selección.');
      if (sessionId !== null && !agenda.some(item => item.id === sessionId)) return result(false, 'NOT_IN_AGENDA', 'Primero añade esa sesión a la agenda.');
      if (selectedId === sessionId) return result(true, 'ALREADY_SELECTED', 'La selección ya era esa.');
      selectedId = sessionId;
      changed();
      return result(true, 'SELECTED', sessionId ? 'Sesión seleccionada. Ahora está disponible la herramienta de edición.' : 'Selección eliminada. La herramienta de edición deja de estar disponible.');
    },

    editSelected(input: unknown): AgendaResult {
      if (finalized) return locked();
      if (!selectedId) return result(false, 'NO_SELECTION', 'Selecciona una sesión de tu agenda antes de editarla.');
      const title = field(input, 'title');
      if (typeof title !== 'string' || !title.trim() || title.trim().length > 80) return result(false, 'INVALID_INPUT', 'Envía sólo {title: "Título nuevo"}, de 1 a 80 caracteres.');
      const session = agenda.find(item => item.id === selectedId)!;
      if (session.title === title.trim()) return result(true, 'UNCHANGED', 'El título ya era ese.');
      session.title = title.trim();
      changed();
      return result(true, 'EDITED', `Título actualizado: ${session.title}.`);
    },

    // 2. La herramienta sólo prepara la revisión. No confirma en nombre de la persona.
    prepareConfirmation(): AgendaResult {
      if (finalized) return result(true, 'ALREADY_FINALIZED', 'La agenda ya estaba finalizada.');
      if (!agenda.length) return result(false, 'EMPTY_AGENDA', 'Añade al menos una sesión antes de finalizar.');
      if (reviewedRevision !== revision) {
        reviewedRevision = revision;
        onChange();
      }
      return result(true, 'CONFIRMATION_REQUIRED', 'Revisa la agenda en la página y pulsa «Confirmar agenda» o «Cancelar». Aún no se ha finalizado.');
    },

    // 3. Sólo el botón humano de confirmación llama a este método; no es una tool.
    confirm(): AgendaResult {
      if (finalized) return result(true, 'ALREADY_FINALIZED', 'La agenda ya estaba finalizada; no hay otro cambio.');
      if (reviewedRevision !== revision) return result(false, 'NO_CONFIRMATION', 'Prepara y revisa la agenda antes de confirmar.');
      finalized = true;
      selectedId = null;
      changed();
      return result(true, 'FINALIZED', 'Agenda ficticia finalizada localmente. Puedes reabrirla o reiniciar.');
    },

    cancelConfirmation(): AgendaResult {
      if (finalized) return locked();
      if (reviewedRevision !== null) {
        reviewedRevision = null;
        onChange();
      }
      return result(true, 'CANCELLED', 'Revisión cancelada. Tu agenda sigue editable.');
    },

    reopen(): AgendaResult {
      if (finalized || reviewedRevision !== null) {
        finalized = false;
        changed();
      }
      return result(true, 'REOPENED', 'Agenda editable de nuevo.');
    },

    reset(): AgendaResult {
      agenda = [];
      selectedId = null;
      finalized = false;
      changed();
      return result(true, 'RESET', 'Demo reiniciado: agenda vacía y catálogo original.');
    },
  };
}
