from app.core.config import settings
from app.services.ai.prompt_builder import PromptBuilder
from app.services.ai.safety_guard import SafetyGuard
from app.services.ai.response_formatter import ResponseFormatter
from google import genai
from google.genai import types
from app.core.logging_config import logger

class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = 'gemini-2.5-flash'

    async def get_chat_response(self, message: str, history: list = None) -> dict:
        # 1. Classification
        classification = SafetyGuard.classify_query(message)
        logger.info(f"Query classification: {classification}")

        if classification == "unsafe":
            return {
                "reply": "I'm sorry, I cannot process this query as it violates safety guidelines.",
                "classification": classification
            }
        
        if classification not in ["election-related", "unrelated"]:
             return {
                "reply": "I specialize specifically in the Indian Election System. I'd be happy to answer any questions you have about EVMs, VVPATs, the Election Commission, or the voting process!",
                "classification": classification
            }

        # 2. Build Prompt
        system_prompt = PromptBuilder.get_system_prompt()
        user_prompt = PromptBuilder.build_chat_prompt(message, history)

        # 3. Call Gemini
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.7,
                )
            )
            return {
                "reply": response.text,
                "classification": classification
            }
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            return {
                "reply": "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
                "classification": "error"
            }

    async def generate_quiz(self, difficulty: str, topic: str) -> dict:
        prompt = PromptBuilder.build_quiz_prompt(difficulty, topic)
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            quiz_data = ResponseFormatter.clean_json_response(response.text)
            return quiz_data
        except Exception as e:
            logger.error(f"Quiz Generation Error: {str(e)}")
            return None

    async def explain_timeline_step(self, title: str, description: str) -> str:
        prompt = f"Provide a detailed but beginner-friendly explanation of this election step: '{title}' - {description}. Use the Definition, Key Points, and Example structure."
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=PromptBuilder.get_system_prompt()
                )
            )
            return response.text
        except:
            return "Could not generate explanation at this time."

gemini_service = GeminiService()
