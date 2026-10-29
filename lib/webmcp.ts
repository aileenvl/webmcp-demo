import type { ToolResult } from './demo-state'

export interface ToolDefinition {
  name: string
  description: string
  inputSchema: { type: 'object'; properties: Record<string, unknown>; required?: string[]; additionalProperties?: boolean }
  annotations?: { readOnlyHint?: boolean; consequentialHint?: boolean }
  execute: (params: unknown, options: { signal: AbortSignal }) => Promise<ToolResult>
}

export interface ModelContext {
  registerTool(tool: ToolDefinition, options: { signal: AbortSignal }): Promise<void>
}

/** The invocation signal is distinct from the signal used to unregister a tool. */
export function createToolCallback(action: (params: unknown) => ToolResult): ToolDefinition['execute'] {
  return async (params, { signal }) => {
    signal.throwIfAborted()
    return action(params)
  }
}

export function getModelContext(): ModelContext | undefined {
  if (typeof document === 'undefined') return undefined
  const context = (document as Document & { modelContext?: ModelContext }).modelContext
  return typeof context?.registerTool === 'function' ? context : undefined
}

/** Retains unchanged registrations; aborts tools when their preconditions stop holding. */
export class ToolRegistry {
  private active = new Map<string, AbortController>()
  private desired: ToolDefinition[] = []
  private queue = Promise.resolve()
  private disposed = false

  constructor(private readonly context: ModelContext) {}

  setTools(tools: ToolDefinition[]): Promise<void> {
    if (this.disposed) return Promise.resolve()
    this.desired = tools
    const names = new Set(tools.map(tool => tool.name))
    // Withdraw immediately, even when an earlier registerTool promise is pending.
    for (const [name, controller] of this.active) {
      if (!names.has(name)) { controller.abort(); this.active.delete(name) }
    }
    const operation = this.queue.then(async () => {
      if (this.disposed) return
      for (const tool of this.desired) {
        if (this.disposed || !this.desired.some(desired => desired.name === tool.name) || this.active.has(tool.name)) continue
        const controller = new AbortController()
        this.active.set(tool.name, controller)
        try {
          await this.context.registerTool(tool, { signal: controller.signal })
        } catch (error) {
          const withdrawn = controller.signal.aborted
          controller.abort()
          if (this.active.get(tool.name) === controller) this.active.delete(tool.name)
          if (!withdrawn) throw error
        }
      }
    })
    // Keep later state transitions usable even after a rejected registration.
    this.queue = operation.catch(() => {})
    return operation
  }

  dispose() {
    this.disposed = true
    this.desired = []
    for (const controller of this.active.values()) controller.abort()
    this.active.clear()
  }
}
