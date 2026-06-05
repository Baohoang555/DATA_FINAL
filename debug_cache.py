import json
from pathlib import Path

cache = json.loads(Path('backend/city_geo_cache.json').read_text())

print('Sample cache entries (first 5):')
for idx, key in enumerate(list(cache.keys())[:5]):
    entry = cache[key]
    print(f'  {idx+1}. "{key}": lat={entry.get("lat")}, lon={entry.get("lon")}')

print(f'\nTotal entries in cache: {len(cache)}')
entries_with_coords = sum(1 for v in cache.values() if v.get('lat') is not None)
print(f'Entries with valid coordinates: {entries_with_coords}')

# Check if 10th of Ramadan is in cache
test_keys = ['10Th Of Ramadan,Egypt', '10th Of Ramadan,Egypt', '10Th of Ramadan,Egypt']
print(f'\nLooking for 10th of Ramadan:')
for test_key in test_keys:
    if test_key in cache:
        print(f'  ✅ Found: "{test_key}" -> {cache[test_key]}')
    else:
        print(f'  ❌ Not found: "{test_key}"')
