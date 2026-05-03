from fastapi import APIRouter
from app.models.schemas import TimelineStepExplanationRequest
from app.services.ai.gemini_service import gemini_service

router = APIRouter(prefix="/timeline", tags=["Timeline"])

@router.get("/")
async def get_static_timeline():
    # Keep the static structure but we add the dynamic explanation endpoint
    return {
        "steps": [
            {"id": 1, "title": "Announcement", "description": "Election Commission announces the dates."},
            {"id": 2, "title": "Nomination", "description": "Candidates file their nomination papers."},
            {"id": 3, "title": "Campaigning", "description": "Parties campaign to gather support."},
            {"id": 4, "title": "Voting", "description": "Citizens cast their votes using EVMs."},
            {"id": 5, "title": "Counting", "description": "Votes are counted under strict security."},
            {"id": 6, "title": "Results", "description": "Final results are declared and the winning party forms the government."}
        ]
    }

@router.post("/explain")
async def explain_step(request: TimelineStepExplanationRequest):
    explanation = await gemini_service.explain_timeline_step(request.step_title, request.step_description)
    return {"explanation": explanation}
