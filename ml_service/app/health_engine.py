def clamp(value, minimum=0, maximum=100):
    return max(minimum, min(maximum, value))


def range_score(value, ideal_min, ideal_max, danger_min, danger_max):
    """
    Converts a sensor value into a 0-100 health score.

    100 = ideal range
    0   = dangerous range
    """

    if value is None:
        return 50

    value = float(value)

    if ideal_min <= value <= ideal_max:
        return 100

    if value < ideal_min:
        if value <= danger_min:
            return 0

        return 100 * (
            (value - danger_min) /
            (ideal_min - danger_min)
        )

    if value > ideal_max:
        if value >= danger_max:
            return 0

        return 100 * (
            (danger_max - value) /
            (danger_max - ideal_max)
        )

    return 50


def calculate_health_score(
    temperature,
    humidity,
    co2,
    tvoc,
    bee_in=0,
    bee_out=0,
    outside_temperature=None,
    outside_humidity=None,
    pressure=None,
    light=None,
    temp_delta=0,
    humidity_delta=0,
):
    """
    Multi-factor hive health scoring engine.

    Returns:
        score
        status
        details
    """

    risk_factors = []
    recommendations = []

    # =========================================================
    # 1. TEMPERATURE
    # =========================================================

    temperature_score = range_score(
        temperature,
        ideal_min=32,
        ideal_max=36,
        danger_min=20,
        danger_max=42,
    )

    if temperature < 30:
        risk_factors.append(
            "Hive temperature is significantly low"
        )
        recommendations.append(
            "Check colony condition and hive insulation"
        )

    elif temperature > 37:
        risk_factors.append(
            "Hive temperature is elevated"
        )
        recommendations.append(
            "Check ventilation and possible colony stress"
        )

    # =========================================================
    # 2. HUMIDITY
    # =========================================================

    humidity_score = range_score(
        humidity,
        ideal_min=45,
        ideal_max=75,
        danger_min=20,
        danger_max=95,
    )

    if humidity < 35:
        risk_factors.append(
            "Hive humidity is unusually low"
        )
        recommendations.append(
            "Check hive moisture conditions"
        )

    elif humidity > 80:
        risk_factors.append(
            "Hive humidity is unusually high"
        )
        recommendations.append(
            "Check ventilation and moisture accumulation"
        )

    # =========================================================
    # 3. BEE ACTIVITY
    # =========================================================

    bee_in = max(0, int(bee_in or 0))
    bee_out = max(0, int(bee_out or 0))

    bee_activity = bee_in + bee_out
    bee_flow = bee_in - bee_out

    # A simple normalized activity score.
    # This should eventually be calibrated using your actual
    # sensor data.

    if bee_activity >= 150:
        bee_activity_score = 100
    elif bee_activity >= 100:
        bee_activity_score = 90
    elif bee_activity >= 60:
        bee_activity_score = 75
    elif bee_activity >= 30:
        bee_activity_score = 60
    elif bee_activity >= 10:
        bee_activity_score = 40
    else:
        bee_activity_score = 20

    if bee_activity < 30:
        risk_factors.append(
            "Bee activity is unusually low"
        )
        recommendations.append(
            "Inspect colony activity and entrance traffic"
        )

    # =========================================================
    # 4. CO2
    # =========================================================

    co2_score = range_score(
        co2,
        ideal_min=500,
        ideal_max=1500,
        danger_min=300,
        danger_max=4000,
    )

    if co2 > 2500:
        risk_factors.append(
            "CO2 concentration is elevated"
        )
        recommendations.append(
            "Check hive ventilation"
        )

    # =========================================================
    # 5. TVOC
    # =========================================================

    tvoc_score = range_score(
        tvoc,
        ideal_min=0,
        ideal_max=500,
        danger_min=0,
        danger_max=2000,
    )

    if tvoc > 1500:
        risk_factors.append(
            "TVOC level is elevated"
        )

    # =========================================================
    # 6. TEMPERATURE CHANGE
    # =========================================================

    temperature_change_score = 100

    if abs(temp_delta) > 5:
        temperature_change_score = 30
        risk_factors.append(
            "Rapid temperature change detected"
        )
        recommendations.append(
            "Monitor hive temperature closely"
        )

    elif abs(temp_delta) > 3:
        temperature_change_score = 60
        risk_factors.append(
            "Moderate temperature change detected"
        )

    elif abs(temp_delta) > 1.5:
        temperature_change_score = 80

    # =========================================================
    # 7. HUMIDITY CHANGE
    # =========================================================

    humidity_change_score = 100

    if abs(humidity_delta) > 20:
        humidity_change_score = 30
        risk_factors.append(
            "Rapid humidity change detected"
        )

    elif abs(humidity_delta) > 10:
        humidity_change_score = 60

    elif abs(humidity_delta) > 5:
        humidity_change_score = 80

    # =========================================================
    # 8. INSIDE / OUTSIDE TEMPERATURE DIFFERENCE
    # =========================================================

    environment_score = 100

    if (
        outside_temperature is not None
        and temperature is not None
    ):
        temp_difference = (
            temperature - outside_temperature
        )

        # Large unexpected differences can indicate
        # abnormal hive conditions.
        if abs(temp_difference) > 12:
            environment_score = 50
            risk_factors.append(
                "Large inside/outside temperature difference"
            )

        elif abs(temp_difference) > 8:
            environment_score = 75

    # =========================================================
    # 9. WEIGHTED HEALTH SCORE
    # =========================================================

    score = (
        temperature_score * 0.25
        + humidity_score * 0.20
        + bee_activity_score * 0.20
        + co2_score * 0.10
        + tvoc_score * 0.05
        + temperature_change_score * 0.075
        + humidity_change_score * 0.075
        + environment_score * 0.05
    )

    score = round(clamp(score), 1)

    # =========================================================
    # 10. STATUS
    # =========================================================

    if score >= 80:
        status = "Healthy"

    elif score >= 60:
        status = "Warning"

    else:
        status = "Critical"

    # =========================================================
    # 11. INSPECTION DECISION
    # =========================================================

    inspection_required = (
        status != "Healthy"
        or temperature < 28
        or temperature > 38
        or humidity > 85
        or co2 > 2500
        or bee_activity < 20
    )

    # Remove duplicate recommendations
    recommendations = list(dict.fromkeys(recommendations))

    return {
        "score": score,
        "status": status,

        "bee_activity": bee_activity,
        "bee_in": bee_in,
        "bee_out": bee_out,
        "bee_flow": bee_flow,

        "components": {
            "temperature": round(temperature_score, 1),
            "humidity": round(humidity_score, 1),
            "bee_activity": round(bee_activity_score, 1),
            "co2": round(co2_score, 1),
            "tvoc": round(tvoc_score, 1),
            "temperature_change": round(
                temperature_change_score, 1
            ),
            "humidity_change": round(
                humidity_change_score, 1
            ),
            "environment": round(
                environment_score, 1
            ),
        },

        "risk_factors": risk_factors,
        "recommendations": recommendations,

        "inspection_required": inspection_required,
    }