from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.ai.gemini_service import gemini_service

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat_with_elector(request: ChatRequest):
    result = await gemini_service.get_chat_response(request.message, request.history)
    return result
