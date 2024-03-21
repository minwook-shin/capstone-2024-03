from datetime import datetime


def generate_unique_value():
    now = datetime.now()
    unique_value = now.strftime("%Y%m%d%H%M%S%f")

    return unique_value
