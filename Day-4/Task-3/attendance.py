from datetime import datetime

WORK_START = "09:00"
LATE_THRESHOLD_MINUTES = 15

def calculate_hours(check_in: str, check_out: str):
    fmt = "%H:%M"

    ci = datetime.strptime(check_in, fmt)
    co = datetime.strptime(check_out, fmt)

    duration = co - ci          # Fix-1: Swapped the subtraction order 'check-in' (ci) from 'check-out' (co) so the duration is positive.

    hours_worked = duration.seconds / 3600

    start = datetime.strptime(WORK_START, fmt)

    late_by = (ci - start).seconds // 60

    is_late = late_by >= LATE_THRESHOLD_MINUTES     # Fix-2: Changed > to >= i.e Employee exactly 15 minutes late should also be flagged.

    return round(hours_worked, 2), is_late