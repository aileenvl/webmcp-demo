import { type Agenda, type Tool, sessionInput, cancelled } from '../contrato.js';
import { defineTools as lectura } from './01-lectura.js';
export const id = 3;
export function defineTools(agenda: Agenda): Tool[] {
  return [...lectura(agenda), {
    name: 'agregar_sesion',
    description: 'Agrega una sesión por ID. La app valida duplicados y horarios.',
    inputSchema: sessionInput,
    annotations: { readOnlyHint: false, untrustedContentHint: true },
    execute: (input, { signal }) => {
      if (signal.aborted) return cancelled();
      // Conserva el resultado real: ok, code y message permiten recuperarse.
      return JSON.stringify(agenda.add(input));
    },
  }];
}
