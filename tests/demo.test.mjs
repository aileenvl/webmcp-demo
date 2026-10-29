import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DemoStore } from '../.test-build/demo-state.js'
import { restaurants } from '../.test-build/mock-data.js'
import { ToolRegistry } from '../.test-build/webmcp.js'
import * as webmcp from '../.test-build/webmcp.js'

test('untrusted non-object inputs are rejected without throwing or changing the cart', () => {
  const store = new DemoStore(restaurants)
  store.run('getRestaurantInfo', { restaurantId: 'taco-loco' })
  store.run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'taco-carnitas', quantity: 1 })
  const before = store.getSnapshot()
  for (const input of [null, undefined, [], true, 1, '{}']) {
    assert.equal(store.search(input).success, false)
    assert.equal(store.run('viewCart', input).success, false)
    assert.equal(store.run('checkout', input).success, false)
    assert.equal(store.run('addToCart', input).success, false)
  }
  assert.equal(store.getSnapshot(), before)
})

test('runtime validation enforces additionalProperties for read and write tools', () => {
  const store = new DemoStore(restaurants)
  store.run('getRestaurantInfo', { restaurantId: 'taco-loco' })
  store.run('addToCart', { restaurantId: 'taco-loco', menuItemId: 'taco-carnitas', quantity: 1 })
  const before = store.getSnapshot()
  assert.equal(store.search({ cuisine: 'mexicana', unexpected: true }).success, false)
  assert.equal(store.run('viewCart', { unexpected: true }).success, false)
  assert.equal(store.run('clearCart', { force: true }).success, false)
  assert.equal(store.run('checkout', { confirm: true }).success, false)
  assert.equal(store.getSnapshot(), before)
})

test('search normalizes accepted cuisine names and rejects non-string prices', () => {
  const store = new DemoStore(restaurants)
  assert.equal(store.search({ cuisine: 'ALL', priceRange: 'all' }).restaurants.length, 3)
  assert.equal(store.search({ cuisine: 'MEXICANA', priceRange: '$' }).restaurants[0].id, 'taco-loco')
  assert.equal(store.search({ priceRange: ['$'] }).success, false)
})

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

test('withdrawing tools aborts pending registrations and skips obsolete queued tools', async () => {
  const registered = new Set()
  const calls = []
  let release
  const pending = new Promise(resolve => { release = resolve })
  const registry = new ToolRegistry({ registerTool: async (tool, { signal }) => {
    calls.push(tool.name)
    registered.add(tool.name)
    signal.addEventListener('abort', () => registered.delete(tool.name), { once: true })
    await pending
  } })
  const definition = name => ({ name, description: name, inputSchema: { type: 'object', properties: {} }, execute: async () => ({}) })
  const first = registry.setTools([definition('viewCart'), definition('checkout')])
  await Promise.resolve()
  const second = registry.setTools([])
  const withdrewImmediately = registered.size === 0
  release()
  await Promise.all([first, second])
  assert.equal(withdrewImmediately, true)
  assert.deepEqual(calls, ['viewCart'])
  assert.equal(registered.size, 0)
  registry.dispose()
})

test('an aborted execution signal prevents a native callback from mutating the cart', async () => {
  const store = new DemoStore(restaurants)
  store.run('getRestaurantInfo', { restaurantId: 'taco-loco' })
  const callback = webmcp.createToolCallback(input => store.run('addToCart', input))
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(callback({ restaurantId: 'taco-loco', menuItemId: 'taco-carnitas', quantity: 2 }, { signal: controller.signal }), { name: 'AbortError' })
  assert.equal(store.getSnapshot().cart.length, 0)
})

test('cancelling one invocation does not withdraw the tool registration', async () => {
  const registered = new Map()
  const registry = new ToolRegistry({ registerTool: async (tool, { signal }) => {
    registered.set(tool.name, tool)
    signal.addEventListener('abort', () => registered.delete(tool.name), { once: true })
  } })
  const store = new DemoStore(restaurants)
  const tool = { name: 'viewCart', description: 'Current cart', inputSchema: { type: 'object', properties: {} }, execute: webmcp.createToolCallback(input => store.run('viewCart', input)) }
  await registry.setTools([tool])
  const invocation = new AbortController()
  invocation.abort()
  await assert.rejects(tool.execute({}, { signal: invocation.signal }), { name: 'AbortError' })
  assert.equal(registered.has('viewCart'), true)
  assert.equal((await tool.execute({}, { signal: new AbortController().signal })).itemCount, 0)
  registry.dispose()
  assert.equal(registered.size, 0)
})
