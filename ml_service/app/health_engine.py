def calculate_health_score(
    temperature,
    humidity,
    co2,
    tvoc,
    temp_delta=0,
    humidity_delta=0
):
    score = 100

    # Temperature
    if temperature < 15 or temperature > 38:
        score -= 30
    elif temperature < 20 or temperature > 36:
        score -= 15

    # Humidity
    if humidity < 35 or humidity > 90:
        score -= 25
    elif humidity < 45 or humidity > 85:
        score -= 12

    # CO2
    if co2 > 2500:
        score -= 20
    elif co2 > 1500:
        score -= 10

    # TVOC
    if tvoc > 1500:
        score -= 10

    # Sudden changes
    if abs(temp_delta) > 5:
        score -= 10

    if abs(humidity_delta) > 15:
        score -= 10

    score = max(0, min(100, score))

    if score >= 80:
        status = "Healthy"
    elif score >= 60:
        status = "Warning"
    else:
        status = "Critical"

    return score, status