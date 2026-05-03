from app.core.config import settings
from google import genai
from google.genai import types

client = genai.Client(api_key=settings.GEMINI_API_KEY)
class SafetyGuard:
    @staticmethod
    def classify_query(query: str) -> str:
        
        classification_prompt = f"""
        Classify the following query into one of these categories:
        1. "election-related": Questions about the Indian election system, processes, bodies (ECI), terminology (EVM, VVPAT), or laws.
        2. "general knowledge": Factual questions not related to elections.
        3. "unrelated": Chatting, greetings, or completely off-topic queries.
        4. "unsafe": Hate speech, political bias, or harmful content.

        Query: "{query}"
        
        Return ONLY the category name.
        """
        
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=classification_prompt
            )
            category = response.text.strip().lower()
            if "election-related" in category: return "election-related"
            if "general knowledge" in category: return "general"
            if "unsafe" in category: return "unsafe"
            return "unrelated"
        except:
            return "unrelated"
