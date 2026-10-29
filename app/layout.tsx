import type { Metadata } from 'next'
import './globals.css'

// These experimental selectors are newer than the CSS bundler's parser.
const webmcpFocusStyles = `
@supports selector(form:tool-form-active) {
  form:tool-form-active { outline: 3px solid #146b78; outline-offset: 8px; background: #e9f2ee; }
  button:tool-submit-active { outline: 3px solid #146b78; outline-offset: 4px; }
}`

export const metadata: Metadata = {
  title: 'TacoAgent · Demo de WebMCP',
  description: 'Demo en español de herramientas WebMCP, registro dinámico y revisión humana de pedidos ficticios.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><head><style>{webmcpFocusStyles}</style></head><body>{children}</body></html>
}
