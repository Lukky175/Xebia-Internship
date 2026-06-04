import requests

API_BASE_URL = "https://hr-internal.company.com/api"
API_TOKEN = "your_token_here"

def get_employee(employee_id):
    url = f"{API_BASE_URL}/employees/{employee_id}"

    headers = {
        "Authorization": f"Bearer {API_TOKEN}"  # Fix-1: Added Authorization as required by API.
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 404:
        return None             # Fix-2: Return 'None' if employee is not found.

    data = response.json()

    return data.get("employee")