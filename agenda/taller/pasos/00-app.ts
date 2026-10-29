import type { Agenda, Tool } from '../contrato.js';
export const id = 0;
// La app humana funciona. No publicamos ninguna herramienta.
export function defineTools(_agenda: Agenda): Tool[] {
  return [];
}
