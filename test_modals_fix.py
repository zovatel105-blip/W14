#!/usr/bin/env python3
"""
Script para probar directamente los endpoints de seguidores/siguiendo
para verificar que los modales funcionen correctamente
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8001"

def test_followers_endpoint():
    """Probar endpoint de seguidores"""
    print("🔍 Probando endpoint de seguidores...")
    url = f"{BASE_URL}/api/users/test-user-1/followers"
    
    try:
        response = requests.get(url)
        print(f"📡 GET {url}")
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Respuesta exitosa:")
            print(f"   - Total seguidores: {data.get('total', 'N/A')}")
            print(f"   - Array de seguidores: {len(data.get('followers', []))} elementos")
            
            if data.get('followers'):
                print(f"   - Primer seguidor: {data['followers'][0].get('username', 'N/A')}")
                return True
            else:
                print("   ⚠️ Array de seguidores está vacío")
                return False
        else:
            print(f"❌ Error: {response.status_code}")
            if response.text:
                print(f"   Mensaje: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def test_following_endpoint():
    """Probar endpoint de siguiendo"""
    print("\n🔍 Probando endpoint de siguiendo...")
    url = f"{BASE_URL}/api/users/test-user-1/following"
    
    try:
        response = requests.get(url)
        print(f"📡 GET {url}")
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Respuesta exitosa:")
            print(f"   - Total siguiendo: {data.get('total', 'N/A')}")
            print(f"   - Array de siguiendo: {len(data.get('following', []))} elementos")
            
            if data.get('following'):
                print(f"   - Primer usuario seguido: {data['following'][0].get('username', 'N/A')}")
                return True
            else:
                print("   ⚠️ Array de siguiendo está vacío")
                return False
        else:
            print(f"❌ Error: {response.status_code}")
            if response.text:
                print(f"   Mensaje: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def check_database_state():
    """Verificar estado de la base de datos"""
    print("\n🗄️ Verificando estado de la base de datos...")
    
    try:
        # Usar mongosh para verificar datos
        import subprocess
        
        # Verificar usuarios
        result = subprocess.run([
            'mongosh', 'mongodb://localhost:27017/social_media_app', 
            '--eval', 'db.users.find({id: {$in: ["test-user-1", "test-user-2", "test-user-3"]}}, {username: 1, id: 1, _id: 0}).toArray()',
            '--quiet'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Usuarios en BD:", result.stdout.strip())
        
        # Verificar relaciones
        result = subprocess.run([
            'mongosh', 'mongodb://localhost:27017/social_media_app',
            '--eval', 'db.follows.find({}, {follower_id: 1, following_id: 1, _id: 0}).toArray()',
            '--quiet'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Relaciones en BD:", result.stdout.strip())
            
    except Exception as e:
        print(f"⚠️ No se pudo verificar BD: {e}")

if __name__ == "__main__":
    print("🚀 INICIANDO PRUEBA DE ENDPOINTS DE SEGUIDORES/SIGUIENDO")
    print("=" * 60)
    
    # Verificar estado de BD
    check_database_state()
    
    # Probar endpoints
    followers_ok = test_followers_endpoint()
    following_ok = test_following_endpoint()
    
    print("\n" + "=" * 60)
    print("📋 RESUMEN DE RESULTADOS:")
    print(f"   Seguidores endpoint: {'✅ OK' if followers_ok else '❌ FALLA'}")
    print(f"   Siguiendo endpoint: {'✅ OK' if following_ok else '❌ FALLA'}")
    
    if not followers_ok or not following_ok:
        print("\n🔧 DIAGNÓSTICO: Los endpoints pueden necesitar autenticación o tener otros problemas")
        print("   - Verificar si los endpoints requieren JWT token")
        print("   - Verificar logs del backend para errores específicos")
        sys.exit(1)
    else:
        print("\n🎉 TODOS LOS ENDPOINTS FUNCIONAN CORRECTAMENTE")
        print("   ✅ El problema de modales vacíos debería estar resuelto")
        sys.exit(0)