import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DemoStore } from '../.test-build/demo-state.js'
import { restaurants } from '../.test-build/mock-data.js'
import { ToolRegistry } from '../.test-build/webmcp.js'

test('only exposes actions that make sense in the current state', () => {
  const store = new DemoStore(restaurants)
  assert.deepEqual(store.toolNames(), ['getRestaurantInfo', 'viewCart'])
  store.run('getRestaurantInfo', { restaurantId: 'taco-loco' })
  assert.ok(store.toolNames().includes('addToCart'))
  store.run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'taco-carnitas', quantity: 2 })
  assert.ok(store.toolNames().includes('checkout'))
  store.run('clearCart', {})
  assert.ok(!store.toolNames().includes('checkout'))
})

test('rejects unavailable tools and invalid restaurant IDs without mutating state', () => {
  const store = new DemoStore(restaurants)
  assert.equal(store.run('checkout', {}).success, false)
  assert.equal(store.run('getRestaurantInfo', { restaurantId: 'missing' }).success, false)
  assert.equal(store.getSnapshot().selectedRestaurantId, null)
})

test('validates integer quantities, stock, IDs and selected restaurant', () => {
  const store = new DemoStore(restaurants)
  store.run('getRestaurantInfo', { restaurantId: 'taco-loco' })
  for (const quantity of [0, -1, 1.5, 11, NaN, '2']) {
    assert.equal(store.run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'taco-carnitas', quantity }).success, false)
  }
  assert.equal(store.run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'quesadilla', quantity: 1 }).success, false)
  assert.equal(store.run('addToCart', { restaurantId: 'pizza-pronto', menuItemId: 'margherita', quantity: 1 }).success, false)
  assert.equal(store.run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'missing', quantity: 1 }).success, false)
  assert.equal(store.getSnapshot().cart.length, 0)
})

test('consecutive tool calls use the latest cart immediately', () => {
  const store = new DemoStore(restaurants)
  store.run('getRestaurantInfo', { restaurantId: 'taco-loco' })
  store.run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'taco-carnitas', quantity: 2 })
  store.run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'burrito-asada', quantity: 1 })
  const response = store.run('viewCart', {})
  assert.equal(response.itemCount, 3)
  assert.equal(response.total, 40.97)
})

test('checkout requests review; only the UI approval method confirms a simulated order', () => {
  const store = new DemoStore(restaurants)
  store.run('getRestaurantInfo', { restaurantId: 'taco-loco' })
  store.run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'taco-carnitas', quantity: 1 })
  assert.equal(store.run('checkout', {}).status, 'pending-human-review')
  assert.equal(store.getSnapshot().cart.length, 1)
  assert.equal(store.run('confirmOrder', {}).success, false)
  assert.equal(store.confirmOrder().success, true)
  assert.equal(store.getSnapshot().cart.length, 0)
  assert.equal(store.confirmOrder().success, false)
})

test('changing the cart invalidates a previously requested review', () => {
  const store = new DemoStore(restaurants)
  store.run('getRestaurantInfo', { restaurantId: 'taco-loco' })
  store.run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'taco-carnitas', quantity: 1 })
  store.run('checkout', {})
  store.run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'burrito-asada', quantity: 1 })
  assert.equal(store.confirmOrder().success, false)
  assert.equal(store.getSnapshot().cart.length, 2)
})

test('tool registration is idempotent and aborts removed registrations', async () => {
  const registered = new Map()
  let calls = 0
  const registry = new ToolRegistry({ registerTool: async (tool, { signal }) => {
    calls++
    assert.ok(!registered.has(tool.name), 'duplicate tool registration')
    registered.set(tool.name, tool)
    signal.addEventListener('abort', () => registered.delete(tool.name), { once: true })
  } })
  const tool = { name: 'viewCart', description: 'View', inputSchema: { type: 'object', properties: {} }, execute: async () => ({}) }
  await registry.setTools([tool])
  await registry.setTools([tool])
  assert.equal(calls, 1)
  await registry.setTools([])
  assert.equal(registered.size, 0)
  registry.dispose()
})
