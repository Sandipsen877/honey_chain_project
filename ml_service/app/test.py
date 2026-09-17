import requests
import random


def generate_reading():
    return {
        "temperature": random.uniform(33.0, 38.0),
        "temperature_gradient": random.uniform(-0.5, 0.5),
        "outside_temperature": random.uniform(27.0, 34.0),
        "outside_temperature_feels_like": random.uniform(28.0, 36.0),
        "temperature_difference": random.uniform(0.0, 8.0),
        "humidity": random.uniform(50.0, 70.0),
        "outside_humidity": random.uniform(60.0, 80.0),
        "wind": random.uniform(0.0, 10.0),
        "rain": random.uniform(0.0, 5.0),
        "co2": random.uniform(400.0, 800.0),
        "pressure": random.uniform(1000.0, 1025.0)
    }


days = []

# Generate data for 7 forecast days
for day in range(1, 8):

    readings = []

    # 144 readings = one day
    for i in range(144):
        readings.append(generate_reading())

    # Keep WeekSin / WeekCos fixed for this test day.
    # Later these will come from the actual date/dataset.
    week_sin = random.uniform(-1.0, 1.0)
    week_cos = random.uniform(-1.0, 1.0)

    days.append({
        "day": day,
        "week_sin": week_sin,
        "week_cos": week_cos,
        "readings": readings
    })


payload = {
    "hive_id": "HIVE_02",

    # Current measured hive weight
    "current_weight_kg": 42.50,

    "days": days
}


response = requests.post(
    "http://localhost:8000/predict/yield",
    json=payload
)


print("Status:", response.status_code)

print("\nResponse:")

try:
    print(response.json())
except Exception:
    print(response.text)