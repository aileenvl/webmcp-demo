import { type Agenda, type Tool, emptyInput, emptyArguments, cancelled, invalid } from '../contrato.js';
import { defineTools as contexto } from './04-contexto.js';
export const id = 5;
export function defineTools(agenda: Agenda): Tool[] {
  return [...contexto(agenda), {
    name: 'preparar_confirmacion',
    description: 'Abre una revisión. NO confirma: la persona confirma en la UI.',
    inputSchema: emptyInput,
    execute: (input, { signal }) => {
      if (signal.aborted) return cancelled();
      if (!emptyArguments(input)) return invalid();
      return JSON.stringify(agenda.prepareConfirmation());
    },
  }];
}
