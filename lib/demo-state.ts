import type { Restaurant, CartItem } from './mock-data'

export type ToolInput = Record<string, unknown>
export type ToolResult = { success: boolean; message: string; [key: string]: unknown }

const inputFields: Record<string, readonly string[]> = {
  getRestaurantInfo: ['restaurantId'],
  viewCart: [],
  addToCart: ['restaurantId', 'menuItemId', 'quantity'],
  clearCart: [],
  checkout: [],
}

function hasOnlyFields(input: unknown, allowed: readonly string[]): input is ToolInput {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return false
  const prototype = Object.getPrototypeOf(input)
  return (prototype === Object.prototype || prototype === null) && Object.keys(input).every(key => allowed.includes(key))
}
export interface DemoSnapshot {
  selectedRestaurantId: string | null
  cart: CartItem[]
  pendingReview: boolean
  lastOrder: string | null
}

/** Shared, synchronous business actions for the UI, guided demo and native tools. */
export class DemoStore {
  private snapshot: DemoSnapshot = { selectedRestaurantId: null, cart: [], pendingReview: false, lastOrder: null }
  private listeners = new Set<() => void>()

  constructor(private readonly catalog: Restaurant[]) {}

  getSnapshot = () => this.snapshot
  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private update(patch: Partial<DemoSnapshot>) {
    this.snapshot = { ...this.snapshot, ...patch }
    this.listeners.forEach(listener => listener())
  }

  toolNames() {
    return [
      'getRestaurantInfo', 'viewCart',
      ...(this.snapshot.selectedRestaurantId ? ['addToCart'] : []),
      ...(this.snapshot.cart.length ? ['clearCart', 'checkout'] : []),
    ]
  }

  search(params: unknown): ToolResult {
    if (!hasOnlyFields(params, ['cuisine', 'priceRange'])) return { success: false, message: 'Envía un objeto JSON con cuisine y priceRange, sin campos adicionales.' }
    const cuisineInput = params.cuisine === undefined ? 'all' : params.cuisine
    const priceRange = params.priceRange === undefined ? 'all' : params.priceRange
    if (typeof cuisineInput !== 'string' || !['all', 'mexicana', 'italiana', 'japonesa'].includes(cuisineInput.toLowerCase())) {
      return { success: false, message: 'Cocina inválida. Usa all, mexicana, italiana o japonesa.' }
    }
    if (typeof priceRange !== 'string' || !['all', '$', '$$', '$$$'].includes(priceRange)) {
      return { success: false, message: 'Precio inválido. Usa all, $, $$ o $$$.' }
    }
    const cuisine = cuisineInput.toLowerCase()
    const matches = this.catalog.filter(r => (cuisine === 'all' || r.cuisine.toLowerCase() === cuisine) && (priceRange === 'all' || r.priceRange === priceRange))
    return { success: true, message: `${matches.length} restaurantes encontrados.`, restaurants: matches }
  }

  run(name: string, params: unknown): ToolResult {
    if (!this.toolNames().includes(name)) return { success: false, message: `${name} no está disponible en el estado actual. Abre un menú o agrega productos primero.` }
    if (!hasOnlyFields(params, inputFields[name])) return { success: false, message: `Entrada inválida para ${name}. Usa un objeto JSON sin campos adicionales.` }
    if (name === 'getRestaurantInfo') {
      const restaurant = this.catalog.find(r => r.id === params.restaurantId)
      if (!restaurant) return { success: false, message: `Restaurante desconocido. IDs válidos: ${this.catalog.map(r => r.id).join(', ')}.` }
      this.update({ selectedRestaurantId: restaurant.id })
      return { success: true, message: `Menú abierto: ${restaurant.name}. addToCart ya está disponible.`, restaurant }
    }
    if (name === 'addToCart') {
      const restaurant = this.catalog.find(r => r.id === params.restaurantId)
      if (!restaurant || restaurant.id !== this.snapshot.selectedRestaurantId) return { success: false, message: 'Abre primero el menú de ese restaurante con getRestaurantInfo.' }
      const item = restaurant.menu.find(item => item.id === params.menuItemId)
      if (!item) return { success: false, message: `Producto desconocido. IDs válidos: ${restaurant.menu.map(item => item.id).join(', ')}.` }
      if (!item.inStock) return { success: false, message: `${item.name} no está disponible. Elige otro producto del menú.` }
      if (typeof params.quantity !== 'number' || !Number.isInteger(params.quantity) || params.quantity < 1 || params.quantity > 10) {
        return { success: false, message: 'quantity debe ser un número entero entre 1 y 10.' }
      }
      this.update({ cart: [...this.snapshot.cart, { restaurant, menuItem: item, quantity: params.quantity, customizations: {} }], pendingReview: false })
      return { ...this.cartResult(), message: `${params.quantity} × ${item.name} agregados al carrito.` }
    }
    if (name === 'viewCart') return this.cartResult()
    if (name === 'clearCart') {
      this.update({ cart: [], pendingReview: false })
      return { success: true, message: 'Carrito vacío. clearCart y checkout dejan de estar disponibles.' }
    }
    this.update({ pendingReview: true })
    return { ...this.cartResult(), status: 'pending-human-review', message: 'Revisión abierta. La persona debe confirmar el pedido ficticio en la interfaz. Aún no se ha confirmado ni cobrado nada.' }
  }

  private cartResult(): ToolResult {
    return {
      success: true, message: this.snapshot.cart.length ? 'Carrito actualizado.' : 'El carrito está vacío.',
      items: this.snapshot.cart.map(item => ({ name: item.menuItem.name, quantity: item.quantity, unitPrice: item.menuItem.price })),
      itemCount: this.snapshot.cart.reduce((count, item) => count + item.quantity, 0),
      total: Number(this.snapshot.cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0).toFixed(2)),
      currency: 'MXN',
    }
  }

  cancelReview() { this.update({ pendingReview: false }) }

  /** Called exclusively by the explicit UI confirmation button; never registered as a tool. */
  confirmOrder(): ToolResult {
    if (!this.snapshot.pendingReview || !this.snapshot.cart.length) return { success: false, message: 'Solicita una nueva revisión del carrito antes de confirmar.' }
    const orderId = `DEMO-${Date.now()}`
    this.update({ cart: [], pendingReview: false, lastOrder: orderId })
    return { success: true, message: `Pedido ficticio ${orderId} confirmado. Sin cobro ni envío real.`, orderId }
  }

  reset() { this.update({ cart: [], selectedRestaurantId: null, pendingReview: false, lastOrder: null }) }
}
