import requests
from django.http import HttpResponseForbidden

OPA_URL = "http://localhost:8181/v1/data/app/auth/allow"


def check_permission(input_data):
    try:
        response = requests.post(OPA_URL, json={"input": input_data}, timeout=2)

        if response.status_code != 200:
            print("OPA ERROR STATUS:", response.status_code)
            print("OPA ERROR BODY:", response.text)
            return False

        data = response.json()

        # 🔥 Correct extraction
        allowed = data.get("result", False)

        print("OPA DECISION:", allowed)

        return allowed

    except Exception as e:
        print("OPA CONNECTION ERROR:", str(e))
        return False
