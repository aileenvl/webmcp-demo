'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react'
import { restaurants, type Restaurant } from '@/lib/mock-data'
import { DemoStore, type ToolInput, type ToolResult } from '@/lib/demo-state'
import { getModelContext, ToolRegistry, type ToolDefinition } from '@/lib/webmcp'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Search, UtensilsCrossed, Code2, RotateCcw, Check, ShieldCheck } from 'lucide-react'

const money = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
const emptySchema = { type: 'object' as const, properties: {}, additionalProperties: false }
const descriptions: Record<string, string> = {
  getRestaurantInfo: 'Abre el menú de un restaurante y devuelve productos, precios e IDs. Usa los IDs de searchRestaurants.',
  viewCart: 'Consulta el carrito actual y su total en MXN. También funciona cuando está vacío.',
  addToCart: 'Agrega un producto del restaurante cuyo menú está abierto. quantity debe ser un entero entre 1 y 10. Valida disponibilidad.',
  clearCart: 'Vacía el carrito local de demostración. Invalida cualquier revisión pendiente.',
  checkout: 'Solicita revisión del carrito en la interfaz. Devuelve pending-human-review. No confirma, cobra ni envía pedidos.',
}

function makeTools(store: DemoStore, execute: (name: string, input: ToolInput) => ToolResult): ToolDefinition[] {
  return store.toolNames().map(name => ({
    name, description: descriptions[name],
    inputSchema: name === 'getRestaurantInfo' ? {
      type: 'object', properties: { restaurantId: { type: 'string', enum: restaurants.map(r => r.id) } }, required: ['restaurantId'], additionalProperties: false,
    } : name === 'addToCart' ? {
      type: 'object', properties: {
        restaurantId: { type: 'string', description: 'ID del restaurante cuyo menú está abierto.' },
        menuItemId: { type: 'string', description: 'ID de un producto disponible en ese menú.' },
        quantity: { type: 'integer', minimum: 1, maximum: 10 },
      }, required: ['restaurantId', 'menuItemId', 'quantity'], additionalProperties: false,
    } : emptySchema,
    annotations: { readOnlyHint: name === 'viewCart', consequentialHint: false },
    execute: async input => execute(name, input),
  }))
}

