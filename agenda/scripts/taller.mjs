import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const files = ['00-app.ts','01-lectura.ts','02-mutacion.ts','03-resultados.ts','04-contexto.ts','05-confirmacion.ts'];
const [command, a, b] = process.argv.slice(2);
const file = value => {
  if (!/^[0-5]$/.test(value ?? '')) throw new Error('Usa un checkpoint del 0 al 5.');
  return `taller/pasos/${files[Number(value)]}`;
};
try {
  if (command === 'copiar') {
    const source = file(a);
    const current = await readFile('taller/pasos/ejercicio.ts', 'utf8');
    await mkdir('artifacts/resguardos', { recursive: true });
    const backup = `artifacts/resguardos/ejercicio-${Date.now()}.ts.txt`;
    await writeFile(backup, current, { flag: 'wx' });
    await copyFile(source, 'taller/pasos/ejercicio.ts');
    console.log(`Ejercicio preparado desde ${source}. Copia anterior: ${backup}.\nAbre /agenda/taller/index.html?paso=ejercicio; guardar el archivo recarga y reinicia la agenda.`);
  } else if (command === 'diff') {
    const result = spawnSync('diff', ['-u', file(a), file(b)], { encoding: 'utf8' });
    if (result.error) throw result.error;
    if (result.status !== 0 && result.status !== 1) throw new Error(result.stderr);
    console.log(result.stdout || 'Los archivos son iguales.');
  } else throw new Error('Usa npm run taller:copiar -- 0 o npm run taller:diff -- 0 1.');
} catch (error) { console.error(String(error)); process.exitCode = 1; }
