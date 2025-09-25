#!/usr/bin/env python3
"""
Test script to create a poll with mentions and verify activity feed
"""

import requests
import json
import sys
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

def login_user(base_url, email, password):
    """Login user and return token and user info"""
    print(f"\n🔐 Logging in user: {email}")
    login_data = {
        "email": email,
        "password": password
    }
    response = requests.post(f"{base_url}/auth/login", json=login_data, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Login successful - User: {data['user']['username']} ID: {data['user']['id']}")
        return data['access_token'], data['user']
    else:
        print(f"   ❌ Login failed: {response.text}")
        return None, None

def create_poll_with_mention(base_url, token, mentioned_user_id, mentioned_user_username):
    """Create a poll mentioning a user"""
    print(f"\n📊 Creating poll mentioning user ID: {mentioned_user_id}")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    poll_data = {
        "question": f"¿Cuál prefieres para @{mentioned_user_username}?",
        "title": f"Encuesta de prueba para menciones - {datetime.now().strftime('%H:%M:%S')}",
        "options": [
            {
                "text": "Pizza",
                "image_url": None,
                "video_url": None,
                "mentioned_users": []
            },
            {
                "text": f"Hamburguesa (recomendado por @{mentioned_user_username})",
                "image_url": None,
                "video_url": None,
                "mentioned_users": [
                    {
                        "id": mentioned_user_id,
                        "username": mentioned_user_username
                    }
                ]
            }
        ],
        "general_mentioned_users": [
            {
                "id": mentioned_user_id,
                "username": mentioned_user_username
            }
        ],
        "music": None,
        "layout": "grid"
    }
    
    response = requests.post(f"{base_url}/polls", json=poll_data, headers=headers, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Poll created successfully - ID: {data['id']}")
        return data
    else:
        print(f"   ❌ Poll creation failed: {response.text}")
        return None

def check_activity_feed(base_url, token, user_id):
    """Check the activity feed for the mentioned user"""
    print(f"\n🔔 Checking activity feed for user: {user_id}")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(f"{base_url}/users/activity/recent", headers=headers, timeout=10)
    
    if response.status_code == 200:
        activities = response.json()
        print(f"   ✅ Activity feed retrieved - Found {len(activities)} activities")
        
        mention_activities = [act for act in activities if act.get('type') == 'mention']
        print(f"   📌 Mention activities: {len(mention_activities)}")
        
        for activity in activities:
            activity_type = activity.get('type', 'unknown')
            user_name = activity.get('user', {}).get('username', 'unknown')
            content = activity.get('content_preview', '')
            print(f"      - {activity_type}: {user_name} -> {content[:30]}...")
        
        return activities
    else:
        print(f"   ❌ Activity feed failed: {response.text}")
        return []

def test_mention_system():
    """Test the complete mention system"""
    print("🎯 TESTING MENTION ACTIVITY SYSTEM")
    print("=" * 60)
    
    base_url = get_backend_url()
    print(f"Backend URL: {base_url}")
    
    # Login as María (will create poll)
    maria_token, maria_user = login_user(base_url, "maria@example.com", "password123")
    if not maria_token:
        return False
    
    # Login as Demo (will be mentioned)
    demo_token, demo_user = login_user(base_url, "demo@example.com", "demo123")
    if not demo_token:
        return False
    
    # Create poll as María mentioning Demo
    poll = create_poll_with_mention(
        base_url, 
        maria_token, 
        demo_user['id'], 
        demo_user['username']
    )
    
    if not poll:
        return False
    
    # Check Demo's activity feed for the mention
    activities = check_activity_feed(base_url, demo_token, demo_user['id'])
    
    # Summary
    print(f"\n📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    mention_activities = [act for act in activities if act.get('type') == 'mention']
    if mention_activities:
        print(f"✅ SUCCESS: Found {len(mention_activities)} mention activities in feed")
        for mention in mention_activities:
            mention_type = mention.get('mention_type', 'unknown')
            mentioner = mention.get('user', {}).get('username', 'unknown')
            print(f"   - Type: {mention_type} by {mentioner}")
    else:
        print(f"❌ ISSUE: No mention activities found in feed")
        print(f"   Total activities found: {len(activities)}")
        print(f"   Activity types: {[act.get('type') for act in activities]}")
    
    return len(mention_activities) > 0

if __name__ == "__main__":
    success = test_mention_system()
    sys.exit(0 if success else 1)