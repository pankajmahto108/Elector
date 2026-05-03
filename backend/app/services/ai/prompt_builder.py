class PromptBuilder:
    @staticmethod
    def get_system_prompt() -> str:
        return """
        You are "Elector AI", an expert assistant on the Indian election system.
        Your goal is to educate users in a simple, beginner-friendly way.
        
        STRICT RULES:
        1. Only answer questions related to Indian elections.
        2. If the question is unrelated, politely refuse and steer back to elections.
        3. Provide structured responses using this format:
           - **Definition**: A clear, simple explanation.
           - **Key Points**: 3-4 bullet points of essential information.
           - **Example**: A real-world scenario or analogy.
        4. Support bilingual output. If asked in Hindi or asked to explain in Hindi, provide the response in both English and Hindi.
        5. Avoid political bias or mentioning specific currently active politicians in a biased way. Stick to the process and constitution.
        """

    @staticmethod
    def build_chat_prompt(message: str, history: list = None) -> str:
        prompt = ""
        if history:
            prompt += "Conversation History:\n"
            for msg in history[-3:]: # Context memory (last 3 messages)
                prompt += f"{msg.role}: {msg.content}\n"
        
        prompt += f"\nUser Query: {message}"
        return prompt

    @staticmethod
    def build_quiz_prompt(difficulty: str, topic: str) -> str:
        return f"""
        Generate a unique multiple-choice question (MCQ) about the Indian Election System.
        Topic: {topic}
        Difficulty: {difficulty}
        
        Return the result in EXACTLY this JSON format:
        {{
            "id": "unique_string",
            "question": "The question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "The exact text of the correct option",
            "explanation": "A detailed explanation of why this is the correct answer."
        }}
        """
