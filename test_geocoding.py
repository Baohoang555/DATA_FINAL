import requests
from urllib.parse import quote_plus

key = '5885d82632c37ce42fac7509b2ef9002'
cities = ['Hanoi', 'Bangkok', 'Tokyo']

for city in cities:
    url = f'http://api.openweathermap.org/geo/1.0/direct?q={quote_plus(city)}&limit=1&appid={key}'
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            data = r.json()
            if data:
                print(f'{city}: {data[0]["lat"]}, {data[0]["lon"]}')
            else:
                print(f'{city}: no results')
        else:
            print(f'{city}: error {r.status_code}')
    except Exception as e:
        print(f'{city}: {e}')
