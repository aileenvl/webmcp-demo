// WebMCP Type Definitions
export interface ToolDefinition {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
  execute: (params: any) => Promise<string | object>
}

// Check if WebMCP is available
export function isWebMCPAvailable(): boolean {
  if (typeof window === 'undefined') return false
  return 'modelContext' in navigator
}

// Register a tool with WebMCP
export function registerWebMCPTool(tool: ToolDefinition): boolean {
  if (!isWebMCPAvailable()) {
    console.warn('WebMCP not available. Tool registration skipped:', tool.name)
    return false
  }

  try {
    // @ts-ignore - WebMCP API not in TypeScript types yet
    navigator.modelContext.registerTool(tool)
    console.log(`✅ WebMCP tool registered: ${tool.name}`)
    return true
  } catch (error) {
    console.error('Failed to register WebMCP tool:', error)
    return false
  }
}

// Unregister a tool
export function unregisterWebMCPTool(toolName: string): boolean {
  if (!isWebMCPAvailable()) return false

  try {
    // @ts-ignore
    navigator.modelContext.unregisterTool(toolName)
    console.log(`🗑️ WebMCP tool unregistered: ${toolName}`)
    return true
  } catch (error) {
    console.error('Failed to unregister WebMCP tool:', error)
    return false
  }
}

// Provide context with multiple tools at once
export function provideWebMCPContext(tools: ToolDefinition[]): boolean {
  if (!isWebMCPAvailable()) {
    console.warn('WebMCP not available. Context not provided.')
    return false
  }

  try {
    // @ts-ignore
    navigator.modelContext.provideContext({ tools })
    console.log(`✅ WebMCP context provided with ${tools.length} tools`)
    return true
  } catch (error) {
    console.error('Failed to provide WebMCP context:', error)
    return false
  }
}
