# 🚀 Guía de Despliegue - TacoAgent Demo

Esta guía explica cómo desplegar el demo de WebMCP en Vercel y otras plataformas.

## Despliegue en Vercel

### Opción 1: Deploy con un click

1. Haz click en el botón:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aileenvl/webmcp-demo)

2. Conecta tu cuenta de GitHub
3. Clona el repositorio a tu cuenta
4. Vercel detectará Next.js automáticamente
5. Click en "Deploy"
6. ¡Listo! Tu demo estará en `tu-proyecto.vercel.app`

### Opción 2: Desde la CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Navegar al proyecto
cd webmcp-demo

# Deploy (te pedirá login la primera vez)
vercel

# Para producción
vercel --prod
```

### Opción 3: Integración con GitHub

1. Ve a [vercel.com](https://vercel.com) y haz login
2. Click en "Add New Project"
3. Importa el repo `aileenvl/webmcp-demo`
4. Vercel detecta Next.js automáticamente
5. Click en "Deploy"

**Ventaja:** Cada push a `main` deploya automáticamente.

## Configuración de Vercel

El archivo `vercel.json` ya está configurado:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## Variables de Entorno

Este demo no requiere variables de entorno, pero si las necesitas:

1. En Vercel Dashboard → Settings → Environment Variables
2. Agrega las variables necesarias
3. Redeploy el proyecto

## Dominios Personalizados

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio (ej: `webmcp-demo.tudominio.com`)
4. Sigue las instrucciones de DNS

## Otras Plataformas

### Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Cloudflare Pages

1. Conecta tu repo en Cloudflare Dashboard
2. Build command: `npm run build`
3. Output directory: `.next`

### Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
docker build -t webmcp-demo .
docker run -p 3000:3000 webmcp-demo
```

## Monitoreo y Analytics

### Vercel Analytics (Recomendado)

Ya incluido automáticamente. Ve métricas en Vercel Dashboard.

### Google Analytics

1. Agrega tu tracking ID en `app/layout.tsx`:

```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## Performance

### Optimización del Build

```bash
# Analizar bundle size
npm run build
npx @next/bundle-analyzer
```

### Configuración de Cache

Vercel cachea automáticamente, pero puedes configurar:

```js
// next.config.ts
const nextConfig = {
  swcMinify: true,
  compress: true,
  images: {
    unoptimized: false,
  },
}
```

## Troubleshooting

### Build falla

```bash
# Limpia cache y reinstala
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Deploy lento

- Verifica el tamaño del bundle
- Usa `next/image` para imágenes
- Habilita ISR si es posible

### WebMCP no funciona en producción

**Esto es normal.** WebMCP solo funciona:
- En Chrome 146+ Canary
- Con el flag habilitado localmente
- No funciona en el navegador del visitante sin configuración

El despliegue sirve para:
- Mostrar la UI del demo
- Compartir el código
- Demo visual durante la presentación

## URLs Útiles

- **GitHub:** https://github.com/aileenvl/webmcp-demo
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Next.js Docs:** https://nextjs.org/docs

## Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard
2. Verifica que `npm run build` funcione localmente
3. Checa la documentación de Next.js
4. Abre un issue en GitHub

---

**Tip:** Guarda el URL de tu deployment para compartirlo durante la presentación, pero recuerda que las herramientas WebMCP solo funcionarán en tu Chrome Canary local.
