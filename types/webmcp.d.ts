// WebMCP Type Declarations
// Extends HTML attributes to support WebMCP custom attributes

declare namespace React {
  interface FormHTMLAttributes<T> {
    toolname?: string
    tooldescription?: string
  }

  interface InputHTMLAttributes<T> {
    toolparamdescription?: string
  }

  interface SelectHTMLAttributes<T> {
    toolparamdescription?: string
  }

  interface TextareaHTMLAttributes<T> {
    toolparamdescription?: string
  }
}

// WebMCP Navigator API
interface Navigator {
  modelContext?: {
    registerTool: (tool: {
      name: string
      description: string
      inputSchema: {
        type: 'object'
        properties: Record<string, any>
        required?: string[]
      }
      execute: (params: any) => Promise<string | object>
    }) => void
    unregisterTool: (toolName: string) => void
    provideContext: (context: { tools: any[] }) => void
  }
}

// WebMCP Events
interface WindowEventMap {
  toolactivated: CustomEvent<{ toolName: string }>
  toolcancel: CustomEvent<{ toolName: string }>
}

// Form submit event extension
interface SubmitEvent extends Event {
  agentInvoked?: boolean
  respondWith?: (response: any) => void
}
