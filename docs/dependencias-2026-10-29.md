# Revisión de dependencias · 29 de octubre de 2026

Se actualizó `next` de **16.2.6 a 16.4.3**, junto con `eslint-config-next` a la misma versión. Se conservaron React y React DOM **19.2.4**. El lockfile incluye las dependencias que requiere Next, entre ellas Sharp **0.35.5** y PostCSS **8.5.23**. No se ejecutó `npm audit fix --force`.

La [actualización de seguridad oficial del 14 de octubre](https://nextjs.org/blog/nextjs-security-update-october-14-2026) corrige ejecución remota de código en Cache Components/Image Optimization y una denegación de servicio en Server Actions. [Next 16.4.3](https://github.com/vercel/next.js/releases/tag/v16.4.3), publicado el 23 de octubre, incorpora esas correcciones y arreglos posteriores. Las alertas generales de una dependencia no demuestran que todos los vectores fueran explotables en esta aplicación.

## Clasificación del generador de componentes

`shadcn` **4.7.0** se conservó como `devDependency`. Es un CLI de generación: no hay imports de `shadcn` en `app/`, `components/` ni `lib/`, ni se invoca en los scripts de build o start. Los componentes generados permanecen en el repositorio.

`npm explain proxy-addr` identificó esta cadena: `shadcn → @modelcontextprotocol/sdk → express → proxy-addr`. Clasificar el CLI como herramienta de desarrollo excluye esa cadena de la instalación de producción; no corrige sus avisos de seguridad de desarrollo ni los oculta en la auditoría completa.

## Resultado de la auditoría

| Comando | Antes | Después |
| --- | --- | --- |
| `npm audit --omit=dev` | 22: 2 críticas, 14 altas, 4 moderadas, 2 bajas | 2: 0 críticas, 1 alta, 1 moderada |
| `npm audit` | No se conservó auditoría completa inicial | 18: 1 crítica, 11 altas, 4 moderadas, 2 bajas |

Quedan dos alertas en el árbol instalado de producción:

- [`source-map-js` 1.2.1](https://github.com/advisories/GHSA-68fv-2mgg-jv7q), alta: posible denegación de servicio al procesar ciertos source maps. Llega por PostCSS, dependencia de Next.
- [`baseline-browser-mapping` 2.10.29](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv), moderada: terminación del proceso con entradas inválidas. Llega directamente por Next y también por Browserslist.

Ambas tienen corrección disponible según npm. Se dejaron documentadas para mantener esta actualización acotada a Next y a la clasificación del CLI. Esta demo no recibe CSS, source maps ni consultas de navegadores desde usuarios; ello no equivale a que las dependencias estén libres de vulnerabilidades.

La auditoría completa sigue incluyendo avisos en el CLI y sus herramientas transitivas: `proxy-addr` (crítica), MCP SDK, Express/body-parser, Hono, Zod, Browserslist y otras utilidades. No deben ejecutarse contra registros, proyectos o entradas no confiables sin revisar primero esas actualizaciones.

## Verificación

En la actualización inicial a Next **16.4.3** pasaron 7 pruebas de comportamiento. La revisión posterior de la API amplió la cobertura a **13 pruebas**, todas aprobadas, con TypeScript, ESLint y build correctos. La integración nativa se comprobó además en un navegador compatible mediante búsqueda HTML, lectura, menú, error de stock, carrito y revisión humana. Esto no demuestra compatibilidad universal de todos los navegadores y clientes.
