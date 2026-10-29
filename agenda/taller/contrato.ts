import type { createAgenda } from '../src/agenda.js';
export type Agenda = ReturnType<typeof createAgenda>;
export type Tool = WebMCP.ModelContextTool;
export const emptyInput = { type: 'object', properties: {}, additionalProperties: false };
export const sessionInput = {
  type: 'object', properties: { sessionId: { type: 'string', enum: ['webmcp', 'tipos', 'accesibilidad'] } },
  required: ['sessionId'], additionalProperties: false,
};
export const emptyArguments = (input: unknown) => input !== null && typeof input === 'object'
  && !Array.isArray(input) && Object.keys(input).length === 0;
export const cancelled = () => JSON.stringify({ ok: false, code: 'ABORTED', message: 'Llamada cancelada.' });
export const invalid = () => JSON.stringify({ ok: false, code: 'INVALID_INPUT', message: 'Envía {} sin campos extra.' });
