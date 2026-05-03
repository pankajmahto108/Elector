from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.middleware import ErrorHandlingMiddleware
from app.api import chat, quiz, timeline

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Custom Middleware
app.add_middleware(ErrorHandlingMiddleware)

# Include Routers
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(quiz.router, prefix=settings.API_V1_STR)
app.include_router(timeline.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to Elector AI Production API"}
