from sqlalchemy import create_engine, text
from pathlib import Path

# Load env
env = {}
with Path('backend/.env').open() as f:
    for line in f:
        line = line.strip()
        if line and '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip().strip('"').strip("'")

db_url = env['DATABASE_URL']
if db_url.startswith('mysql://'):
    db_url = db_url.replace('mysql://', 'mysql+pymysql://', 1)

engine = create_engine(db_url)

with engine.connect() as conn:
    # Check country for 10th of Ramadan
    cities_to_check = ['10Th Of Ramadan', '6Th Of October', 'Aba']
    
    print("Checking countries in dim_location:")
    for city in cities_to_check:
        result = conn.execute(
            text('SELECT city, country FROM dim_location WHERE city = :city'),
            {'city': city}
        ).fetchall()
        if result:
            for row in result:
                print(f'  {city} -> {row[1]}')
        else:
            print(f'  {city} -> NOT FOUND')
    
    print("\nChecking cube_city_season cities:")
    result = conn.execute(
        text('SELECT DISTINCT city FROM cube_city_season ORDER BY city LIMIT 5')
    ).fetchall()
    for row in result:
        print(f'  {row[0]}')
