'use client'

import { useEffect, useState, useRef } from 'react'
import { restaurants, type Restaurant, type CartItem } from '@/lib/mock-data'
import { registerWebMCPTool, isWebMCPAvailable } from '@/lib/webmcp'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Search, ShoppingCart, UtensilsCrossed, Info, Trash2, Star, Clock } from 'lucide-react'

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [webmcpStatus, setWebmcpStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')

  const cartRef = useRef<CartItem[]>(cart)

  // Keep cartRef in sync with cart state
  useEffect(() => {
    cartRef.current = cart
  }, [cart])

  useEffect(() => {
    const available = isWebMCPAvailable()
    setWebmcpStatus(available ? 'available' : 'unavailable')

    if (!available) {
      console.warn('⚠️ WebMCP not available')
      return
    }

    registerImperativeTools()
    setupWebMCPEventListeners()

    return () => {
      window.removeEventListener('toolactivated', handleToolActivated)
      window.removeEventListener('toolcancel', handleToolCancel)
    }
  }, [cart])


  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const cuisine = formData.get('cuisine') as string
    const priceRange = formData.get('priceRange') as string

    console.log('🔍 searchRestaurants submitted:', { cuisine, priceRange })

    let filtered = restaurants
    if (cuisine && cuisine !== 'all') {
      filtered = filtered.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase())
    }
    if (priceRange && priceRange !== 'all') {
      filtered = filtered.filter(r => r.priceRange === priceRange)
    }

    const response = {
      success: true,
      count: filtered.length,
      restaurants: filtered.map(r => ({
        id: r.id,
        name: r.name,
        cuisine: r.cuisine,
        priceRange: r.priceRange,
        rating: r.rating,
        deliveryTime: r.deliveryTime,
        menu: r.menu.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          inStock: item.inStock
        }))
      })),
      message: `Found ${filtered.length} restaurants`
    }

    showNotification(`🔍 Found ${filtered.length} restaurants`)
    console.log('✅ Search complete:', response)

    // WebMCP requires respondWith() when preventDefault() is called
    const nativeEvent = event.nativeEvent as any
    if (nativeEvent.respondWith) {
      nativeEvent.respondWith(Promise.resolve(response))
    }

    return response
  }

  const handleCheckoutSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const phone = formData.get('phone') as string

    console.log('📦 checkout submitted:', { name, address, phone })

    const currentCart = cartRef.current

    if (!name || !address || !phone) {
      showNotification('❌ All fields required')
      const error = { success: false, error: 'All fields required: name, address, and phone number' }
      const nativeEvent = event.nativeEvent as any
      if (nativeEvent.respondWith) {
        nativeEvent.respondWith(Promise.resolve(error))
      }
      return error
    }

    if (currentCart.length === 0) {
      showNotification('❌ Cart is empty')
      const error = { success: false, error: 'Cart is empty. Use addToCart tool to add items first.' }
      const nativeEvent = event.nativeEvent as any
      if (nativeEvent.respondWith) {
        nativeEvent.respondWith(Promise.resolve(error))
      }
      return error
    }

    const total = currentCart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
    const orderId = `ORD-${Date.now()}`

    const response = {
      success: true,
      orderId,
      customerName: name,
      deliveryAddress: address,
      phone,
      total: `$${total.toFixed(2)}`,
      itemCount: currentCart.length,
      items: currentCart.map(item => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.menuItem.price
      })),
      estimatedDelivery: '30-40 minutes',
      message: `Order ${orderId} confirmed!`
    }

    // Clear cart and show notification
    setCart([])
    showNotification(`✅ Order ${orderId} confirmed!`)
    console.log('✅ Checkout complete:', response)

    // WebMCP requires respondWith() when preventDefault() is called
    const nativeEvent = event.nativeEvent as any
    if (nativeEvent.respondWith) {
      nativeEvent.respondWith(Promise.resolve(response))
    }

    return response
  }

  const handleAddToCartSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const restaurantId = formData.get('restaurantId') as string
    const menuItemId = formData.get('menuItemId') as string
    const quantity = parseInt(formData.get('quantity') as string)

    console.log('🛒 addToCart submitted:', { restaurantId, menuItemId, quantity })

    const restaurant = restaurants.find(r => r.id === restaurantId)
    if (!restaurant) {
      console.log('❌ Restaurant not found:', restaurantId)
      const error = { success: false, error: `Restaurant not found: ${restaurantId}. Available IDs: ${restaurants.map(r => r.id).join(', ')}` }
      showNotification('❌ Restaurant not found')
      const nativeEvent = event.nativeEvent as any
      if (nativeEvent.respondWith) {
        nativeEvent.respondWith(Promise.resolve(error))
      }
      return error
    }

    const menuItem = restaurant.menu.find(m => m.id === menuItemId)
    if (!menuItem) {
      console.log('❌ Menu item not found:', menuItemId)
      const error = { success: false, error: `Item not found: ${menuItemId}. Available IDs in ${restaurant.name}: ${restaurant.menu.map(m => m.id).join(', ')}` }
      showNotification('❌ Menu item not found')
      const nativeEvent = event.nativeEvent as any
      if (nativeEvent.respondWith) {
        nativeEvent.respondWith(Promise.resolve(error))
      }
      return error
    }

    if (!menuItem.inStock) {
      console.log('❌ Item out of stock:', menuItem.name)
      const error = { success: false, error: `${menuItem.name} is out of stock` }
      showNotification(`❌ ${menuItem.name} is out of stock`)
      const nativeEvent = event.nativeEvent as any
      if (nativeEvent.respondWith) {
        nativeEvent.respondWith(Promise.resolve(error))
      }
      return error
    }

    // Add to cart
    setCart(prev => [...prev, { menuItem, restaurant, quantity, customizations: {} }])

    const response = {
      success: true,
      message: `Added ${quantity}x ${menuItem.name} to cart`,
      cartCount: cart.length + 1
    }

    showNotification(`✅ ${quantity}x ${menuItem.name} added!`)
    console.log('✅ addToCart complete:', response)

    // WebMCP requires respondWith() when preventDefault() is called
    const nativeEvent = event.nativeEvent as any
    if (nativeEvent.respondWith) {
      nativeEvent.respondWith(Promise.resolve(response))
    }

    return response
  }

  const registerImperativeTools = () => {

    registerWebMCPTool({
      name: 'viewCart',
      description: 'View cart contents',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => {
        console.log('🤖 viewCart called')
        const currentCart = cartRef.current

        if (currentCart.length === 0) {
          console.log('📤 Cart is empty')
          return { message: 'Cart is empty' }
        }

        const total = currentCart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
        const response = {
          items: currentCart.map(item => ({
            name: item.menuItem.name,
            quantity: item.quantity,
            price: item.menuItem.price
          })),
          total: total.toFixed(2),
          itemCount: currentCart.length
        }
        console.log('📤 Returning:', response)
        return response
      }
    })

    registerWebMCPTool({
      name: 'clearCart',
      description: 'Clear the shopping cart',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => {
        console.log('🤖 clearCart called')
        const currentCart = cartRef.current
        const itemCount = currentCart.length
        setCart([])
        const response = { success: true, message: `Removed ${itemCount} items` }
        console.log('📤 Returning:', response)
        showNotification('🗑️ Cart cleared')
        return response
      }
    })

    registerWebMCPTool({
      name: 'getRestaurantInfo',
      description: 'Get restaurant information and menu',
      inputSchema: {
        type: 'object',
        properties: { restaurantId: { type: 'string' } },
        required: ['restaurantId']
      },
      execute: async ({ restaurantId }) => {
        console.log('🤖 getRestaurantInfo called with:', { restaurantId })
        const restaurant = restaurants.find(r => r.id === restaurantId)

        if (!restaurant) {
          console.log('❌ Restaurant not found:', restaurantId)
          return { success: false, error: `Restaurant not found: ${restaurantId}. Available IDs: ${restaurants.map(r => r.id).join(', ')}` }
        }

        const response = {
          success: true,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          rating: restaurant.rating,
          menu: restaurant.menu.map(i => ({
            id: i.id,
            name: i.name,
            description: i.description,
            price: i.price,
            inStock: i.inStock
          }))
        }
        console.log('📤 Returning:', response)
        return response
      }
    })
  }

  const setupWebMCPEventListeners = () => {
    window.addEventListener('toolactivated', handleToolActivated)
    window.addEventListener('toolcancel', handleToolCancel)
  }

  const handleToolActivated = () => showNotification('🤖 AI Agent is active')
  const handleToolCancel = () => showNotification('⚠️ Operation cancelled')

  const showNotification = (message: string) => {
    console.log('🔔 Notification:', message)
    setNotification(message)
    setTimeout(() => setNotification(null), 5000)
  }


  const cartTotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-8 py-4 rounded-lg shadow-2xl animate-in slide-in-from-right text-lg font-semibold border-2 border-blue-400">
          {notification}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                FoodHub
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                WebMCP Demo - AI-Ready Restaurant Platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart className="w-8 h-8 text-orange-600" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold min-w-[24px] h-6 flex items-center justify-center animate-pulse">
                    {cart.length}
                  </Badge>
                )}
              </div>
              <Badge variant={webmcpStatus === 'available' ? 'default' : 'destructive'} className="text-sm px-4 py-2">
                {webmcpStatus === 'available' ? 'WebMCP Active' : 'WebMCP Unavailable'}
              </Badge>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Restaurants
                </CardTitle>
                <CardDescription>Declarative API (HTML) - Visible when agent uses it</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSearchSubmit}
                  toolname="searchRestaurants"
                  tooldescription="Search restaurants by cuisine type and price range. Returns restaurant details including full menu with item IDs for ordering."
                  toolautosubmit="true"
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="cuisine">Cuisine Type</Label>
                    <select
                      id="cuisine"
                      name="cuisine"
                      defaultValue="all"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="all">All Cuisines</option>
                      <option value="mexicana">Mexican</option>
                      <option value="italiana">Italian</option>
                      <option value="japonesa">Japanese</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range</Label>
                    <select
                      id="priceRange"
                      name="priceRange"
                      defaultValue="all"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="all">All Prices</option>
                      <option value="$">$ - Budget</option>
                      <option value="$$">$$ - Moderate</option>
                      <option value="$$$">$$$ - Premium</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full">Search Restaurants</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </CardTitle>
                <CardDescription>Declarative API (HTML) - Visible when agent uses it</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleAddToCartSubmit}
                  toolname="addToCart"
                  tooldescription="Add product to shopping cart. Requires restaurant ID, menu item ID, and quantity."
                  toolautosubmit="true"
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="restaurantId">Restaurant ID</Label>
                    <Input
                      id="restaurantId"
                      name="restaurantId"
                      placeholder="e.g., taco-loco, pizza-pronto, sushi-zen"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menuItemId">Menu Item ID</Label>
                    <Input
                      id="menuItemId"
                      name="menuItemId"
                      placeholder="e.g., lasagna, taco-carnitas"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      max="10"
                      defaultValue="1"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Add to Cart</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Checkout
                </CardTitle>
                <CardDescription>Declarative API (HTML) - Visible when agent uses it</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleCheckoutSubmit}
                  toolname="checkout"
                  tooldescription="Complete order with delivery information. Requires name, address, and phone number."
                  toolautosubmit="true"
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input id="address" name="address" placeholder="123 Main St" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1 234 567 8900" required />
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Items:</span>
                    <span className="font-semibold">{cart.length}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-orange-600">${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={cart.length === 0}>
                    {cart.length === 0 ? 'Cart Empty' : 'Confirm Order'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5" />
                  Available Restaurants
                </CardTitle>
                <CardDescription>Click to view menu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {restaurants.map(restaurant => (
                  <Card
                    key={restaurant.id}
                    className="cursor-pointer hover:border-orange-500 transition-colors"
                    onClick={() => setSelectedRestaurant(selectedRestaurant?.id === restaurant.id ? null : restaurant)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{restaurant.name}</h3>
                          <p className="text-sm text-muted-foreground">{restaurant.cuisine} • {restaurant.priceRange}</p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{restaurant.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{restaurant.deliveryTime}</span>
                          </div>
                        </div>
                      </div>
                      {selectedRestaurant?.id === restaurant.id && (
                        <>
                          <Separator className="my-3" />
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm mb-2">Menu:</h4>
                            {restaurant.menu.map(item => (
                              <div key={item.id} className={`flex justify-between items-center p-2 rounded text-sm ${item.inStock ? 'bg-secondary' : 'bg-destructive/10 opacity-60'}`}>
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  {!item.inStock && <Badge variant="destructive" className="ml-2 text-xs">Out of Stock</Badge>}
                                </div>
                                <span className="font-semibold text-orange-600">${item.price}</span>
                              </div>
                            ))}
                            <p className="text-xs text-muted-foreground mt-2">
                              Use <code className="bg-muted px-1 rounded">addToCart</code> with restaurantId=&quot;{restaurant.id}&quot;
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Shopping Cart
                </CardTitle>
                <CardDescription>Imperative API</CardDescription>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Your cart is empty</p>
                    <p className="text-sm mt-2">Use <code className="bg-muted px-1 rounded">addToCart</code> to add items</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                        <div>
                          <div className="font-medium">{item.quantity}x {item.menuItem.name}</div>
                          <div className="text-sm text-muted-foreground">{item.restaurant.name}</div>
                        </div>
                        <div className="font-bold text-orange-600">${(item.menuItem.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold pt-2">
                      <span>Total:</span>
                      <span className="text-orange-600">${cartTotal.toFixed(2)}</span>
                    </div>
                    <Button
                      onClick={() => { setCart([]); showNotification('Cart cleared') }}
                      variant="destructive"
                      className="w-full mt-4"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Cart
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Info className="w-5 h-5" />
                  WebMCP Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="space-y-1">
                  <p className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100">HTML</Badge>
                    <span className="font-medium">searchRestaurants</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100">HTML</Badge>
                    <span className="font-medium">addToCart</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100">HTML</Badge>
                    <span className="font-medium">checkout</span>
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
                  Open &quot;Model Context Tool Inspector&quot; to see all tools
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground space-y-2">
          <p>WebMCP Demo for &quot;Prepara tu webapp para los agentes de nuestro día a día&quot;</p>
          <p>Built with WebMCP, Next.js, shadcn/ui, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  )
}
