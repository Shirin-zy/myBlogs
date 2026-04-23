import os
from openai import OpenAI

DEEPSEEK_API_KEY = "sk-e57efed5b0d740918c647416a1e68ff0"
DEEPSEEK_BASE_URL = "https://api.deepseek.com"


class DeepSeekClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.client = OpenAI(
                api_key=DEEPSEEK_API_KEY,
                base_url=DEEPSEEK_BASE_URL
            )
        return cls._instance

    def chat_stream(self, messages: list, model: str = "deepseek-chat"):
        """
        调用 DeepSeek 对话接口（流式输出）
        :param messages: 对话消息列表，格式为 [{"role": "system/user/assistant", "content": "..."}]
        :param model: 使用的模型，默认为 deepseek-chat
        :return: 返回一个生成器，逐步产出响应内容
        """
        stream = self.client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True
        )

        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content


client = DeepSeekClient()
