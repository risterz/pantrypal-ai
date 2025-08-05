#!/usr/bin/env python3
"""
Test script to verify database connection for the Enhancement Cleaner tool.
"""

import os
import sys
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

print("\n🔍 Environment Variables Check:")
print(f"Supabase URL: {'✅ Found' if supabase_url else '❌ Missing'}")
print(f"Supabase Key: {'✅ Found' if supabase_key else '❌ Missing'}")

if not supabase_url or not supabase_key:
    print("\n❌ Missing required environment variables!")
    print("Make sure your .env file contains:")
    print("NEXT_PUBLIC_SUPABASE_URL=your_supabase_url")
    print("NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key")
    sys.exit(1)

# Test Supabase connection
try:
    import supabase
    print("\n🔗 Testing Supabase connection...")
    
    client = supabase.create_client(supabase_url, supabase_key)
    print("✅ Supabase client created successfully")
    
    # Test database query
    print("🔍 Testing database query...")
    response = client.table('recipe_enhancements').select('id').limit(1).execute()
    
    if response.data is not None:
        print(f"✅ Database connection successful! Found {len(response.data)} records")
        print("🎉 Your Enhancement Cleaner tool should work perfectly!")
    else:
        print("⚠️ Database connected but no data found (this is normal if no enhancements exist)")
        print("✅ Your Enhancement Cleaner tool should work!")
        
except ImportError:
    print("❌ Supabase module not found!")
    print("Please install it with: py -m pip install supabase")
    sys.exit(1)
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    print("Please check your Supabase URL and key")
    sys.exit(1)

print("\n🚀 All tests passed! You can now use the Enhancement Cleaner tool.")
print("Run: py enhancement_cleaner_gui.py")
