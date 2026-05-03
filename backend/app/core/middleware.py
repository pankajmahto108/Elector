from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging_config import logger
import time
import traceback

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            logger.info(f"{request.method} {request.url.path} - {response.status_code} ({process_time:.4f}s)")
            return response
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(f"Unhandled error: {str(e)}\n{traceback.format_exc()}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"detail": "An internal server error occurred.", "error": str(e)}
            )
