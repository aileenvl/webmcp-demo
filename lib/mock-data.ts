export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  customizations?: {
    name: string
    options: { label: string; price: number }[]
  }[]
  inStock: boolean
}

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  priceRange: '$' | '$$' | '$$$'
  rating: number
  deliveryTime: string
  image: string
  menu: MenuItem[]
}

export const restaurants: Restaurant[] = [
  {
    id: 'taco-loco',
    name: 'Taco Loco',
    cuisine: 'Mexicana',
    priceRange: '$',
    rating: 4.5,
    deliveryTime: '25-35 min',
    image: '🌮',
    menu: [
      {
        id: 'taco-carnitas',
        name: 'Tacos de Carnitas',
        description: 'Tres tacos de cerdo con cebolla, cilantro y salsa verde',
        price: 12.99,
        category: 'Tacos',
        image: '🌮',
        customizations: [
          {
            name: 'Salsa',
            options: [
              { label: 'Verde (picante)', price: 0 },
              { label: 'Roja (muy picante)', price: 0 },
              { label: 'Sin salsa', price: 0 }
            ]
          },
          {
            name: 'Extras',
            options: [
              { label: 'Guacamole', price: 2.50 },
              { label: 'Queso extra', price: 1.50 },
              { label: 'Jalapeños', price: 1.00 }
            ]
          }
        ],
        inStock: true
      },
      {
        id: 'burrito-asada',
        name: 'Burrito de Asada',
        description: 'Burrito grande con carne asada, arroz, frijoles y queso',
        price: 14.99,
        category: 'Burritos',
        image: '🌯',
        customizations: [
          {
            name: 'Tamaño',
            options: [
              { label: 'Regular', price: 0 },
              { label: 'Grande', price: 3.00 }
            ]
          }
        ],
        inStock: true
      },
      {
        id: 'quesadilla',
        name: 'Quesadilla de Queso',
        description: 'Quesadilla con queso Oaxaca derretido',
        price: 9.99,
        category: 'Antojitos',
        image: '🧀',
        inStock: false
      }
    ]
  },
  {
    id: 'pizza-pronto',
    name: 'Pizza Pronto',
    cuisine: 'Italiana',
    priceRange: '$$',
    rating: 4.7,
    deliveryTime: '30-40 min',
    image: '🍕',
    menu: [
      {
        id: 'margherita',
        name: 'Pizza Margherita',
        description: 'Tomate, mozzarella fresca, albahaca',
        price: 16.99,
        category: 'Pizzas',
        image: '🍕',
        customizations: [
          {
            name: 'Tamaño',
            options: [
              { label: 'Mediana', price: 0 },
              { label: 'Grande', price: 4.00 },
              { label: 'Familiar', price: 8.00 }
            ]
          }
        ],
        inStock: true
      },
      {
        id: 'pepperoni',
        name: 'Pizza Pepperoni',
        description: 'Salsa de tomate, mozzarella, pepperoni',
        price: 18.99,
        category: 'Pizzas',
        image: '🍕',
        inStock: true
      },
      {
        id: 'lasagna',
        name: 'Lasagna',
        description: 'Lasagna clásica con carne, bechamel y queso parmesano',
        price: 15.99,
        category: 'Pasta',
        image: '🍝',
        inStock: true
      }
    ]
  },
  {
    id: 'sushi-zen',
    name: 'Sushi Zen',
    cuisine: 'Japonesa',
    priceRange: '$$$',
    rating: 4.8,
    deliveryTime: '40-50 min',
    image: '🍱',
    menu: [
      {
        id: 'california-roll',
        name: 'California Roll',
        description: 'Rollo con cangrejo, aguacate y pepino',
        price: 12.99,
        category: 'Rolls',
        image: '🍣',
        inStock: true
      },
      {
        id: 'combo-sashimi',
        name: 'Combo Sashimi',
        description: 'Variedad de pescado fresco (12 piezas)',
        price: 28.99,
        category: 'Combos',
        image: '🍱',
        inStock: true
      }
    ]
  }
]

export interface CartItem {
  menuItem: MenuItem
  restaurant: Restaurant
  quantity: number
  customizations: Record<string, string>
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'preparing' | 'on-the-way' | 'delivered'
  deliveryAddress: string
  customerName: string
  createdAt: Date
}
