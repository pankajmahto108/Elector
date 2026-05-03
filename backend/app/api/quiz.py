from fastapi import APIRouter, HTTPException
from app.models.schemas import QuizGenerationRequest, QuizScore, QuizQuestion
from app.services.ai.gemini_service import gemini_service
from app.services.data.firebase_service import firebase_service
from typing import List

router = APIRouter(prefix="/quiz", tags=["Quiz"])

@router.post("/generate", response_model=QuizQuestion)
async def generate_dynamic_quiz(request: QuizGenerationRequest):
    quiz = await gemini_service.generate_quiz(request.difficulty, request.topic)
    if not quiz:
        raise HTTPException(status_code=500, detail="Failed to generate quiz question.")
    return quiz

@router.post("/score")
async def submit_score(score: QuizScore):
    success = firebase_service.save_quiz_score(score.user_id, score.dict(exclude={'user_id'}))
    return {"status": "success" if success else "local_only"}

@router.get("/progress/{user_id}")
async def get_progress(user_id: str):
    progress = firebase_service.get_user_progress(user_id)
    return {"progress": progress}
