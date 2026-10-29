const n=`import { type Agenda, type Tool, emptyInput, emptyArguments, cancelled, invalid } from '../contrato.js';
export const id = 1;
export function defineTools(agenda: Agenda): Tool[] {
  return [{
    name: 'listar_sesiones',
    description: 'Lee el catálogo ficticio y la agenda actual. No modifica datos.',
    inputSchema: emptyInput,
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: (input, { signal }) => {
      if (signal.aborted) return cancelled();
      if (!emptyArguments(input)) return invalid();
      return JSON.stringify({ ok: true, code: 'STATE', ...agenda.snapshot() });
    },
  }];
}
`;export{n as default};
