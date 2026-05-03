import firebase_admin
from firebase_admin import credentials, firestore
from app.core.config import settings
from app.core.logging_config import logger
import os

class FirebaseService:
    def __init__(self):
        self.db = None
        try:
            if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                firebase_admin.initialize_app(cred)
                self.db = firestore.client()
                logger.info("Firebase initialized successfully.")
            else:
                logger.warning("Firebase credentials not found. Database features will be disabled.")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {str(e)}")

    def save_quiz_score(self, user_id: str, score_data: dict):
        if not self.db: return False
        try:
            self.db.collection('quiz_scores').add({
                'user_id': user_id,
                **score_data,
                'timestamp': firestore.SERVER_TIMESTAMP
            })
            return True
        except Exception as e:
            logger.error(f"Error saving quiz score: {str(e)}")
            return False

    def get_user_progress(self, user_id: str):
        if not self.db: return []
        try:
            docs = self.db.collection('quiz_scores').where('user_id', '==', user_id).order_by('timestamp', direction=firestore.Query.DESCENDING).limit(10).stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            logger.error(f"Error fetching user progress: {str(e)}")
            return []

firebase_service = FirebaseService()
