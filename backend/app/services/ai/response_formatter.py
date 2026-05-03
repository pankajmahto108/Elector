import json
import re

class ResponseFormatter:
    @staticmethod
    def clean_json_response(text: str) -> dict:
        # Extract JSON from markdown blocks if present
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except:
                pass
        return None

    @staticmethod
    def format_reply(text: str) -> str:
        # Ensure it follows the structured format if not already
        return text.strip()
