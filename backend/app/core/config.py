from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Elector AI"
    API_V1_STR: str = "/api/v1"
    
    GEMINI_API_KEY: str
    
    FIREBASE_CREDENTIALS_PATH: str = ""
    
    BACKEND_CORS_ORIGINS: list = ["*"]

settings = Settings()