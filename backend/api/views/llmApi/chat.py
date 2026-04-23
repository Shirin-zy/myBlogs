from rest_framework.decorators import api_view
from django.http import StreamingHttpResponse
from utils.deepseek_api import client
import json


@api_view(["POST"])
def chat(request):
    """
    POST 方法调用 DeepSeek 对话接口（流式输出）
    请求体格式:
    {
        "messages": [{"role": "user", "content": "你好"}],
        "model": "deepseek-chat"  // 可选，默认为 deepseek-chat
    }
    """
    messages = request.data.get("messages", [])
    model = request.data.get("model", "deepseek-chat")

    if not messages:
        return StreamingHttpResponse(
            streaming_content=iter([json.dumps({"error": "messages 不能为空"})]),
            content_type="application/json"
        )

    def generate():
        try:
            for content in client.chat_stream(messages, model):
                yield json.dumps({"content": content}) + "\n"
        except Exception as e:
            yield json.dumps({"error": str(e)}) + "\n"

    return StreamingHttpResponse(
        streaming_content=generate(),
        content_type="application/json"
    )
