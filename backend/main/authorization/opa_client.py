import requests
from django.conf import settings


class OPAClient:
    def __init__(self):
        self.url = settings.OPA_URL
        self.timeout = getattr(settings, "OPA_TIMEOUT", 1)

    def evaluate(self, input_payload: dict) -> bool:
        try:
            response = requests.post(
                self.url,
                json={"input": input_payload},
                timeout=self.timeout,
            )
            response.raise_for_status()
            result = response.json().get("result", False)
            return bool(result)
        except requests.RequestException:
            # Fail closed in production
            return False
