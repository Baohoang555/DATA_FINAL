import requests
import json

r = requests.get('http://127.0.0.1:8000/current-all-stations', timeout=5).json()
data = r.get('data', {})

# Lấy 5 thành phố đầu
result = {}
for city in list(data.keys())[:5]:
    info = data[city]
    result[city] = {
        'lat': info.get('lat'),
        'lon': info.get('lon'),
        'pm25': info.get('pm25')
    }

print(json.dumps(result, indent=2))
print(f"\n✅ Total cities: {len(data)}")
print(f"✅ Cities with coordinates: {sum(1 for v in data.values() if v.get('lat') and v.get('lon'))}")
