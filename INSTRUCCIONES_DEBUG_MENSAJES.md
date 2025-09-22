# 🔧 Instrucciones de Debug para Error HTTP 422 en Mensajes

## 🎯 Necesito tu ayuda para solucionar el problema

He implementado logging detallado tanto en frontend como backend para capturar exactamente qué está causando el error HTTP 422. El backend funciona perfectamente cuando se prueba directamente, así que el problema está en la comunicación frontend-backend.

## 📋 Pasos para Debug (Por favor sigue exactamente):

### **1. Abrir Consola del Navegador**
- Presiona **F12** en tu navegador
- Ve a la pestaña **"Console"**
- **Importante**: Borra la consola (clic en el ícono de limpiar)

### **2. Intentar Enviar Mensaje**
- Ve a cualquier conversación de mensajes
- Escribe un mensaje (ej: "test debug")
- Presiona Enter o clic en enviar

### **3. Capturar Todos los Logs**
**Busca y cópiame TODOS estos logs específicos:**

```
🔍 Debug recipient: {...}
📤 Payload enviando al backend: {...}
🔍 Tipo de recipient.id: ...
🔍 Valor exacto recipient.id: ...
🔍 Tipo de content: ...
🔍 Valor exacto content: ...
🔍 DEBUG makeAuthenticatedRequest - URL: ...
🔍 DEBUG makeAuthenticatedRequest - Headers: {...}
🔍 DEBUG makeAuthenticatedRequest - Body: ...
🔍 DEBUG makeAuthenticatedRequest - Token length: ...
❌ Error enviando mensaje COMPLETO: ...
❌ Error message: ...
```

### **4. También Revisar Pestaña Network**
- En las herramientas de desarrollador, ve a **"Network"**
- Busca la petición a `/api/messages`
- Clic derecho → **"Copy as cURL"**
- Compárteme el comando cURL completo

## 🔍 Lo que Estoy Buscando

### **Problemas Posibles:**
1. **Token Expirado**: Si el token length es 0 o muy corto
2. **Recipient ID Inválido**: Si recipient.id no es un UUID válido
3. **Headers Incorrectos**: Si Content-Type no es application/json
4. **Body Malformado**: Si el JSON no se serializa correctamente
5. **URL Incorrecta**: Si no se está usando el backend URL correcto

### **Backend Logs Esperados (si llega la petición):**
Si la petición llega al backend, también deberías ver estos logs en la respuesta:
```
🔍 DEBUG - Raw request body: ...
🔍 DEBUG - Content-Type: ...
🔍 DEBUG - Message object: ...
✅ DEBUG - Recipient found: ...
```

## 💡 Información Adicional Útil

### **Si quieres verificar tu token:**
1. Ve a **Application** tab en DevTools
2. Busca **Local Storage** → tu dominio
3. Verifica que exista `token` y tenga contenido

### **Para verificar el backend URL:**
- En la consola, escribe: `console.log(process.env.REACT_APP_BACKEND_URL)`
- O revisa en el log **DEBUG makeAuthenticatedRequest - URL**

## 🚀 Una vez que tengas los logs:

**Cópiame literalmente todos los logs mencionados arriba**. Con esa información podré:
1. Identificar exactamente dónde falla
2. Ver si el problema es autenticación, datos, o comunicación
3. Implementar la solución específica
4. Probar que funcione correctamente

---

**⚡ Con estos logs podré solucionar el problema en los próximos minutos!**