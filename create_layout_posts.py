#!/usr/bin/env python3
"""
Script to create test posts with different layouts for testing purposes
"""
import requests
import base64
from io import BytesIO
from PIL import Image
import json

# Backend URL
BASE_URL = "http://localhost:8001"

def create_test_image(color, text):
    """Create a simple test image with color and text"""
    img = Image.new('RGB', (400, 600), color=color)
    return img

def image_to_base64(img):
    """Convert PIL image to base64 string"""
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"

def create_test_user_and_posts():
    # Register test user
    register_data = {
        "email": "layouttest@example.com",
        "username": "layouttest",
        "display_name": "Layout Test User",
        "password": "test123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
    if response.status_code == 200:
        user_data = response.json()
        token = user_data['access_token']
        user_id = user_data['user']['id']
        print(f"✅ User created: {user_data['user']['username']}")
    else:
        # User might already exist, try to login
        login_data = {
            "email": "layouttest@example.com",
            "password": "test123"
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if response.status_code == 200:
            user_data = response.json()
            token = user_data['access_token']
            user_id = user_data['user']['id']
            print(f"✅ User logged in: {user_data['user']['username']}")
        else:
            print(f"❌ Failed to create/login user: {response.text}")
            return

    headers = {"Authorization": f"Bearer {token}"}
    
    # Define test layouts with different configurations
    test_layouts = [
        {
            "layout": "horizontal",
            "title": "Layout Horizontal - 2 Partes Horizontales",
            "colors": ["#FF6B6B", "#4ECDC4"],
            "texts": ["Opción A", "Opción B"]
        },
        {
            "layout": "grid-3x2", 
            "title": "Layout Grid 3x2 - 6 Partes (3 Columnas x 2 Filas)",
            "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"],
            "texts": ["A", "B", "C", "D", "E", "F"]
        },
        {
            "layout": "horizontal-3x2",
            "title": "Layout 2x3 Mejorado - 6 Partes (2 Columnas x 3 Filas)",
            "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"],
            "texts": ["A", "B", "C", "D", "E", "F"]
        },
        {
            "layout": "triptych-vertical",
            "title": "Layout Triptych Vertical - 3 Partes Verticales",
            "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1"],
            "texts": ["A", "B", "C"]
        },
        {
            "layout": "triptych-horizontal",
            "title": "Layout Triptych Horizontal - 3 Partes Horizontales",
            "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1"],
            "texts": ["A", "B", "C"]
        }
    ]
    
    for layout_config in test_layouts:
        print(f"\n🎨 Creating post with layout: {layout_config['layout']}")
        
        # Create images for each option
        options = []
        for i, (color, text) in enumerate(zip(layout_config['colors'], layout_config['texts'])):
            img = create_test_image(color, text)
            img_base64 = image_to_base64(img)
            
            options.append({
                "text": f"Descripción {text} - Layout {layout_config['layout']}",
                "media_type": "image",
                "media_url": img_base64,
                "thumbnail_url": img_base64,
                "mentioned_users": []
            })
        
        # Create poll data
        poll_data = {
            "title": layout_config['title'],
            "description": None,
            "options": options,
            "music_id": None,
            "tags": [],
            "category": "general",
            "mentioned_users": [],
            "video_playback_settings": None,
            "layout": layout_config['layout']  # Custom field for layout
        }
        
        # Create the poll
        response = requests.post(f"{BASE_URL}/api/polls", json=poll_data, headers=headers)
        if response.status_code == 200:
            poll = response.json()
            print(f"✅ Poll created with ID: {poll.get('id', 'unknown')}")
        else:
            print(f"❌ Failed to create poll: {response.status_code} - {response.text}")

if __name__ == "__main__":
    print("🚀 Creating test posts with different layouts...")
    create_test_user_and_posts()
    print("\n✅ Done! Check the feed to see the improved layouts.")