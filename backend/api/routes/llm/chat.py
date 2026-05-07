import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from api.schemas.chat import ChatRequest
from utils.deepseek_api import client

router = APIRouter(prefix="/llmApi", tags=["llm"])

@router.post("/chat")
async def chat(request_data: ChatRequest):
    messages = [msg.dict() for msg in request_data.messages]
    
    def generate():
        try:
            for content in client.chat_stream(messages, request_data.model):
                yield json.dumps({"content": content}) + "\n"
        except Exception as e:
            yield json.dumps({"error": str(e)}) + "\n"

    return StreamingResponse(generate(), media_type="application/json")
