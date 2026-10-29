import type { Restaurant, CartItem } from './mock-data'

export type ToolInput = Record<string, unknown>
export type ToolResult = { success: boolean; message: string; [key: string]: unknown }
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

  search(params: ToolInput): ToolResult {
    const cuisine = params.cuisine ?? 'all'
    const priceRange = params.priceRange ?? 'all'
    if (typeof cuisine !== 'string' || !['all', 'mexicana', 'italiana', 'japonesa'].includes(cuisine.toLowerCase())) {
      return { success: false, message: 'Cocina inválida. Usa all, mexicana, italiana o japonesa.' }
    }
    if (!['all', '$', '$$', '$$$'].includes(String(priceRange))) {
      return { success: false, message: 'Precio inválido. Usa all, $, $$ o $$$.' }
    }
    const matches = this.catalog.filter(r => (cuisine === 'all' || r.cuisine.toLowerCase() === cuisine.toLowerCase()) && (priceRange === 'all' || r.priceRange === priceRange))
    return { success: true, message: `${matches.length} restaurantes encontrados.`, restaurants: matches }
  }

  run(name: string, params: ToolInput): ToolResult {
    if (!this.toolNames().includes(name)) return { success: false, message: `${name} no está disponible en el estado actual. Abre un menú o agrega productos primero.` }
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
