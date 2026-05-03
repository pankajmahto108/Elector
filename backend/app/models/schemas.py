from pydantic import BaseModel, Field
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    classification: str

class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[str]
    answer: str
    explanation: str

class QuizGenerationRequest(BaseModel):
    difficulty: str = "Medium"
    topic: Optional[str] = "General"

class QuizScore(BaseModel):
    user_id: str
    score: int
    total: int
    difficulty: str
    timestamp: Optional[float] = None

class TimelineStepExplanationRequest(BaseModel):
    step_id: int
    step_title: str
    step_description: str
