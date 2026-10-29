import type { ToolInput, ToolResult } from './demo-state'

export interface ToolDefinition {
  name: string
  description: string
  inputSchema: { type: 'object'; properties: Record<string, unknown>; required?: string[]; additionalProperties?: boolean }
  annotations?: { readOnlyHint?: boolean; consequentialHint?: boolean }
  execute: (params: ToolInput) => Promise<ToolResult>
}

export interface ModelContext {
  registerTool(tool: ToolDefinition, options: { signal: AbortSignal }): Promise<void> | void
}

export function getModelContext(): ModelContext | undefined {
  if (typeof document === 'undefined') return undefined
  const context = (document as Document & { modelContext?: ModelContext }).modelContext
  return typeof context?.registerTool === 'function' ? context : undefined
}

/** Retains unchanged registrations; aborts tools when their preconditions stop holding. */
export class ToolRegistry {
  private active = new Map<string, AbortController>()
  private queue = Promise.resolve()
  private disposed = false

  constructor(private readonly context: ModelContext) {}

  setTools(tools: ToolDefinition[]): Promise<void> {
    const operation = this.queue.then(async () => {
      if (this.disposed) return
      const names = new Set(tools.map(tool => tool.name))
      for (const [name, controller] of this.active) {
        if (!names.has(name)) { controller.abort(); this.active.delete(name) }
      }
      for (const tool of tools) {
        if (this.disposed || this.active.has(tool.name)) continue
        const controller = new AbortController()
        this.active.set(tool.name, controller)
        try {
          await this.context.registerTool(tool, { signal: controller.signal })
        } catch (error) {
          controller.abort()
          this.active.delete(tool.name)
          throw error
        }
      }
    })
    // Keep later state transitions usable even after a rejected registration.
    this.queue = operation.catch(() => {})
    return operation
  }

  dispose() {
    this.disposed = true
    for (const controller of this.active.values()) controller.abort()
    this.active.clear()
  }
}
