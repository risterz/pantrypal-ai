#!/usr/bin/env python3
"""
Debug script to test enhancement generation and identify issues.
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables - try multiple locations
env_paths = [
    '../../.env',  # Project root
    '../scrapper/.env',  # Scrapper directory
    '.env',  # Current directory
]

env_loaded = False
for env_path in env_paths:
    if os.path.exists(env_path):
        load_dotenv(env_path)
        env_loaded = True
        print(f"✅ Loaded environment from: {env_path}")
        break

if not env_loaded:
    load_dotenv()  # Try default locations
    print("⚠️ Using default environment loading")

# Get environment variables
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
deepseek_key = os.getenv('NEXT_PUBLIC_DEEPSEEK_API_KEY')

print("\n🔍 Environment Variables Check:")
print(f"Supabase URL: {'✅ Found' if supabase_url else '❌ Missing'}")
print(f"Supabase Key: {'✅ Found' if supabase_key else '❌ Missing'}")
print(f"DeepSeek Key: {'✅ Found' if deepseek_key else '❌ Missing'}")

if not all([supabase_url, supabase_key, deepseek_key]):
    print("\n❌ Missing required environment variables!")
    sys.exit(1)

def test_recipe_lookup(recipe_id):
    """Test if we can find a recipe in the database"""
    try:
        import supabase
        client = supabase.create_client(supabase_url, supabase_key)
        
        print(f"\n🔍 Looking for enhancements for Recipe ID: {recipe_id}")
        
        # Check if enhancement exists
        response = client.table('recipe_enhancements').select('*').eq('recipe_id', str(recipe_id)).execute()
        
        if response.data:
            print(f"✅ Found existing enhancement for Recipe ID {recipe_id}")
            enhancement = response.data[0]
            print(f"   Created: {enhancement['created_at']}")
            print(f"   Enhancements count: {len(enhancement.get('enhancements', []))}")
            print(f"   Dietary preferences: {enhancement.get('dietary_preferences', 'None')}")
            return True
        else:
            print(f"❌ No enhancement found for Recipe ID {recipe_id}")
            return False
            
    except Exception as e:
        print(f"❌ Error checking recipe: {e}")
        return False

def test_deepseek_api():
    """Test the DeepSeek API directly"""
    try:
        print("\n🧪 Testing DeepSeek API directly...")
        
        # Test recipe data
        test_recipe = {
            "id": 123456,
            "title": "Test Recipe",
            "instructions": "Cook the ingredients together",
            "extendedIngredients": [
                {"original": "1 cup flour"},
                {"original": "2 eggs"},
                {"original": "1 cup milk"}
            ]
        }
        
        # DeepSeek API endpoint
        deepseek_url = "https://api.deepseek.com/v1/chat/completions"
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {deepseek_key}'
        }
        
        messages = [
            {
                "role": "system",
                "content": "You are a professional chef. Provide 3 recipe enhancements."
            },
            {
                "role": "user", 
                "content": f"Enhance this recipe: {test_recipe['title']}"
            }
        ]
        
        payload = {
            "model": "deepseek-chat",
            "messages": messages,
            "max_tokens": 500,
            "temperature": 0.7
        }
        
        response = requests.post(deepseek_url, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            print("✅ DeepSeek API is working!")
            data = response.json()
            if 'choices' in data and data['choices']:
                content = data['choices'][0]['message']['content']
                print(f"   Response preview: {content[:100]}...")
                return True
            else:
                print("❌ Invalid response structure from DeepSeek")
                return False
        else:
            print(f"❌ DeepSeek API error: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing DeepSeek API: {e}")
        return False

def test_pantrypal_api():
    """Test the PantryPal DeepSeek API endpoint"""
    try:
        print("\n🧪 Testing PantryPal DeepSeek API endpoint...")
        
        # Your deployed app URL
        api_url = "https://www.pantrypal-ai.space/api/deepseek/enhance"
        
        test_recipe = {
            "id": 123456,
            "title": "Test Recipe",
            "instructions": "Cook the ingredients together",
            "extendedIngredients": [
                {"original": "1 cup flour"},
                {"original": "2 eggs"},
                {"original": "1 cup milk"}
            ]
        }
        
        payload = {
            "recipe": test_recipe,
            "userDietaryPreferences": None
        }
        
        response = requests.post(api_url, json=payload, timeout=30)
        
        if response.status_code == 200:
            print("✅ PantryPal API is working!")
            data = response.json()
            print(f"   Enhancement ID: {data.get('enhancementId', 'N/A')}")
            print(f"   Enhancements count: {len(data.get('enhancements', []))}")
            return True
        else:
            print(f"❌ PantryPal API error: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing PantryPal API: {e}")
        return False

def main():
    print("🔧 PantryPal Enhancement Debug Tool")
    print("=" * 50)
    
    # Get recipe ID from user
    recipe_id = input("\nEnter the Recipe ID you deleted enhancement for: ").strip()
    
    if not recipe_id:
        print("❌ No Recipe ID provided")
        return
    
    # Test database lookup
    test_recipe_lookup(recipe_id)
    
    # Test DeepSeek API
    deepseek_works = test_deepseek_api()
    
    # Test PantryPal API
    pantrypal_works = test_pantrypal_api()
    
    print("\n" + "=" * 50)
    print("🎯 DIAGNOSIS:")
    
    if deepseek_works and pantrypal_works:
        print("✅ All APIs are working. The issue might be:")
        print("   - Frontend JavaScript error")
        print("   - Network timeout")
        print("   - Browser cache issue")
        print("\n💡 SOLUTIONS:")
        print("   1. Clear browser cache and refresh")
        print("   2. Check browser console for JavaScript errors")
        print("   3. Try a different browser")
    elif deepseek_works and not pantrypal_works:
        print("❌ PantryPal API has issues")
        print("💡 Check your deployment and server logs")
    elif not deepseek_works:
        print("❌ DeepSeek API has issues")
        print("💡 Check your DeepSeek API key and quota")
    else:
        print("❌ Multiple API issues detected")
        print("💡 Check all API keys and network connectivity")

if __name__ == "__main__":
    main()
