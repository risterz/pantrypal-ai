import requests
import json

# Test the PantryPal API
api_url = 'https://www.pantrypal-ai.space/api/deepseek/enhance'
test_recipe = {
    'id': 123456,
    'title': 'Test Recipe',
    'instructions': 'Cook the ingredients together',
    'extendedIngredients': [{'original': '1 cup flour'}]
}

payload = {'recipe': test_recipe, 'userDietaryPreferences': None}

try:
    print("Testing PantryPal API...")
    response = requests.post(api_url, json=payload, timeout=30)
    print(f'Status: {response.status_code}')
    if response.status_code == 200:
        data = response.json()
        print(f'Success: {len(data.get("enhancements", []))} enhancements generated')
        print("First enhancement:", data.get("enhancements", ["None"])[0])
    else:
        print(f'Error: {response.text}')
except Exception as e:
    print(f'Exception: {e}')
