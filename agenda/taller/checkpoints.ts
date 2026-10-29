import { defineTools as app } from './pasos/00-app.js';
import { defineTools as lectura } from './pasos/01-lectura.js';
import { defineTools as mutacion } from './pasos/02-mutacion.js';
import { defineTools as resultados } from './pasos/03-resultados.js';
import { defineTools as contexto } from './pasos/04-contexto.js';
import { defineTools as confirmacion } from './pasos/05-confirmacion.js';
export const stages = [
  { id: 0, title: 'App normal, sin herramientas', file: '00-app.ts', defineTools: app },
  { id: 1, title: 'Primera lectura', file: '01-lectura.ts', defineTools: lectura },
  { id: 2, title: 'Mutación + JSON Schema', file: '02-mutacion.ts', defineTools: mutacion },
  { id: 3, title: 'Resultados que permiten recuperarse', file: '03-resultados.ts', defineTools: resultados },
  { id: 4, title: 'Herramientas contextuales', file: '04-contexto.ts', defineTools: contexto },
  { id: 5, title: 'Revisión bajo control humano', file: '05-confirmacion.ts', defineTools: confirmacion },
];
