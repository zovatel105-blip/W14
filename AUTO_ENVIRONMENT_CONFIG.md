# ✅ Configuración Automática de Entorno para Emergent.sh

Este sistema permite que tu aplicación detecte automáticamente su entorno y configure las URLs y parámetros de conexión sin necesidad de archivos .env manuales ni rebuilds al cambiar de cuenta.

## 🚀 Características

- **Detección automática** del entorno (local, Emergent.sh, producción)
- **Sin archivos .env** requeridos para funcionar entre cuentas
- **Sin rebuilds** necesarios al mover proyectos
- **Fallbacks inteligentes** para desarrollo y casos edge
- **Configuración dinámica** mediante API central de Emergent

## 📁 Arquitectura del Sistema

### Frontend (`/frontend/src/config/`)

```
config/
├── env.js          # Detección automática de entorno
└── config.js       # Configuración principal actualizada
```

### Backend (`/backend/`)

```
backend/
├── env_detector.py # Detección automática para backend
└── config.py       # Configuración principal actualizada
```

## 🌍 Detección de Entornos

### 1. Entorno Local (Desarrollo)
- **Detecta**: `hostname.includes("localhost")`
- **Frontend**: `http://localhost:8001`
- **Backend**: `mongodb://localhost:27017`

### 2. Entorno Emergent.sh
- **Detecta**: `hostname.endsWith(".emergent.sh")`
- **Extrae subdomain**: `cuenta.emergent.sh` → `cuenta`
- **Frontend**: `https://api.cuenta.emergent.sh`
- **Backend**: `mongodb://mongo.cuenta.emergent.sh:27017`

### 3. Dominio Personalizado
- **Detecta**: Cualquier otro dominio
- **Consulta**: API central `https://config.emergent.sh/resolve`
- **Fallback**: URLs por defecto de Emergent

## 💻 Uso en Frontend

```javascript
// Importar configuración automática
import { ENV } from "./config/env";

// Usar en llamadas API
fetch(`${ENV.API_URL}/api/polls`)
  .then(res => res.json())
  .then(data => console.log("Datos:", data));

// Verificar entorno
console.log("Entorno actual:", {
  hostname: ENV.HOSTNAME,
  apiUrl: ENV.API_URL,
  isLocal: ENV.IS_LOCAL,
  isEmergent: ENV.IS_EMERGENT,
  subdomain: ENV.SUBDOMAIN
});
```

### Integración en App.js

```javascript
import AppConfig from './config/config';

function App() {
  const [configReady, setConfigReady] = useState(false);

  useEffect(() => {
    AppConfig.initialize().then(() => {
      setConfigReady(true);
    });
  }, []);

  if (!configReady) {
    return <div>Configurando entorno...</div>;
  }

  // App lista para usar
}
```

## 🔧 Uso en Backend

```python
# Importar configuración automática
from config import config

# Usar configuración detectada
print(f"MongoDB URL: {config.MONGO_URL}")
print(f"Database: {config.DB_NAME}")
print(f"Frontend URL: {config.FRONTEND_URL}")

# Inicializar al inicio del servidor
config.initialize_environment()
```

### Integración en server.py

```python
# Al inicio del servidor
config.initialize_environment()

# Usar configuración automática
mongo_url = config.MONGO_URL
client = AsyncIOMotorClient(mongo_url)
db = client[config.DB_NAME]
```

## 🔄 Ejemplos de Funcionamiento

### Cuenta: `miapp.emergent.sh`

**Frontend detecta:**
```javascript
{
  HOSTNAME: "miapp.emergent.sh",
  API_URL: "https://api.miapp.emergent.sh",
  IS_EMERGENT: true,
  SUBDOMAIN: "miapp"
}
```

**Backend configura:**
```python
MONGO_URL = "mongodb://mongo.miapp.emergent.sh:27017"
DB_NAME = "miapp_social_media"
FRONTEND_URL = "https://miapp.emergent.sh"
CORS_ORIGINS = ["https://miapp.emergent.sh"]
```

### Cuenta: `empresa.emergent.sh`

**Frontend detecta:**
```javascript
{
  HOSTNAME: "empresa.emergent.sh", 
  API_URL: "https://api.empresa.emergent.sh",
  IS_EMERGENT: true,
  SUBDOMAIN: "empresa"
}
```

**Backend configura:**
```python
MONGO_URL = "mongodb://mongo.empresa.emergent.sh:27017"
DB_NAME = "empresa_social_media"
FRONTEND_URL = "https://empresa.emergent.sh"
CORS_ORIGINS = ["https://empresa.emergent.sh"]
```

### Desarrollo Local

**Frontend detecta:**
```javascript
{
  HOSTNAME: "localhost",
  API_URL: "http://localhost:8001", 
  IS_LOCAL: true,
  IS_EMERGENT: false
}
```

**Backend configura:**
```python
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "social_media_app"
FRONTEND_URL = "http://localhost:3000"
CORS_ORIGINS = ["http://localhost:3000"]
```

## 🛠️ Variables de Entorno Opcionales

El sistema funciona sin variables de entorno, pero puedes override cualquier valor:

### Frontend
```bash
# Opcional - override detección automática
REACT_APP_BACKEND_URL=https://api.custom.domain.com
```

### Backend
```bash
# Opcional - override detección automática
MONGO_URL=mongodb://custom-mongo:27017
DB_NAME=custom_database
FRONTEND_URL=https://custom-frontend.com
SECRET_KEY=custom-secret-key
```

## 🔧 Configuración Avanzada

### API Central de Configuración

Para dominios personalizados, el sistema consulta:
```
GET https://config.emergent.sh/resolve?host=mi-dominio.com
```

Respuesta esperada:
```json
{
  "api_url": "https://api.mi-backend.com",
  "mongo_url": "mongodb://mongo.mi-backend.com:27017",
  "database": "mi_database"
}
```

### Fallbacks y Errores

1. **Error de red**: Usa URLs por defecto de Emergent
2. **Hostname no reconocido**: Usa configuración local
3. **Variables de entorno presentes**: Tienen prioridad sobre detección

## ✅ Ventajas

1. **Cero configuración**: Funciona inmediatamente en cualquier cuenta
2. **Portabilidad**: Mueve proyectos sin cambios
3. **Desarrollo amigable**: Detecta automáticamente localhost
4. **Producción segura**: Configuración específica por cuenta
5. **Extensible**: Fácil agregar nuevos entornos

## 🚀 Migración desde .env

### Antes (con .env)
```bash
# frontend/.env
REACT_APP_BACKEND_URL=https://api.cuenta1.emergent.sh

# backend/.env  
MONGO_URL=mongodb://mongo.cuenta1.emergent.sh:27017
```

### Después (automático)
- ❌ Elimina archivos .env
- ✅ El sistema detecta automáticamente URLs basado en hostname
- ✅ Funciona en cualquier cuenta sin cambios

## 🎯 Resultado Final

**Tu aplicación ahora:**
- Se configura automáticamente en cualquier cuenta de Emergent.sh
- No necesita archivos .env para funcionar entre cuentas
- Mantiene compatibilidad con desarrollo local
- Tiene fallbacks seguros para casos edge
- Es completamente portable entre entornos