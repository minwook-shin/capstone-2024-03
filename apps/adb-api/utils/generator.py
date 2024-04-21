"""
This module contains the functions to generate unique values.
"""
from datetime import datetime


def generate_unique_value():
    """
    Generate a unique value based on the current time.
    """
    now = datetime.now()
    unique_value = now.strftime("%Y%m%d%H%M%S%f")

    return unique_value
