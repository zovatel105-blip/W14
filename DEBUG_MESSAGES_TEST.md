# 🔧 Debug: Error HTTP 422 al Enviar Mensajes

## 🎯 Problema Reportado
Usuario recibe error "Error al enviar mensaje:HTTP 422" al intentar enviar mensajes.

## 🔍 Análisis Realizado

### **Backend Endpoint Verificado**
- ✅ Endpoint `/api/messages` POST existe y funciona
- ✅ Modelo `MessageCreate` requiere: `recipient_id` (str), `content` (str)
- ✅ Campos opcionales: `message_type` (default "text"), `metadata` (default {})

### **Prueba Backend Directa**
```bash
# Con usuario real: ✅ FUNCIONA
curl -X POST http://localhost:8001/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{"recipient_id":"be1edb61-d674-4ff3-8ca8-33523c55ae0d","content":"test message"}'

# Respuesta: {"success":true,"message_id":"...","conversation_id":"..."}
```

### **Errores Identificados**
1. ❌ **Recipient not found**: Cuando `recipient_id` no corresponde a usuario existente
2. ❌ **Not authenticated**: Cuando falta o es inválido el token
3. ❌ **Validation error**: Cuando faltan campos requeridos

## 🔧 Debugging Implementado

### **Logging Agregado**
```javascript
console.log('🔍 Debug recipient:', {
  conversationId: selectedConversation.id,
  participants: selectedConversation.participants,
  userId: user.id,
  recipient: recipient,
  recipientId: recipient?.id
});

console.log('📤 Payload enviando al backend:', messagePayload);
```

### **Validaciones Agregadas**
```javascript
if (!recipient) {
  throw new Error('No se pudo encontrar el destinatario');
}

if (!recipient.id) {
  throw new Error('El destinatario no tiene ID válido');
}
```

## 🧪 Casos de Prueba a Verificar

### **Para Usuario Final:**
1. **Conversación Existente**:
   - Ir a conversación que ya tiene mensajes
   - Enviar mensaje
   - Verificar logs en consola del navegador (F12)

2. **Conversación Nueva**:
   - Ir a perfil de usuario diferente
   - Hacer clic en "Mensaje"
   - Intentar enviar mensaje
   - Verificar logs en consola

### **Logs Esperados en Consola:**
```
🔍 Debug recipient: {
  conversationId: "new-xxx" o conversation_id_real,
  participants: [user1, user2],
  userId: "user_id",
  recipient: {id: "recipient_id", username: "...", ...},
  recipientId: "recipient_id"
}

📤 Payload enviando al backend: {
  recipient_id: "recipient_id",
  content: "mensaje de prueba"
}
```

## 🎯 Posibles Causas del Error 422

### **1. ID de Usuario Inválido**
- `recipient.id` no corresponde a usuario existente en BD
- `recipient.id` es null/undefined
- `recipient.id` es formato incorrecto (no UUID)

### **2. Datos de Conversación Corruptos**
- `selectedConversation.participants` está vacío
- Participantes no tienen IDs válidos
- Usuario actual no se encuentra correctamente

### **3. Problemas de Búsqueda de Usuarios**
- API `/api/users/search` retorna datos incompletos
- Usuario target no existe o no es encontrable
- Problemas de autenticación en búsqueda

## 🔄 Próximos Pasos

1. **Usuario debe abrir consola (F12) y intentar enviar mensaje**
2. **Copiar y enviar logs de debug completos**
3. **Verificar específicamente valores de `recipient.id`**
4. **Si recipient.id es válido, problema podría ser token expirado**

## 🛠️ Solución Temporal

Si el problema persiste, implementar validación adicional:
```javascript
// Verificar que recipient.id sea UUID válido
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(recipient.id)) {
  throw new Error(`ID de destinatario inválido: ${recipient.id}`);
}

// Re-verificar usuario antes de enviar
const userCheck = await apiRequest(`/api/users/${recipient.id}`);
if (!userCheck) {
  throw new Error('El usuario destinatario no existe');
}
```

---

**✨ Con los logs de debug implementados, ahora podremos identificar exactamente qué datos se están enviando y por qué falla el backend.**