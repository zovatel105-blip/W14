#!/usr/bin/env python3
"""
Script para crear usuarios de prueba y datos de seguimiento
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_test_users_and_follows():
    print("🚀 Creando usuarios de prueba y datos de seguimiento...")
    
    # Conectar a MongoDB
    MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.social_media_db
    
    try:
        # Verificar usuarios existentes
        existing_users = await db.users.find({}).to_list(10)
        print(f"👥 Usuarios existentes encontrados: {len(existing_users)}")
        
        # Crear usuarios de prueba si no existen suficientes
        test_users = []
        
        if len(existing_users) < 3:
            users_to_create = [
                {
                    "username": "maria_garcia",
                    "email": "maria@example.com",
                    "display_name": "María García",
                    "bio": "Amante de la música y la fotografía 📸🎵"
                },
                {
                    "username": "carlos_lopez",
                    "email": "carlos@example.com", 
                    "display_name": "Carlos López",
                    "bio": "Creador de contenido digital ✨"
                },
                {
                    "username": "ana_martinez",
                    "email": "ana@example.com",
                    "display_name": "Ana Martínez", 
                    "bio": "Bailarina y coreógrafa 💃"
                }
            ]
            
            print("👤 Creando usuarios de prueba...")
            for user_data in users_to_create:
                # Verificar si el usuario ya existe
                existing = await db.users.find_one({"username": user_data["username"]})
                if not existing:
                    user_doc = {
                        "id": str(uuid.uuid4()),
                        "username": user_data["username"],
                        "email": user_data["email"],
                        "display_name": user_data["display_name"],
                        "bio": user_data["bio"],
                        "hashed_password": pwd_context.hash("password123"),
                        "avatar_url": f"https://api.dicebear.com/7.x/personas/svg?seed={user_data['username']}",
                        "is_verified": False,
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                    
                    await db.users.insert_one(user_doc)
                    test_users.append(user_doc)
                    print(f"  ✅ Usuario creado: {user_data['username']}")
                else:
                    test_users.append(existing)
                    print(f"  ℹ️ Usuario ya existe: {user_data['username']}")
        else:
            test_users = existing_users[:3]
        
        # Obtener todos los usuarios para crear seguimientos
        all_users = await db.users.find({}).to_list(10)
        print(f"\n👥 Total usuarios disponibles: {len(all_users)}")
        for user in all_users:
            print(f"  - {user['username']} (ID: {user['id']})")
        
        # Limpiar datos de seguimiento existentes
        await db.follows.delete_many({})
        print("\n🧹 Datos de seguimiento anteriores eliminados")
        
        # Crear relaciones de seguimiento entre los usuarios
        follow_relationships = []
        
        if len(all_users) >= 2:
            # Usuario 1 sigue a Usuario 2
            follow_relationships.append({
                "id": str(uuid.uuid4()),
                "follower_id": all_users[0]['id'],
                "following_id": all_users[1]['id'],
                "created_at": datetime.utcnow()
            })
            
            # Usuario 2 sigue a Usuario 1 (seguimiento mutuo)
            follow_relationships.append({
                "id": str(uuid.uuid4()),
                "follower_id": all_users[1]['id'],
                "following_id": all_users[0]['id'],
                "created_at": datetime.utcnow()
            })
        
        if len(all_users) >= 3:
            # Usuario 3 sigue a Usuario 1
            follow_relationships.append({
                "id": str(uuid.uuid4()),
                "follower_id": all_users[2]['id'],
                "following_id": all_users[0]['id'],
                "created_at": datetime.utcnow()
            })
            
            # Usuario 1 sigue a Usuario 3
            follow_relationships.append({
                "id": str(uuid.uuid4()),
                "follower_id": all_users[0]['id'],
                "following_id": all_users[2]['id'],
                "created_at": datetime.utcnow()
            })
            
            # Usuario 2 sigue a Usuario 3
            follow_relationships.append({
                "id": str(uuid.uuid4()),
                "follower_id": all_users[1]['id'],
                "following_id": all_users[2]['id'],
                "created_at": datetime.utcnow()
            })
        
        # Insertar las relaciones
        if follow_relationships:
            await db.follows.insert_many(follow_relationships)
            print(f"\n✅ {len(follow_relationships)} relaciones de seguimiento creadas:")
            
            for rel in follow_relationships:
                follower_user = next(u for u in all_users if u['id'] == rel['follower_id'])
                following_user = next(u for u in all_users if u['id'] == rel['following_id'])
                print(f"  📱 {follower_user['username']} → {following_user['username']}")
        
        # Verificar datos creados
        follows_count = await db.follows.count_documents({})
        print(f"\n📊 Total de relaciones de seguimiento en DB: {follows_count}")
        
        # Mostrar estadísticas por usuario
        print("\n📈 Estadísticas por usuario:")
        for user in all_users:
            followers_count = await db.follows.count_documents({"following_id": user['id']})
            following_count = await db.follows.count_documents({"follower_id": user['id']})
            print(f"  👤 {user['username']}: {followers_count} seguidores, {following_count} siguiendo")
        
        print("\n🎉 ¡Datos de prueba creados exitosamente!")
        print("💡 Ahora puedes probar los modales de seguidores/seguidos en la aplicación")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(create_test_users_and_follows())