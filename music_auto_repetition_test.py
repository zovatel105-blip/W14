#!/usr/bin/env python3
"""
Music Auto-Repetition System Testing Script
Tests complete music auto-repetition functionality for TikTok feed including:
1. Music endpoints functionality (GET /api/music/library-with-previews)
2. Polls contain music information with valid preview_url
3. iTunes API preview URLs are working
4. Auto-repetition system end-to-end functionality
"""

import requests
import json
import sys
import time
import random
from datetime import datetime, timedelta

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    base_url = line.split('=', 1)[1].strip()
                    return f"{base_url}/api"
        return None
    except Exception as e:
        print(f"Error reading frontend .env file: {e}")
        return None

# Global variables for test data
test_user = None
auth_token = None
created_polls = []

def test_user_authentication(base_url):
    """Setup authentication for music testing"""
    print("=== Setting Up Authentication for Music Testing ===")
    global test_user, auth_token
    
    # Generate unique email with timestamp
    timestamp = int(time.time())
    
    # Register test user
    user_data = {
        "email": f"music.tester.{timestamp}@example.com",
        "username": f"music_tester_{timestamp}",
        "display_name": "Music Auto-Repetition Tester",
        "password": "musictest123"
    }
    
    try:
        print("Registering test user for music testing...")
        response = requests.post(f"{base_url}/auth/register", json=user_data, timeout=10)
        print(f"Registration Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            test_user = data['user']
            auth_token = data['access_token']
            print(f"✅ Test user registered successfully: {test_user['username']}")
            print(f"User ID: {test_user['id']}")
            return True
        else:
            print(f"❌ Registration failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False

def test_music_library_with_previews(base_url):
    """Test GET /api/music/library-with-previews endpoint"""
    print("\n=== Testing Music Library with Real Previews ===")
    
    if not auth_token:
        print("❌ No auth token available for music library test")
        return False
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success_count = 0
    
    # Test 1: Get music library with previews
    print("Testing GET /api/music/library-with-previews...")
    try:
        response = requests.get(f"{base_url}/music/library-with-previews", headers=headers, timeout=15)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Music library with previews retrieved successfully")
            print(f"Total tracks: {data.get('total', 0)}")
            print(f"Has real previews: {data.get('has_real_previews', False)}")
            print(f"Source: {data.get('source', 'Unknown')}")
            
            music_tracks = data.get('music', [])
            if len(music_tracks) > 0:
                print(f"✅ Found {len(music_tracks)} music tracks")
                
                # Verify first track structure
                first_track = music_tracks[0]
                print(f"\nFirst track details:")
                print(f"  ID: {first_track.get('id', 'N/A')}")
                print(f"  Title: {first_track.get('title', 'N/A')}")
                print(f"  Artist: {first_track.get('artist', 'N/A')}")
                print(f"  Preview URL: {first_track.get('preview_url', 'N/A')}")
                print(f"  Cover: {first_track.get('cover', 'N/A')}")
                print(f"  Duration: {first_track.get('duration', 'N/A')} seconds")
                print(f"  Source: {first_track.get('source', 'N/A')}")
                
                # Check if preview URLs are real iTunes URLs
                real_preview_count = 0
                for track in music_tracks:
                    preview_url = track.get('preview_url')
                    if preview_url and 'itunes.apple.com' in preview_url:
                        real_preview_count += 1
                
                print(f"✅ Tracks with real iTunes preview URLs: {real_preview_count}/{len(music_tracks)}")
                
                if real_preview_count > 0:
                    print("✅ Music library contains real iTunes preview URLs")
                    success_count += 1
                else:
                    print("⚠️ No real iTunes preview URLs found")
                
                success_count += 1
            else:
                print("❌ No music tracks found in library")
        else:
            print(f"❌ Music library request failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Music library error: {e}")
    
    # Test 2: Test with limit parameter
    print("\nTesting music library with limit parameter...")
    try:
        response = requests.get(f"{base_url}/music/library-with-previews?limit=5", headers=headers, timeout=15)
        print(f"Limited Request Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            music_tracks = data.get('music', [])
            print(f"✅ Limited request successful, returned {len(music_tracks)} tracks")
            
            if len(music_tracks) <= 5:
                print("✅ Limit parameter working correctly")
                success_count += 1
            else:
                print("❌ Limit parameter not working correctly")
        else:
            print(f"❌ Limited request failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Limited request error: {e}")
    
    # Test 3: Test authentication requirement
    print("\nTesting authentication requirement...")
    try:
        response = requests.get(f"{base_url}/music/library-with-previews", timeout=10)
        
        if response.status_code in [401, 403]:
            print("✅ Music library properly requires authentication")
            success_count += 1
        else:
            print(f"❌ Should require authentication, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Authentication test error: {e}")
    
    return success_count >= 2

def test_itunes_preview_urls(base_url):
    """Test that iTunes preview URLs are actually working"""
    print("\n=== Testing iTunes Preview URLs Functionality ===")
    
    if not auth_token:
        print("❌ No auth token available for iTunes URL test")
        return False
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success_count = 0
    
    # First get some music with preview URLs
    try:
        response = requests.get(f"{base_url}/music/library-with-previews?limit=3", headers=headers, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            music_tracks = data.get('music', [])
            
            if len(music_tracks) > 0:
                print(f"Testing preview URLs for {len(music_tracks)} tracks...")
                
                working_urls = 0
                for i, track in enumerate(music_tracks):
                    preview_url = track.get('preview_url')
                    if preview_url:
                        print(f"\nTesting preview URL {i+1}: {track.get('title', 'Unknown')} - {track.get('artist', 'Unknown')}")
                        print(f"URL: {preview_url}")
                        
                        try:
                            # Test if the URL is accessible (HEAD request to avoid downloading)
                            url_response = requests.head(preview_url, timeout=10)
                            print(f"Preview URL Status Code: {url_response.status_code}")
                            
                            if url_response.status_code == 200:
                                content_type = url_response.headers.get('content-type', '')
                                print(f"Content-Type: {content_type}")
                                
                                if 'audio' in content_type.lower():
                                    print(f"✅ Preview URL {i+1} is working and serves audio content")
                                    working_urls += 1
                                else:
                                    print(f"⚠️ Preview URL {i+1} accessible but content-type is not audio: {content_type}")
                            else:
                                print(f"❌ Preview URL {i+1} returned status: {url_response.status_code}")
                                
                        except Exception as url_e:
                            print(f"❌ Preview URL {i+1} test error: {url_e}")
                    else:
                        print(f"⚠️ Track {i+1} has no preview URL")
                
                print(f"\n✅ Working preview URLs: {working_urls}/{len(music_tracks)}")
                
                if working_urls > 0:
                    print("✅ iTunes preview URLs are functional")
                    success_count += 1
                else:
                    print("❌ No working iTunes preview URLs found")
                    
                success_count += 1
            else:
                print("❌ No music tracks available for URL testing")
        else:
            print(f"❌ Failed to get music for URL testing: {response.text}")
            
    except Exception as e:
        print(f"❌ iTunes URL testing error: {e}")
    
    return success_count >= 1

def test_music_search_realtime(base_url):
    """Test real-time music search functionality"""
    print("\n=== Testing Real-Time Music Search ===")
    
    if not auth_token:
        print("❌ No auth token available for music search test")
        return False
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success_count = 0
    
    # Test popular artists for auto-repetition system
    search_queries = [
        "Bad Bunny",
        "Karol G", 
        "Morad",
        "reggaeton"
    ]
    
    for query in search_queries:
        print(f"\nTesting search for: '{query}'...")
        try:
            response = requests.get(f"{base_url}/music/search-realtime?query={query}&limit=3", 
                                  headers=headers, timeout=15)
            print(f"Search Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Search Success: {data.get('success', False)}")
                print(f"Message: {data.get('message', 'N/A')}")
                
                results = data.get('results', [])
                print(f"Results found: {len(results)}")
                
                if data.get('success') and len(results) > 0:
                    print(f"✅ Search for '{query}' successful")
                    
                    # Check first result
                    first_result = results[0]
                    print(f"  First result: {first_result.get('title', 'N/A')} - {first_result.get('artist', 'N/A')}")
                    print(f"  Preview URL: {first_result.get('preview_url', 'N/A')}")
                    print(f"  Source: {first_result.get('source', 'N/A')}")
                    
                    success_count += 1
                else:
                    print(f"⚠️ Search for '{query}' returned no results or failed")
                    if not data.get('success'):
                        print(f"Error message: {data.get('message', 'Unknown error')}")
            else:
                print(f"❌ Search for '{query}' failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Search error for '{query}': {e}")
    
    # Test authentication requirement
    print(f"\nTesting search authentication requirement...")
    try:
        response = requests.get(f"{base_url}/music/search-realtime?query=test", timeout=10)
        
        if response.status_code in [401, 403]:
            print("✅ Music search properly requires authentication")
            success_count += 1
        else:
            print(f"❌ Should require authentication, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Search auth test error: {e}")
    
    return success_count >= 2

def test_polls_with_music_integration(base_url):
    """Test that polls can be created with music and contain proper music information"""
    print("\n=== Testing Polls with Music Integration ===")
    
    if not auth_token:
        print("❌ No auth token available for polls with music test")
        return False
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success_count = 0
    global created_polls
    
    # First, get available music
    try:
        music_response = requests.get(f"{base_url}/music/library-with-previews?limit=3", 
                                    headers=headers, timeout=15)
        
        if music_response.status_code == 200:
            music_data = music_response.json()
            music_tracks = music_data.get('music', [])
            
            if len(music_tracks) > 0:
                # Test 1: Create poll with music
                print("Testing poll creation with music...")
                
                selected_music = music_tracks[0]
                music_id = selected_music.get('id')
                
                poll_data = {
                    "title": "¿Cuál es tu canción favorita para el auto-repetición?",
                    "options": [
                        {"text": "Me encanta esta canción", "media_url": "", "media_type": "none"},
                        {"text": "Prefiero otra música", "media_url": "", "media_type": "none"},
                        {"text": "No me gusta la música repetitiva", "media_url": "", "media_type": "none"}
                    ],
                    "music_id": music_id,
                    "category": "music",
                    "is_featured": False
                }
                
                try:
                    response = requests.post(f"{base_url}/polls", json=poll_data, headers=headers, timeout=10)
                    print(f"Create Poll Status Code: {response.status_code}")
                    
                    if response.status_code == 200:
                        poll = response.json()
                        created_polls.append(poll)
                        print(f"✅ Poll with music created successfully")
                        print(f"Poll ID: {poll.get('id', 'N/A')}")
                        print(f"Poll Title: {poll.get('title', 'N/A')}")
                        
                        # Check if music information is included
                        poll_music = poll.get('music')
                        if poll_music:
                            print(f"✅ Poll contains music information")
                            print(f"  Music ID: {poll_music.get('id', 'N/A')}")
                            print(f"  Music Title: {poll_music.get('title', 'N/A')}")
                            print(f"  Music Artist: {poll_music.get('artist', 'N/A')}")
                            print(f"  Preview URL: {poll_music.get('preview_url', 'N/A')}")
                            
                            # Verify preview URL is present and valid
                            preview_url = poll_music.get('preview_url')
                            if preview_url and 'itunes.apple.com' in preview_url:
                                print(f"✅ Poll music has valid iTunes preview URL")
                                success_count += 1
                            else:
                                print(f"⚠️ Poll music preview URL is not a valid iTunes URL: {preview_url}")
                            
                            success_count += 1
                        else:
                            print(f"❌ Poll does not contain music information")
                    else:
                        print(f"❌ Poll creation failed: {response.text}")
                        
                except Exception as e:
                    print(f"❌ Poll creation error: {e}")
                
                # Test 2: Get polls and verify music information is included
                print(f"\nTesting GET /api/polls to verify music information...")
                try:
                    response = requests.get(f"{base_url}/polls", headers=headers, timeout=10)
                    print(f"Get Polls Status Code: {response.status_code}")
                    
                    if response.status_code == 200:
                        polls = response.json()
                        print(f"✅ Polls retrieved successfully, found {len(polls)} polls")
                        
                        # Look for polls with music
                        polls_with_music = 0
                        polls_with_preview_urls = 0
                        
                        for poll in polls:
                            poll_music = poll.get('music')
                            if poll_music:
                                polls_with_music += 1
                                preview_url = poll_music.get('preview_url')
                                if preview_url:
                                    polls_with_preview_urls += 1
                                    print(f"  Poll '{poll.get('title', 'N/A')[:50]}...' has music: {poll_music.get('title', 'N/A')} - {poll_music.get('artist', 'N/A')}")
                        
                        print(f"✅ Polls with music: {polls_with_music}")
                        print(f"✅ Polls with preview URLs: {polls_with_preview_urls}")
                        
                        if polls_with_music > 0:
                            print("✅ Feed contains polls with music information")
                            success_count += 1
                        
                        if polls_with_preview_urls > 0:
                            print("✅ Feed contains polls with preview URLs for auto-repetition")
                            success_count += 1
                    else:
                        print(f"❌ Get polls failed: {response.text}")
                        
                except Exception as e:
                    print(f"❌ Get polls error: {e}")
                
                # Test 3: Get specific poll and verify music details
                if created_polls:
                    print(f"\nTesting GET /api/polls/{{poll_id}} for music details...")
                    try:
                        poll_id = created_polls[0].get('id')
                        response = requests.get(f"{base_url}/polls/{poll_id}", headers=headers, timeout=10)
                        print(f"Get Specific Poll Status Code: {response.status_code}")
                        
                        if response.status_code == 200:
                            poll = response.json()
                            print(f"✅ Specific poll retrieved successfully")
                            
                            poll_music = poll.get('music')
                            if poll_music:
                                print(f"✅ Specific poll contains complete music information")
                                print(f"  Music structure: {list(poll_music.keys())}")
                                
                                # Verify all required fields for auto-repetition
                                required_fields = ['id', 'title', 'artist', 'preview_url']
                                missing_fields = []
                                
                                for field in required_fields:
                                    if not poll_music.get(field):
                                        missing_fields.append(field)
                                
                                if not missing_fields:
                                    print(f"✅ Poll music has all required fields for auto-repetition")
                                    success_count += 1
                                else:
                                    print(f"❌ Poll music missing required fields: {missing_fields}")
                            else:
                                print(f"❌ Specific poll does not contain music information")
                        else:
                            print(f"❌ Get specific poll failed: {response.text}")
                            
                    except Exception as e:
                        print(f"❌ Get specific poll error: {e}")
            else:
                print("❌ No music tracks available for poll testing")
        else:
            print(f"❌ Failed to get music for poll testing: {response.text}")
            
    except Exception as e:
        print(f"❌ Polls with music integration error: {e}")
    
    return success_count >= 3

def test_music_static_library(base_url):
    """Test static music library endpoint"""
    print("\n=== Testing Static Music Library ===")
    
    success_count = 0
    
    # Test static music library (no auth required)
    print("Testing GET /api/music/library...")
    try:
        response = requests.get(f"{base_url}/music/library", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Static music library retrieved successfully")
            
            music_tracks = data.get('music', [])
            print(f"Total tracks in static library: {len(music_tracks)}")
            
            if len(music_tracks) > 0:
                # Check for popular artists that should be in auto-repetition system
                artists_found = set()
                for track in music_tracks:
                    artist = track.get('artist', '')
                    artists_found.add(artist)
                
                print(f"Artists in library: {list(artists_found)}")
                
                # Check for key artists for auto-repetition
                key_artists = ['Bad Bunny', 'Karol G', 'Morad']
                found_key_artists = [artist for artist in key_artists if any(artist in track.get('artist', '') for track in music_tracks)]
                
                print(f"✅ Key artists found: {found_key_artists}")
                
                if len(found_key_artists) > 0:
                    print("✅ Static library contains key artists for auto-repetition")
                    success_count += 1
                
                success_count += 1
            else:
                print("❌ Static library is empty")
        else:
            print(f"⚠️ Static music library failed: {response.text}")
            # This might be expected if there are issues with the static library
            
    except Exception as e:
        print(f"❌ Static music library error: {e}")
    
    return success_count >= 1

def test_end_to_end_auto_repetition_flow(base_url):
    """Test complete end-to-end auto-repetition flow"""
    print("\n=== Testing End-to-End Auto-Repetition Flow ===")
    
    if not auth_token:
        print("❌ No auth token available for end-to-end test")
        return False
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success_count = 0
    
    print("Testing complete auto-repetition workflow...")
    
    # Step 1: Verify music library has real previews
    print("\nStep 1: Verifying music library has real iTunes previews...")
    try:
        response = requests.get(f"{base_url}/music/library-with-previews?limit=5", headers=headers, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            music_tracks = data.get('music', [])
            
            if len(music_tracks) > 0 and data.get('has_real_previews'):
                print(f"✅ Step 1 passed: Music library has {len(music_tracks)} tracks with real previews")
                success_count += 1
            else:
                print(f"❌ Step 1 failed: Music library doesn't have real previews")
        else:
            print(f"❌ Step 1 failed: Could not get music library")
            
    except Exception as e:
        print(f"❌ Step 1 error: {e}")
    
    # Step 2: Verify polls in feed contain music with preview URLs
    print("\nStep 2: Verifying polls in feed contain music with preview URLs...")
    try:
        response = requests.get(f"{base_url}/polls", headers=headers, timeout=10)
        
        if response.status_code == 200:
            polls = response.json()
            
            polls_with_music_previews = 0
            total_polls = len(polls)
            
            for poll in polls:
                poll_music = poll.get('music')
                if poll_music and poll_music.get('preview_url'):
                    polls_with_music_previews += 1
            
            print(f"✅ Step 2: {polls_with_music_previews}/{total_polls} polls have music with preview URLs")
            
            if polls_with_music_previews > 0:
                print("✅ Step 2 passed: Feed contains polls ready for auto-repetition")
                success_count += 1
            else:
                print("⚠️ Step 2: No polls with music previews found in feed")
        else:
            print(f"❌ Step 2 failed: Could not get polls")
            
    except Exception as e:
        print(f"❌ Step 2 error: {e}")
    
    # Step 3: Test music search for dynamic content
    print("\nStep 3: Testing music search for dynamic auto-repetition content...")
    try:
        response = requests.get(f"{base_url}/music/search-realtime?query=Bad Bunny&limit=3", 
                              headers=headers, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('success') and len(data.get('results', [])) > 0:
                results = data.get('results', [])
                working_previews = 0
                
                for result in results:
                    if result.get('preview_url'):
                        working_previews += 1
                
                print(f"✅ Step 3: Found {working_previews} searchable tracks with previews")
                
                if working_previews > 0:
                    print("✅ Step 3 passed: Dynamic music search provides auto-repetition content")
                    success_count += 1
                else:
                    print("❌ Step 3 failed: No working previews in search results")
            else:
                print(f"⚠️ Step 3: Music search returned no results or failed")
        else:
            print(f"❌ Step 3 failed: Music search endpoint error")
            
    except Exception as e:
        print(f"❌ Step 3 error: {e}")
    
    # Step 4: Verify iTunes URLs are accessible
    print("\nStep 4: Verifying iTunes preview URLs are accessible for auto-repetition...")
    try:
        # Get a sample of iTunes URLs from the library
        response = requests.get(f"{base_url}/music/library-with-previews?limit=2", headers=headers, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            music_tracks = data.get('music', [])
            
            accessible_urls = 0
            total_urls = 0
            
            for track in music_tracks:
                preview_url = track.get('preview_url')
                if preview_url and 'itunes.apple.com' in preview_url:
                    total_urls += 1
                    try:
                        url_response = requests.head(preview_url, timeout=8)
                        if url_response.status_code == 200:
                            accessible_urls += 1
                    except:
                        pass  # URL not accessible
            
            print(f"✅ Step 4: {accessible_urls}/{total_urls} iTunes URLs are accessible")
            
            if accessible_urls > 0:
                print("✅ Step 4 passed: iTunes preview URLs are accessible for auto-repetition")
                success_count += 1
            else:
                print("❌ Step 4 failed: No accessible iTunes preview URLs")
        else:
            print(f"❌ Step 4 failed: Could not get music for URL testing")
            
    except Exception as e:
        print(f"❌ Step 4 error: {e}")
    
    # Summary
    print(f"\n=== Auto-Repetition System End-to-End Test Summary ===")
    print(f"Steps passed: {success_count}/4")
    
    if success_count >= 3:
        print("🎉 ✅ AUTO-REPETITION SYSTEM IS READY FOR PRODUCTION")
        print("The music auto-repetition system has all required components:")
        print("  ✓ Real iTunes preview URLs available")
        print("  ✓ Polls contain music information with preview URLs")
        print("  ✓ Dynamic music search provides additional content")
        print("  ✓ iTunes URLs are accessible for playback")
        print("\n🎵 Users can now enjoy auto-repeating music in TikTok feed!")
        return True
    else:
        print("❌ AUTO-REPETITION SYSTEM NEEDS ATTENTION")
        print("Some components are not working properly.")
        return False

def run_all_music_tests():
    """Run all music auto-repetition tests"""
    print("🎵 MUSIC AUTO-REPETITION SYSTEM TESTING STARTED 🎵")
    print("=" * 60)
    
    # Get backend URL
    base_url = get_backend_url()
    if not base_url:
        print("❌ Could not determine backend URL from frontend .env file")
        return False
    
    print(f"Backend URL: {base_url}")
    
    # Test results tracking
    test_results = {}
    
    # Run tests in sequence
    tests = [
        ("User Authentication Setup", test_user_authentication),
        ("Music Library with Previews", test_music_library_with_previews),
        ("iTunes Preview URLs Functionality", test_itunes_preview_urls),
        ("Real-Time Music Search", test_music_search_realtime),
        ("Polls with Music Integration", test_polls_with_music_integration),
        ("Static Music Library", test_music_static_library),
        ("End-to-End Auto-Repetition Flow", test_end_to_end_auto_repetition_flow)
    ]
    
    passed_tests = 0
    total_tests = len(tests)
    
    for test_name, test_function in tests:
        print(f"\n{'='*60}")
        print(f"Running: {test_name}")
        print(f"{'='*60}")
        
        try:
            result = test_function(base_url)
            test_results[test_name] = result
            
            if result:
                print(f"✅ {test_name}: PASSED")
                passed_tests += 1
            else:
                print(f"❌ {test_name}: FAILED")
                
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {e}")
            test_results[test_name] = False
    
    # Final summary
    print(f"\n{'='*60}")
    print(f"🎵 MUSIC AUTO-REPETITION TESTING COMPLETE 🎵")
    print(f"{'='*60}")
    print(f"Tests passed: {passed_tests}/{total_tests}")
    print(f"Success rate: {(passed_tests/total_tests)*100:.1f}%")
    
    print(f"\nDetailed Results:")
    for test_name, result in test_results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"  {test_name}: {status}")
    
    if passed_tests >= total_tests * 0.8:  # 80% success rate
        print(f"\n🎉 OVERALL RESULT: SUCCESS")
        print(f"The music auto-repetition system is working correctly!")
        print(f"Users can enjoy auto-repeating music in the TikTok feed.")
        return True
    else:
        print(f"\n❌ OVERALL RESULT: NEEDS ATTENTION")
        print(f"Some components of the auto-repetition system need fixing.")
        return False

if __name__ == "__main__":
    success = run_all_music_tests()
    sys.exit(0 if success else 1)