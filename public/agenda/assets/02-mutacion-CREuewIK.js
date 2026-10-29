const n=`import { type Agenda, type Tool, sessionInput, cancelled } from '../contrato.js';
import { defineTools as lectura } from './01-lectura.js';
export const id = 2;
export function defineTools(agenda: Agenda): Tool[] {
  return [...lectura(agenda), {
    name: 'agregar_sesion',
    description: 'Agrega una sesión por ID. La app valida duplicados y horarios.',
    inputSchema: sessionInput,
    annotations: { readOnlyHint: false, untrustedContentHint: true },
    execute: (input, { signal }) => {
      if (signal.aborted) return cancelled();
      // EJERCICIO: se pierden los detalles de éxito, duplicado o conflicto.
      // Los datos siguen protegidos por agenda.add; el contrato informa mal.
      agenda.add(input);
      return 'Listo.';
    },
  }];
}
`;export{n as default};