export default function Home() {
  const [store] = useState(() => new DemoStore(restaurants))
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
  const [results, setResults] = useState<Restaurant[]>(restaurants)
  const [lastResult, setLastResult] = useState<ToolResult | null>(null)
  const [nativeStatus, setNativeStatus] = useState('Comprobando API del navegador…')
  const [nativeTools, setNativeTools] = useState<string[]>([])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const selected = restaurants.find(r => r.id === state.selectedRestaurantId)
  const total = state.cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
  const availableNames = ['searchRestaurants', ...store.toolNames()]

  useEffect(() => {
    let mounted = true
    const context = getModelContext()
    if (!context) {
      Promise.resolve().then(() => { if (mounted) setNativeStatus('WebMCP nativo no disponible · el ensayo local sí funciona') })
      return () => { mounted = false }
    }
    const registry = new ToolRegistry(context)
    const execute = (name: string, input: ToolInput) => {
      const result = store.run(name, input)
      if (mounted) setLastResult(result)
      return result
    }
    const sync = () => {
      const tools = makeTools(store, execute)
      void registry.setTools(tools).then(() => {
        if (mounted) { setNativeStatus('WebMCP nativo disponible'); setNativeTools(tools.map(tool => tool.name)) }
      }).catch((error: unknown) => {
        if (mounted) setNativeStatus(`No se pudieron registrar herramientas: ${error instanceof Error ? error.message : 'error del navegador'}`)
      })
    }
    sync()
    const unsubscribe = store.subscribe(sync)
    return () => { mounted = false; unsubscribe(); registry.dispose() }
  }, [store])

  useEffect(() => {
    const dialog = dialogRef.current
    if (state.pendingReview && dialog && !dialog.open) dialog.showModal()
    if (!state.pendingReview && dialog?.open) dialog.close()
  }, [state.pendingReview])

  const run = (name: string, input: ToolInput = {}) => {
    const result = store.run(name, input)
    setLastResult(result)
    return result
  }
  const search = (input: ToolInput) => {
    const result = store.search(input)
    if (result.success) setResults(result.restaurants as Restaurant[])
    setLastResult(result)
    return result
  }
  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const result = search({ cuisine: data.get('cuisine'), priceRange: data.get('priceRange') })
    const nativeEvent = event.nativeEvent as SubmitEvent & { agentInvoked?: boolean; respondWith?: (value: Promise<ToolResult>) => void }
    if (nativeEvent.agentInvoked && nativeEvent.respondWith) nativeEvent.respondWith(Promise.resolve(result))
  }

  return (
    <main className="taco-shell">
      <header className="taco-header">
        <div className="taco-brand"><span aria-hidden="true">🌮</span><div><h1>TacoAgent</h1><p>Tu antojo, una herramienta a la vez</p></div></div>
        <p className="native-status" role="status">{nativeStatus}</p>
      </header>

      <div className="demo-banner"><Code2 size={20} aria-hidden="true" /><p><strong>Demo de WebMCP</strong> · Datos y pedidos ficticios. Los cambios viven sólo en esta pestaña.</p><button onClick={() => { store.reset(); setResults(restaurants); setLastResult(null) }} className="reset-button"><RotateCcw size={16} aria-hidden="true" /> Reiniciar</button></div>

      <div className="taco-layout">
        <section className="main-column" aria-label="Restaurantes y menú">
          <section className="taco-section">
            <div className="section-heading"><Search size={21} aria-hidden="true" /><h2>Encuentra tu próximo antojo</h2></div>
            <p className="section-description">API declarativa: el formulario HTML se convierte en <code>searchRestaurants</code>.</p>
            <form onSubmit={onSearch} toolname="searchRestaurants" tooldescription="Busca restaurantes por cocina y rango de precio. Devuelve sus IDs y menús. No crea pedidos." toolautosubmit="" className="search-form">
              <label>Cocina<select name="cuisine" defaultValue="all"><option value="all">Todas</option><option value="mexicana">Mexicana</option><option value="italiana">Italiana</option><option value="japonesa">Japonesa</option></select></label>
              <label>Precio<select name="priceRange" defaultValue="all"><option value="all">Todos</option><option value="$">$ · Económico</option><option value="$$">$$ · Medio</option><option value="$$$">$$$ · Alto</option></select></label>
              <Button type="submit">Buscar restaurantes</Button>
            </form>
            <div className="restaurant-list">
              {results.map(restaurant => <button key={restaurant.id} className={`restaurant-row ${selected?.id === restaurant.id ? 'selected' : ''}`} onClick={() => run('getRestaurantInfo', { restaurantId: restaurant.id })} aria-pressed={selected?.id === restaurant.id}>
                <span className="food-emoji" aria-hidden="true">{restaurant.image}</span><span><strong>{restaurant.name}</strong><small>{restaurant.cuisine} · {restaurant.priceRange} · ★ {restaurant.rating}</small></span><span className="restaurant-time">{restaurant.deliveryTime}<small>Ver menú →</small></span>
              </button>)}
              {results.length === 0 && <p>No hay restaurantes con esos filtros. Prueba otra cocina o precio.</p>}
            </div>
          </section>

          <section className="taco-section">
            <div className="section-heading"><UtensilsCrossed size={21} aria-hidden="true" /><h2>{selected ? `Menú de ${selected.name}` : 'Abre un menú para continuar'}</h2></div>
            {selected ? <><p className="section-description"><code>addToCart</code> apareció al abrir este menú. Precios de demostración en MXN.</p><div className="menu-list">{selected.menu.map(item => <article key={item.id} className="menu-row"><span className="food-emoji" aria-hidden="true">{item.image}</span><div className="menu-copy"><h3>{item.name}</h3><p>{item.description}</p><code>{item.id}</code></div><div className="menu-action"><strong>{money(item.price)}</strong><Button disabled={!item.inStock} onClick={() => run('addToCart', { restaurantId: selected.id, menuItemId: item.id, quantity: 1 })}>{item.inStock ? 'Agregar' : 'Agotado'}</Button></div></article>)}</div></> : <p className="empty-state">El agente y tú comparten la misma interfaz. Selecciona un restaurante para habilitar la herramienta de agregar productos.</p>}
          </section>

          <section className="taco-section guided-section">
            <div className="section-heading"><Code2 size={21} aria-hidden="true" /><h2>Ensayo guiado</h2><span className="local-label">Local · sin IA</span></div>
            <p className="section-description">Estos botones ejecutan las mismas funciones de negocio que las herramientas. No simulan una conexión WebMCP ni interpretan lenguaje natural.</p>
            <ol className="guided-steps">
              <li><button onClick={() => search({ cuisine: 'mexicana', priceRange: 'all' })}>1. Buscar cocina mexicana</button><code>searchRestaurants</code></li>
              <li><button onClick={() => run('getRestaurantInfo', { restaurantId: 'taco-loco' })}>2. Abrir Taco Loco</button><code>getRestaurantInfo</code></li>
              <li><button disabled={selected?.id !== 'taco-loco'} onClick={() => run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'quesadilla', quantity: 1 })}>3. Probar producto agotado</button><code>addToCart → error</code></li>
              <li><button disabled={selected?.id !== 'taco-loco'} onClick={() => run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'taco-carnitas', quantity: 2 })}>4. Agregar 2 órdenes de tacos</button><code>addToCart → éxito</code></li>
              <li><button disabled={!state.cart.length} onClick={() => run('checkout')}>5. Solicitar revisión</button><code>checkout → revisión</code></li>
            </ol>
          </section>
        </section>

        <aside className="side-column">
          <section className="taco-section cart-section">
            <div className="section-heading"><ShoppingCart size={21} aria-hidden="true" /><h2>Tu carrito</h2><span className="cart-count">{state.cart.reduce((count, item) => count + item.quantity, 0)}</span></div>
            {state.cart.length ? <><ul className="cart-items">{state.cart.map((item, index) => <li key={`${item.menuItem.id}-${index}`}><span>{item.quantity} × {item.menuItem.name}</span><strong>{money(item.quantity * item.menuItem.price)}</strong></li>)}</ul><div className="cart-total"><span>Total de demostración</span><strong>{money(total)}</strong></div><Button className="checkout-button" onClick={() => run('checkout')}>Revisar pedido ficticio</Button><button className="text-button" onClick={() => run('clearCart')}>Vaciar carrito</button></> : <p className="empty-state">Todavía no hay antojos aquí. Agrega algo del menú.</p>}
            {state.lastOrder && <p className="order-success"><Check size={18} aria-hidden="true" /> Pedido ficticio confirmado: {state.lastOrder}</p>}
          </section>

          <section className="taco-section tools-section">
            <div className="section-heading"><Code2 size={21} aria-hidden="true" /><h2>Herramientas según el estado</h2></div>
            <p className="section-description">1 declarativa + {store.toolNames().length} imperativas disponibles para este flujo.</p>
            <ul>{availableNames.map(name => <li key={name}><span className="tool-dot" aria-hidden="true" /><code>{name}</code><small>{name === 'searchRestaurants' ? 'HTML' : 'JS'}</small></li>)}</ul>
            <p className="native-detail">{nativeTools.length ? `${nativeTools.length} registros imperativos completados en la API nativa.` : 'Sin registro nativo confirmado. Puedes usar el ensayo local.'}</p>
          </section>

          <section className="taco-section result-section" aria-live="polite">
            <h2>Último resultado</h2>
            {lastResult ? <><p className={lastResult.success ? 'result-ok' : 'result-error'}>{lastResult.message}</p><details><summary>Ver respuesta estructurada</summary><pre>{JSON.stringify(lastResult, null, 2)}</pre></details></> : <p className="empty-state">Ejecuta una búsqueda o un paso del ensayo para ver la respuesta.</p>}
          </section>
        </aside>
      </div>

      <footer className="taco-footer">WebMCP experimental · API revisada el 29 de octubre de 2026 · <a href="https://developer.chrome.com/docs/ai/webmcp" target="_blank" rel="noreferrer">Documentación oficial</a></footer>

      <dialog ref={dialogRef} onCancel={() => store.cancelReview()} className="review-dialog" aria-labelledby="review-title">
        <ShieldCheck size={32} aria-hidden="true" /><h2 id="review-title">Revisa antes de confirmar</h2><p><code>checkout</code> solicitó tu revisión. Confirma únicamente si el carrito coincide con tu intención.</p>
        <ul className="cart-items">{state.cart.map((item, index) => <li key={index}><span>{item.quantity} × {item.menuItem.name}</span><strong>{money(item.quantity * item.menuItem.price)}</strong></li>)}</ul><div className="cart-total"><span>Total ficticio</span><strong>{money(total)}</strong></div><p className="section-description">Esta demo no cobra, no envía pedidos y no guarda datos personales. La confirmación no se expone como herramienta.</p><div className="dialog-actions"><Button variant="outline" onClick={() => store.cancelReview()}>Cancelar</Button><Button onClick={() => setLastResult(store.confirmOrder())}>Confirmar pedido ficticio</Button></div>
      </dialog>
    </main>
  )
}
