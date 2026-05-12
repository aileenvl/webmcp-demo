'use client'

import { useEffect, useState } from 'react'
import { restaurants, type Restaurant, type CartItem } from '@/lib/mock-data'
import { registerWebMCPTool, isWebMCPAvailable } from '@/lib/webmcp'

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [webmcpStatus, setWebmcpStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')

  useEffect(() => {
    // Check WebMCP availability
    const available = isWebMCPAvailable()
    setWebmcpStatus(available ? 'available' : 'unavailable')

    if (!available) {
      console.warn('⚠️ WebMCP not available. Enable chrome://flags/#enable-webmcp-testing')
      return
    }

    // Register imperative tools
    registerImperativeTools()

    // Setup event listeners
    setupWebMCPEventListeners()

    return () => {
      // Cleanup: remove event listeners
      window.removeEventListener('toolactivated', handleToolActivated)
      window.removeEventListener('toolcancel', handleToolCancel)
    }
  }, [cart])

  const registerImperativeTools = () => {
    // Tool 1: Add to Cart
    registerWebMCPTool({
      name: 'addToCart',
      description: 'Agregar un producto al carrito de compras. Usa esto cuando el usuario quiera pedir comida.',
      inputSchema: {
        type: 'object',
        properties: {
          restaurantId: {
            type: 'string',
            description: 'ID del restaurante (ej: taco-loco, pizza-pronto, sushi-zen)'
          },
          menuItemId: {
            type: 'string',
            description: 'ID del producto del menú'
          },
          quantity: {
            type: 'number',
            description: 'Cantidad a agregar',
            minimum: 1,
            maximum: 10
          }
        },
        required: ['restaurantId', 'menuItemId', 'quantity']
      },
      execute: async ({ restaurantId, menuItemId, quantity }) => {
        const restaurant = restaurants.find(r => r.id === restaurantId)
        if (!restaurant) {
          return { error: `Restaurant no encontrado: ${restaurantId}. Opciones válidas: ${restaurants.map(r => r.id).join(', ')}` }
        }

        const menuItem = restaurant.menu.find(m => m.id === menuItemId)
        if (!menuItem) {
          return { error: `Producto no encontrado: ${menuItemId}. Opciones válidas: ${restaurant.menu.map(m => m.id).join(', ')}` }
        }

        if (!menuItem.inStock) {
          return { error: `El producto "${menuItem.name}" no está disponible actualmente. Prueba con otro producto del menú.` }
        }

        if (quantity < 1 || quantity > 10) {
          return { error: 'La cantidad debe estar entre 1 y 10' }
        }

        // Add to cart
        const newItem: CartItem = {
          menuItem,
          restaurant,
          quantity,
          customizations: {}
        }

        setCart(prev => [...prev, newItem])
        showNotification(`✅ ${quantity}x ${menuItem.name} agregado al carrito`)

        return {
          success: true,
          message: `${quantity}x ${menuItem.name} agregado al carrito. Total de items: ${cart.length + 1}`,
          cartTotal: cart.length + 1
        }
      }
    })

    // Tool 2: View Cart
    registerWebMCPTool({
      name: 'viewCart',
      description: 'Ver el contenido actual del carrito de compras',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      execute: async () => {
        if (cart.length === 0) {
          return { message: 'El carrito está vacío. Usa addToCart para agregar productos.' }
        }

        const total = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
        const items = cart.map(item => ({
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.menuItem.price,
          subtotal: item.menuItem.price * item.quantity
        }))

        return {
          items,
          total: total.toFixed(2),
          itemCount: cart.length
        }
      }
    })

    // Tool 3: Clear Cart
    registerWebMCPTool({
      name: 'clearCart',
      description: 'Vaciar el carrito de compras completamente',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      execute: async () => {
        const itemCount = cart.length
        setCart([])
        showNotification('🗑️ Carrito vaciado')
        return {
          success: true,
          message: `Carrito vaciado. ${itemCount} items removidos.`
        }
      }
    })

    // Tool 4: Get Restaurant Info
    registerWebMCPTool({
      name: 'getRestaurantInfo',
      description: 'Obtener información detallada de un restaurante y su menú',
      inputSchema: {
        type: 'object',
        properties: {
          restaurantId: {
            type: 'string',
            description: 'ID del restaurante'
          }
        },
        required: ['restaurantId']
      },
      execute: async ({ restaurantId }) => {
        const restaurant = restaurants.find(r => r.id === restaurantId)
        if (!restaurant) {
          return { error: `Restaurant no encontrado: ${restaurantId}` }
        }

        return {
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          priceRange: restaurant.priceRange,
          rating: restaurant.rating,
          deliveryTime: restaurant.deliveryTime,
          menu: restaurant.menu.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            inStock: item.inStock
          }))
        }
      }
    })
  }

  const setupWebMCPEventListeners = () => {
    window.addEventListener('toolactivated', handleToolActivated)
    window.addEventListener('toolcancel', handleToolCancel)
  }

  const handleToolActivated = (event: any) => {
    console.log('🤖 Tool activated:', event.detail?.toolName)
    showNotification(`🤖 Agent usando: ${event.detail?.toolName || 'herramienta'}`)
  }

  const handleToolCancel = (event: any) => {
    console.log('❌ Tool cancelled:', event.detail?.toolName)
    showNotification(`❌ Operación cancelada`)
  }

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Check if invoked by agent
    const event = e.nativeEvent as any
    if (event.agentInvoked) {
      console.log('🤖 Form submitted by agent')
      e.preventDefault()

      // Extract form data
      const formData = new FormData(e.currentTarget)
      const cuisine = formData.get('cuisine') as string
      const priceRange = formData.get('priceRange') as string

      // Filter restaurants
      let filtered = restaurants
      if (cuisine && cuisine !== 'all') {
        filtered = filtered.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase())
      }
      if (priceRange && priceRange !== 'all') {
        filtered = filtered.filter(r => r.priceRange === priceRange)
      }

      // Respond to agent
      const response = {
        results: filtered.map(r => ({
          id: r.id,
          name: r.name,
          cuisine: r.cuisine,
          priceRange: r.priceRange,
          rating: r.rating,
          deliveryTime: r.deliveryTime
        }))
      }

      // @ts-ignore
      event.respondWith(response)
      showNotification(`✅ Búsqueda completada: ${filtered.length} restaurantes`)
    } else {
      e.preventDefault()
      showNotification('🔍 Búsqueda ejecutada por humano')
    }
  }

  const handleCheckoutSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const event = e.nativeEvent as any
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const phone = formData.get('phone') as string

    if (!name || !address || !phone) {
      showNotification('❌ Todos los campos son requeridos')
      return
    }

    if (cart.length === 0) {
      showNotification('❌ El carrito está vacío')
      return
    }

    const total = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
    const orderId = `ORD-${Date.now()}`

    const response = {
      success: true,
      orderId,
      total: total.toFixed(2),
      estimatedDelivery: '30-40 min',
      message: `Pedido confirmado para ${name}. Se entregará en ${address}.`
    }

    if (event.agentInvoked) {
      // @ts-ignore
      event.respondWith(response)
    }

    showNotification(`✅ Pedido ${orderId} confirmado!`)
    setCart([])
    e.currentTarget.reset()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-8">
      {/* Notification */}
      {notification && (
        <div className="tool-notification">
          {notification}
        </div>
      )}

      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
              🌮 TacoAgent
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Demo de WebMCP - Food Delivery con IA
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              webmcpStatus === 'available'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                webmcpStatus === 'available' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span className="font-semibold">
                {webmcpStatus === 'checking' && 'Verificando WebMCP...'}
                {webmcpStatus === 'available' && 'WebMCP Activo'}
                {webmcpStatus === 'unavailable' && 'WebMCP No Disponible'}
              </span>
            </div>
            {webmcpStatus === 'unavailable' && (
              <p className="text-sm text-gray-500 mt-2">
                Habilita chrome://flags/#enable-webmcp-testing
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Left Column - Forms (Declarative API) */}
        <div className="space-y-8">
          {/* Restaurant Search Form - Declarative API */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🔍 Buscar Restaurantes
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              API Declarativa (HTML)
            </p>

            <form
              onSubmit={handleSearchSubmit}
              toolname="searchRestaurants"
              tooldescription="Buscar restaurantes por tipo de cocina y rango de precio"
              className="space-y-4"
            >
              <div>
                <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Cocina
                </label>
                <select
                  id="cuisine"
                  name="cuisine"
                  toolparamdescription="Tipo de cocina del restaurante"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">Todas</option>
                  <option value="mexicana">Mexicana</option>
                  <option value="italiana">Italiana</option>
                  <option value="japonesa">Japonesa</option>
                </select>
              </div>

              <div>
                <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rango de Precio
                </label>
                <select
                  id="priceRange"
                  name="priceRange"
                  toolparamdescription="Rango de precio del restaurante ($ económico, $$ medio, $$$ caro)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">Todos</option>
                  <option value="$">$ - Económico</option>
                  <option value="$$">$$ - Medio</option>
                  <option value="$$$">$$$ - Caro</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Buscar Restaurantes
              </button>
            </form>
          </section>

          {/* Checkout Form - Declarative API with validation */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🛒 Finalizar Pedido
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              API Declarativa + Validación
            </p>

            <form
              onSubmit={handleCheckoutSubmit}
              toolname="checkout"
              tooldescription="Finalizar el pedido con información de entrega. El carrito debe tener al menos un item."
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  toolparamdescription="Nombre completo de la persona que recibe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dirección de Entrega *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  toolparamdescription="Dirección completa donde se entregará el pedido"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Av. Corrientes 1234, CABA"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  toolparamdescription="Número de teléfono para contacto"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="+54 11 1234-5678"
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Items en carrito:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{cart.length}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-orange-600 dark:text-orange-400">
                    ${cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={cart.length === 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {cart.length === 0 ? 'Carrito Vacío' : 'Confirmar Pedido'}
              </button>
            </form>
          </section>
        </div>

        {/* Right Column - Restaurant List & Cart */}
        <div className="space-y-8">
          {/* Restaurant List */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🍽️ Restaurantes Disponibles
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Usa API Imperativa para agregar al carrito
            </p>

            <div className="space-y-4">
              {restaurants.map(restaurant => (
                <div
                  key={restaurant.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-orange-500 transition-colors cursor-pointer"
                  onClick={() => setSelectedRestaurant(restaurant)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{restaurant.image}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {restaurant.cuisine} • {restaurant.priceRange}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-orange-600">⭐ {restaurant.rating}</div>
                      <div className="text-xs text-gray-500">{restaurant.deliveryTime}</div>
                    </div>
                  </div>

                  {selectedRestaurant?.id === restaurant.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Menú:</h4>
                      <div className="space-y-2">
                        {restaurant.menu.map(item => (
                          <div
                            key={item.id}
                            className={`flex justify-between items-center text-sm p-2 rounded ${
                              item.inStock
                                ? 'bg-gray-50 dark:bg-gray-700'
                                : 'bg-red-50 dark:bg-red-900/20 opacity-60'
                            }`}
                          >
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                              {!item.inStock && (
                                <span className="ml-2 text-xs text-red-600 dark:text-red-400">(No disponible)</span>
                              )}
                            </div>
                            <span className="text-orange-600 dark:text-orange-400 font-semibold">
                              ${item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                        💡 Tip para agentes: usa <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">addToCart</code> con restaurantId=&quot;{restaurant.id}&quot;
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Cart */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🛒 Carrito
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              API Imperativa: viewCart, clearCart
            </p>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-4xl mb-2">🛒</p>
                <p>Tu carrito está vacío</p>
                <p className="text-sm mt-2">
                  Usa <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">addToCart</code> para agregar items
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.quantity}x {item.menuItem.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.restaurant.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600 dark:text-orange-400">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-orange-600 dark:text-orange-400">
                      ${cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCart([])
                    showNotification('🗑️ Carrito vaciado')
                  }}
                  className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Vaciar Carrito
                </button>
              </div>
            )}
          </section>

          {/* Info Panel */}
          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl shadow-lg p-8 border-2 border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              ℹ️ Herramientas WebMCP Registradas
            </h2>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>✅ <strong>searchRestaurants</strong> - Declarativa (form)</li>
              <li>✅ <strong>checkout</strong> - Declarativa (form)</li>
              <li>✅ <strong>addToCart</strong> - Imperativa (JS)</li>
              <li>✅ <strong>viewCart</strong> - Imperativa (JS)</li>
              <li>✅ <strong>clearCart</strong> - Imperativa (JS)</li>
              <li>✅ <strong>getRestaurantInfo</strong> - Imperativa (JS)</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 Abre la extensión &quot;Model Context Tool Inspector&quot; para ver todas las herramientas disponibles
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Demo de WebMCP para la charla &quot;Prepara tu webapp para los agentes de nuestro día a día&quot;
        </p>
        <p className="mt-2">
          🤖 Hecho con WebMCP, Next.js y ❤️
        </p>
      </footer>
    </div>
  )
}
