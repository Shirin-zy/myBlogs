# MyBlog Backend (FastAPI)

这是一个基于 FastAPI 框架重构的博客后端项目。

## 项目目录结构

```text
backend/
├── api/                    # 核心业务逻辑
│   ├── routes/             # 路由分发层 (按模块划分子目录)
│   │   ├── article/        # 文章模块
│   │   │   ├── __init__.py # 聚合文章路由
│   │   │   ├── list.py     # 获取文章列表接口
│   │   │   └── wait_review.py # 获取待审核文章接口
│   │   ├── auth/           # 认证模块
│   │   │   ├── __init__.py # 聚合认证路由
│   │   │   ├── login.py    # 登录接口
│   │   │   └── logout.py   # 登出接口
│   │   ├── base/           # 基础模块
│   │   │   ├── __init__.py # 聚合基础路由
│   │   │   ├── health.py   # 健康检查接口
│   │   │   └── test_get.py # 测试 GET 接口
│   │   ├── llm/            # AI 模块
│   │   │   ├── __init__.py # 聚合 AI 路由
│   │   │   └── chat.py     # DeepSeek 对话接口
│   │   └── __init__.py     # 统一导出所有模块路由
│   ├── schemas/            # Pydantic 数据模型 (用于校验和序列化)
│   │   ├── auth.py
│   │   └── chat.py
│   ├── deps.py             # FastAPI 依赖项 (如 JWT 鉴权)
│   └── __init__.py
├── utils/                  # 工具类
│   ├── deepseek_api.py     # DeepSeek API 封装
│   ├── fastapi_utils.py    # FastAPI 通用工具 (JWT 生成/校验)
│   └── __init__.py
├── main.py                 # 程序入口，负责初始化应用并注册路由
├── requirements.txt        # 项目依赖
└── README.md               # 项目说明文档
```

## 快速启动

1. **安装依赖**

   ```bash
   pip install -r requirements.txt
   ```

2. **启动服务**
   ```bash
   python main.py
   ```
   服务将运行在: http://127.0.0.1:8000

## 接口说明

- 所有 API 均以 `/api` 为前缀。
- **认证**：使用 `blog-session` Cookie 存储 JWT Token。
- **文档**：启动服务后访问 http://127.0.0.1:8000/docs 查看 Swagger 交互式文档。
