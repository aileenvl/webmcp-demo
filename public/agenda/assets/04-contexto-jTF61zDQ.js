const e=`import { type Agenda, type Tool, sessionInput, cancelled } from '../contrato.js';
import { defineTools as resultados } from './03-resultados.js';
export const id = 4;
export function defineTools(agenda: Agenda): Tool[] {
  const tools: Tool[] = [...resultados(agenda), {
    name: 'seleccionar_sesion',
    description: 'Selecciona una sesión añadida; null quita la selección.',
    inputSchema: { ...sessionInput, properties: { sessionId: { type: ['string', 'null'], enum: ['webmcp', 'tipos', 'accesibilidad', null] } } },
    execute: (input, { signal }) => signal.aborted ? cancelled() : JSON.stringify(agenda.select(input)),
  }];
  const { selectedId, finalized } = agenda.snapshot();
  if (selectedId && !finalized) {
    tools.push({
      name: 'editar_sesion_seleccionada',
      description: \`Cambia el título local de la sesión seleccionada (\${selectedId}).\`,
      inputSchema: { type: 'object', properties: { title: { type: 'string', minLength: 1, maxLength: 80 } }, required: ['title'], additionalProperties: false },
      annotations: { untrustedContentHint: true },
      execute: (input, { signal }) => {
        if (signal.aborted) return cancelled();
        // Un callback antiguo tampoco debe editar otra selección.
        if (agenda.snapshot().selectedId !== selectedId || agenda.snapshot().finalized) {
          return JSON.stringify({ ok: false, code: 'STALE_SELECTION', message: 'Cambió la selección. Descubre las herramientas otra vez.' });
        }
        return JSON.stringify(agenda.editSelected(input));
      },
    });
  }
  return tools;
}
`;export{e as default};
