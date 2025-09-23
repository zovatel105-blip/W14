#!/usr/bin/env python3
"""
Create Demo Users for VotaTok Testing
Creates the specific demo users mentioned in the review request
"""

import requests
import json
import sys
import time
from datetime import datetime

def get_backend_url():
    """Get backend URL from frontend/.env"""
    try:
        with open('/app/frontend/.env', 'r') as f:
            content = f.read()
            for line in content.split('\n'):
                if line.startswith('REACT_APP_BACKEND_URL='):
                    backend_url = line.split('=', 1)[1].strip()
                    return f"{backend_url}/api"
    except:
        pass
    return "http://localhost:8001/api"

def create_demo_users():
    """Create demo users with specific credentials"""
    print("🎯 CREATING DEMO USERS FOR VOTATIK TESTING")
    print("=" * 60)
    
    base_url = get_backend_url()
    print(f"Backend URL: {base_url}")
    
    # Demo users to create
    demo_users = [
        {
            "username": "demo_user",
            "email": "demo@example.com",
            "password": "demo123",
            "display_name": "Demo User"
        },
        {
            "username": "maria_gonzalez",
            "email": "maria@example.com", 
            "password": "password123",
            "display_name": "María González"
        },
        {
            "username": "freex_user",
            "email": "freex@gmail.com",
            "password": "freex123",
            "display_name": "Freex User"
        }
    ]
    
    created_users = []
    
    for i, user_data in enumerate(demo_users):
        print(f"\n{i+1}️⃣ Creating user: {user_data['email']}")
        try:
            response = requests.post(f"{base_url}/auth/register", json=user_data, timeout=10)
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ User created successfully")
                print(f"   Username: {data['user']['username']}")
                print(f"   Email: {data['user']['email']}")
                print(f"   ID: {data['user']['id']}")
                created_users.append({
                    'user': data['user'],
                    'token': data['access_token'],
                    'credentials': user_data
                })
            elif response.status_code == 400:
                print(f"   ⚠️ User already exists: {response.json().get('detail', 'Unknown error')}")
                # Try to login instead
                login_data = {
                    "email": user_data["email"],
                    "password": user_data["password"]
                }
                login_response = requests.post(f"{base_url}/auth/login", json=login_data, timeout=10)
                if login_response.status_code == 200:
                    login_data_resp = login_response.json()
                    print(f"   ✅ Logged in existing user")
                    created_users.append({
                        'user': login_data_resp['user'],
                        'token': login_data_resp['access_token'],
                        'credentials': user_data
                    })
                else:
                    print(f"   ❌ Cannot login existing user: {login_response.text}")
            else:
                print(f"   ❌ Creation failed: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Error creating user: {e}")
    
    # Test login with created users
    print(f"\n🔐 TESTING LOGIN WITH CREATED USERS")
    print("=" * 60)
    
    for user_info in created_users:
        creds = user_info['credentials']
        print(f"\nTesting login: {creds['email']}")
        try:
            login_data = {
                "email": creds["email"],
                "password": creds["password"]
            }
            response = requests.post(f"{base_url}/auth/login", json=login_data, timeout=10)
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Login successful")
                print(f"   User: {data['user']['username']}")
                print(f"   Token: {data['access_token'][:20]}...")
            else:
                print(f"   ❌ Login failed: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Login error: {e}")
    
    # Summary
    print(f"\n📊 DEMO USERS CREATION SUMMARY")
    print("=" * 60)
    print(f"Users processed: {len(demo_users)}")
    print(f"Users available: {len(created_users)}")
    
    print(f"\n🎯 AVAILABLE DEMO CREDENTIALS:")
    for user_info in created_users:
        creds = user_info['credentials']
        print(f"   Email: {creds['email']}")
        print(f"   Password: {creds['password']}")
        print(f"   Username: {user_info['user']['username']}")
        print(f"   ---")
    
    if len(created_users) >= 2:
        print(f"\n✅ DEMO USERS READY FOR TESTING")
        print(f"   - Users can now login with the provided credentials")
        print(f"   - Frontend should be able to authenticate successfully")
        print(f"   - 'Network connection failed' issue should be resolved")
    else:
        print(f"\n⚠️ INSUFFICIENT DEMO USERS CREATED")
        print(f"   - May need to investigate user creation issues")
    
    return len(created_users) >= 2

if __name__ == "__main__":
    create_demo_users()