# BARBOX - Frontend E-commerce

Frontend de tienda online de bebidas premium desarrollado con React y TypeScript.

## 🚀 Tecnologías

- React 19
- TypeScript
- React Router DOM
- Axios
- PayPal Integration

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración

1. Copia el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Edita `.env` con tus valores:
```env
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_PAYPAL_CLIENT_ID=tu_client_id
```

## 🏃 Ejecución

### Desarrollo
```bash
npm start
```

### Producción
```bash
npm run build
```

## 📁 Estructura

```
src/
├── components/    # Componentes reutilizables
├── pages/         # Páginas de la aplicación
├── services/      # Servicios de API
├── context/       # Contextos de React
├── hooks/         # Custom hooks
├── types/         # Tipos de TypeScript
├── utils/         # Utilidades
└── styles/        # Estilos CSS
```

## 🔗 Backend

Este frontend se conecta con el backend en: [backend](https://github.com/chuchobck/backend)
