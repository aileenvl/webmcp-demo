'use client'

import { useEffect, useState } from 'react'
import { restaurants, type Restaurant, type CartItem } from '@/lib/mock-data'
import { registerWebMCPTool, isWebMCPAvailable } from '@/lib/webmcp'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [webmcpStatus, setWebmcpStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')

  useEffect(() => {
    const available = isWebMCPAvailable()
    setWebmcpStatus(available ? 'available' : 'unavailable')

    if (!available) {
      console.warn('⚠️ WebMCP not available. Enable chrome://flags/#enable-webmcp-testing')
      return
    }

    registerImperativeTools()
    setupWebMCPEventListeners()

    return () => {
      window.removeEventListener('toolactivated', handleToolActivated)
      window.removeEventListener('toolcancel', handleToolCancel)
    }
  }, [cart])

  const registerImperativeTools = () => {
    registerWebMCPTool({
      name: 'addToCart',
      description: 'Agregar un producto al carrito de compras',
      inputSchema: {
        type: 'object',
        properties: {
          restaurantId: { type: 'string', description: 'ID del restaurante' },
          menuItemId: { type: 'string', description: 'ID del producto' },
          quantity: { type: 'number', description: 'Cantidad', minimum: 1, maximum: 10 }
        },
        required: ['restaurantId', 'menuItemId', 'quantity']
      },
      execute: async ({ restaurantId, menuItemId, quantity }) => {
        const restaurant = restaurants.find(r => r.id === restaurantId)
        if (!restaurant) {
          return { error: `Restaurant no encontrado: ${restaurantId}` }
        }

        const menuItem = restaurant.menu.find(m => m.id === menuItemId)
        if (!menuItem) {
          return { error: `Producto no encontrado: ${menuItemId}` }
        }

        if (!menuItem.inStock) {
          return { error: `"${menuItem.name}" no está disponible` }
        }

        const newItem: CartItem = {
          menuItem,
          restaurant,
          quantity,
          customizations: {}
        }

        setCart(prev => [...prev, newItem])
        showNotification(`✅ ${quantity}x ${menuItem.name} agregado`)

        return {
          success: true,
          message: `${quantity}x ${menuItem.name} agregado al carrito`
        }
      }
    })

    registerWebMCPTool({
      name: 'viewCart',
      description: 'Ver contenido del carrito',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => {
        if (cart.length === 0) {
          return { message: 'Carrito vacío' }
        }

        const total = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
        return {
          items: cart.map(item => ({
            name: item.menuItem.name,
            quantity: item.quantity,
            price: item.menuItem.price,
            subtotal: item.menuItem.price * item.quantity
          })),
          total: total.toFixed(2),
          itemCount: cart.length
        }
      }
    })

    registerWebMCPTool({
      name: 'clearCart',
      description: 'Vaciar el carrito',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => {
        const itemCount = cart.length
        setCart([])
        showNotification('🗑️ Carrito vaciado')
        return { success: true, message: `${itemCount} items removidos` }
      }
    })

    registerWebMCPTool({
      name: 'getRestaurantInfo',
      description: 'Obtener info de un restaurante',
      inputSchema: {
        type: 'object',
        properties: {
          restaurantId: { type: 'string', description: 'ID del restaurante' }
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
    showNotification(`🤖 Agent usando: ${event.detail?.toolName || 'herramienta'}`)
  }

  const handleToolCancel = (event: any) => {
    showNotification(`❌ Operación cancelada`)
  }

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const event = e.nativeEvent as any
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const cuisine = formData.get('cuisine') as string
    const priceRange = formData.get('priceRange') as string

    let filtered = restaurants
    if (cuisine && cuisine !== 'all') {
      filtered = filtered.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase())
    }
    if (priceRange && priceRange !== 'all') {
      filtered = filtered.filter(r => r.priceRange === priceRange)
    }

    const response = {
      results: filtered.map(r => ({
        id: r.id,
        name: r.name,
        cuisine: r.cuisine,
        priceRange: r.priceRange,
        rating: r.rating
      }))
    }

    if (event.agentInvoked) {
      // @ts-ignore
      event.respondWith(response)
    }

    showNotification(`✅ ${filtered.length} restaurantes encontrados`)
  }

  const handleCheckoutSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const event = e.nativeEvent as any
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const phone = formData.get('phone') as string

    if (!name || !address || !phone) {
      showNotification('❌ Campos requeridos')
      return
    }

    if (cart.length === 0) {
      showNotification('❌ Carrito vacío')
      return
    }

    const total = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
    const orderId = `ORD-${Date.now()}`

    const response = {
      success: true,
      orderId,
      total: total.toFixed(2),
      estimatedDelivery: '30-40 min',
      message: `Pedido confirmado para ${name}`
    }

    if (event.agentInvoked) {
      // @ts-ignore
      event.respondWith(response)
    }

    showNotification(`✅ Pedido ${orderId} confirmado!`)
    setCart([])
    e.currentTarget.reset()
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{notification}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <span className="text-6xl">🌮</span>
                TacoAgent
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Demo de WebMCP - Food Delivery con IA
              </p>
            </div>
            <Badge
              variant={webmcpStatus === 'available' ? 'default' : 'destructive'}
              className="text-sm px-4 py-2"
            >
              <span className={`w-2 h-2 rounded-full mr-2 ${
                webmcpStatus === 'available' ? 'bg-green-400' : 'bg-red-400'
              } animate-pulse`}></span>
              {webmcpStatus === 'checking' && 'Verificando...'}
              {webmcpStatus === 'available' && 'WebMCP Activo'}
              {webmcpStatus === 'unavailable' && 'WebMCP No Disponible'}
            </Badge>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Search Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔍</span>
                  Buscar Restaurantes
                </CardTitle>
                <CardDescription>API Declarativa (HTML)</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSearchSubmit}
                  toolname="searchRestaurants"
                  tooldescription="Buscar restaurantes por cocina y precio"
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="cuisine">Tipo de Cocina</Label>
                    <Select name="cuisine" defaultValue="all">
                      <SelectTrigger id="cuisine">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="mexicana">Mexicana</SelectItem>
                        <SelectItem value="italiana">Italiana</SelectItem>
                        <SelectItem value="japonesa">Japonesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Rango de Precio</Label>
                    <Select name="priceRange" defaultValue="all">
                      <SelectTrigger id="priceRange">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="$">$ - Económico</SelectItem>
                        <SelectItem value="$$">$$ - Medio</SelectItem>
                        <SelectItem value="$$$">$$$ - Caro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Buscar Restaurantes
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Checkout Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🛒</span>
                  Finalizar Pedido
                </CardTitle>
                <CardDescription>API Declarativa + Validación</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleCheckoutSubmit}
                  toolname="checkout"
                  tooldescription="Finalizar pedido con info de entrega"
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Juan Pérez"
                      required
                      toolparamdescription="Nombre completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección de Entrega *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Av. Corrientes 1234, CABA"
                      required
                      toolparamdescription="Dirección completa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+54 11 1234-5678"
                      required
                      toolparamdescription="Número de teléfono"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span className="font-semibold">{cart.length}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-orange-600 dark:text-orange-400">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={cart.length === 0}
                    variant={cart.length === 0 ? 'secondary' : 'default'}
                  >
                    {cart.length === 0 ? 'Carrito Vacío' : 'Confirmar Pedido'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Restaurants */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🍽️</span>
                  Restaurantes Disponibles
                </CardTitle>
                <CardDescription>Click para ver menú</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {restaurants.map(restaurant => (
                  <Card
                    key={restaurant.id}
                    className="cursor-pointer hover:border-orange-500 transition-colors"
                    onClick={() => setSelectedRestaurant(
                      selectedRestaurant?.id === restaurant.id ? null : restaurant
                    )}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{restaurant.image}</span>
                          <div>
                            <h3 className="font-bold text-lg">{restaurant.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {restaurant.cuisine} • {restaurant.priceRange}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-1">
                            ⭐ {restaurant.rating}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {restaurant.deliveryTime}
                          </p>
                        </div>
                      </div>

                      {selectedRestaurant?.id === restaurant.id && (
                        <>
                          <Separator className="my-3" />
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm mb-2">Menú:</h4>
                            {restaurant.menu.map(item => (
                              <div
                                key={item.id}
                                className={`flex justify-between items-center p-2 rounded text-sm ${
                                  item.inStock
                                    ? 'bg-secondary'
                                    : 'bg-destructive/10 opacity-60'
                                }`}
                              >
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  {!item.inStock && (
                                    <Badge variant="destructive" className="ml-2 text-xs">
                                      No disponible
                                    </Badge>
                                  )}
                                </div>
                                <span className="font-semibold text-orange-600 dark:text-orange-400">
                                  ${item.price}
                                </span>
                              </div>
                            ))}
                            <p className="text-xs text-muted-foreground mt-2">
                              💡 Usa <code className="bg-muted px-1 rounded">addToCart</code> con restaurantId=&quot;{restaurant.id}&quot;
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Cart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🛒</span>
                  Carrito
                </CardTitle>
                <CardDescription>API Imperativa</CardDescription>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-4xl mb-2">🛒</p>
                    <p>Tu carrito está vacío</p>
                    <p className="text-sm mt-2">
                      Usa <code className="bg-muted px-1 rounded">addToCart</code>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                        <div>
                          <div className="font-medium">
                            {item.quantity}x {item.menuItem.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.restaurant.name}
                          </div>
                        </div>
                        <div className="font-bold text-orange-600 dark:text-orange-400">
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <div className="flex justify-between text-xl font-bold pt-2">
                      <span>Total:</span>
                      <span className="text-orange-600 dark:text-orange-400">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      onClick={() => {
                        setCart([])
                        showNotification('🗑️ Carrito vaciado')
                      }}
                      variant="destructive"
                      className="w-full mt-4"
                    >
                      Vaciar Carrito
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* WebMCP Info */}
            <Card className="shadow-lg border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <span className="text-2xl">ℹ️</span>
                  Herramientas WebMCP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="space-y-1">
                  <p className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">HTML</Badge>
                    <span className="font-medium">searchRestaurants</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">HTML</Badge>
                    <span className="font-medium">checkout</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">JS</Badge>
                    <span className="font-medium">addToCart</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">JS</Badge>
                    <span className="font-medium">viewCart</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">JS</Badge>
                    <span className="font-medium">clearCart</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">JS</Badge>
                    <span className="font-medium">getRestaurantInfo</span>
                  </p>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  💡 Abre &quot;Model Context Tool Inspector&quot; para ver todas las herramientas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground space-y-2">
          <p>Demo de WebMCP para &quot;Prepara tu webapp para los agentes de nuestro día a día&quot;</p>
          <p>🤖 Hecho con WebMCP, Next.js, shadcn/ui y ❤️</p>
        </footer>
      </div>
    </div>
  )
}
