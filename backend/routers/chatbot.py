from fastapi import APIRouter
from pydantic import BaseModel

from services.ai_service import chatbot_reply

router = APIRouter(
    prefix="/api/chatbot",
    tags=["AI Chatbot"]
)

class ChatRequest(BaseModel):
    message: str


@router.post("/ask")
def ask_ai(data: ChatRequest):

    return chatbot_reply(data.message)