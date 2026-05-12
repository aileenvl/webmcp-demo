# 🌮 TacoAgent - WebMCP Demo

Demo interactivo de WebMCP (Web Model Context Protocol) para la charla **"Prepara tu webapp para los agentes de nuestro día a día"**.

Este proyecto muestra cómo implementar WebMCP en una aplicación web real usando tanto la API Declarativa (HTML) como la API Imperativa (JavaScript).

## 🎯 ¿Qué es esto?

Una aplicación de food delivery ficticia que expone herramientas estructuradas a agentes de IA usando WebMCP. Los agentes pueden:

- 🔍 Buscar restaurantes por tipo de cocina y precio
- 🛒 Agregar productos al carrito
- 📋 Ver el contenido del carrito
- ✅ Finalizar pedidos con información de entrega
- 🗑️ Vaciar el carrito
- 📊 Obtener información detallada de restaurantes

## ✨ Características

### API Declarativa (HTML)
- Formulario de búsqueda de restaurantes con atributos `toolname`, `tooldescription`
- Formulario de checkout con validación
- Feedback visual automático cuando un agente activa el formulario

### API Imperativa (JavaScript)
- 4 herramientas registradas con `navigator.modelContext.registerTool()`:
  - `addToCart`: Agregar productos al carrito
  - `viewCart`: Ver contenido del carrito
  - `clearCart`: Vaciar el carrito
  - `getRestaurantInfo`: Obtener info de restaurantes

### Feedback Visual
- CSS pseudo-clases `:tool-form-active` y `:tool-submit-active`
- Eventos `toolactivated` y `toolcancel`
- Notificaciones en tiempo real
- Indicadores de estado WebMCP

### Manejo de Errores
- Validación de stock (productos no disponibles)
- Validación de cantidades (1-10)
- Mensajes de error descriptivos para que los agentes se auto-corrijan
- Validación de campos requeridos en checkout

## 🚀 Instalación

### Prerrequisitos

1. **Chrome 146+ Canary** con el flag WebMCP habilitado:
   ```
   chrome://flags/#enable-webmcp-testing
   ```

2. **Extensión Model Context Tool Inspector**:
   - Busca en Chrome Web Store: "WebMCP Inspector" o "Model Context Tool Inspector"
   - Esta extensión te permite ver y probar las herramientas registradas

### Setup del proyecto

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en Chrome Canary.

## 📖 Cómo usar el demo

### Para humanos:

1. Navega la interfaz normalmente
2. Haz click en restaurantes para ver sus menús
3. Completa los formularios de búsqueda y checkout manualmente

### Para agentes (con WebMCP habilitado):

1. Abre la extensión "Model Context Tool Inspector"
2. Verás 6 herramientas disponibles
3. Puedes ejecutarlas con lenguaje natural:
   - "Busca restaurantes mexicanos"
   - "Agrega 3 tacos de carnitas al carrito"
   - "Muéstrame qué hay en el carrito"
   - "Finaliza el pedido para Juan Pérez"

## 🏗️ Arquitectura

```
webmcp-demo/
├── app/
│   ├── page.tsx          # Componente principal
│   ├── layout.tsx        # Layout de Next.js
│   └── globals.css       # Estilos WebMCP
├── lib/
│   ├── mock-data.ts      # Datos ficticios
│   └── webmcp.ts         # Utilidades WebMCP
└── README.md
```

## 🔧 Herramientas disponibles

### 1. searchRestaurants (Declarativa)
Busca restaurantes por tipo de cocina y rango de precio.

### 2. checkout (Declarativa)
Finaliza el pedido con información de entrega.

### 3. addToCart (Imperativa)
Agrega un producto al carrito.

### 4. viewCart (Imperativa)
Ver el contenido actual del carrito.

### 5. clearCart (Imperativa)
Vaciar el carrito completamente.

### 6. getRestaurantInfo (Imperativa)
Obtener información detallada de un restaurante.

## 🎤 Para la presentación

### Demo sugerido (5-6 minutos):

1. **Mostrar estado inicial** - Indicador WebMCP activo
2. **API Declarativa** - Ejecutar búsqueda con la extensión
3. **API Imperativa** - Agregar items al carrito
4. **Validación** - Mostrar manejo de errores
5. **Checkout** - Finalizar pedido completo

## 📚 Recursos

- [WebMCP Specification](https://webmachinelearning.github.io/webmcp/)
- [Chrome Developer Blog](https://developer.chrome.com/blog/webmcp-epp)
- [Awesome WebMCP](https://github.com/webmcpnet/awesome-webmcp)

## 👤 Autor

Aileen Villanueva
- LinkedIn: [linkedin.com/in/aileen-villanueva-31155666/](https://www.linkedin.com/in/aileen-villanueva-31155666/)
- Twitter: [@aileenvl](https://twitter.com/aileenvl)

---

¡Buena suerte con tu charla! 🎉
