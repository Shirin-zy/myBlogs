# MyBlog Backend (FastAPI)

这是一个基于 FastAPI 框架重构的博客后端项目。

## 项目目录结构

```text
backend/
├── api/                    # 核心业务逻辑
│   ├── routes/             # 路由分发层 (按模块划分子目录)
│   │   ├── article/        # 文章模块 (已从 Mock 迁移至 DB)
│   │   │   ├── __init__.py # 聚合文章路由
│   │   │   ├── allArticle.py # 后台管理获取所有文章
│   │   │   ├── publishedArticle.py # 门户获取已发布文章
│   │   │   ├── saveArticle.py # 保存/更新文章
│   │   │   ├── articleDetail.py # 获取文章详情
│   │   │   ├── deleteArticle.py # 删除文章
│   │   │   └── updateStatus.py # 更新文章状态
│   │   ├── auth/           # 认证模块
│   │   ├── base/           # 基础模块
│   │   ├── llm/            # AI 模块
│   │   └── __init__.py     # 统一导出所有模块路由
│   ├── schemas/            # Pydantic 数据模型 (用于校验和序列化)
│   ├── deps.py             # FastAPI 依赖项 (如 JWT 鉴权)
│   └── __init__.py
├── models/                 # SQLAlchemy 数据库模型
│   ├── __init__.py
│   └── article.py          # 文章表模型
├── utils/                  # 工具类
├── database.py             # 数据库连接初始化与会话管理
├── config.py               # 配置文件 (含数据库连接解析)
├── main.py                 # 程序入口，负责初始化应用并注册路由
├── .env                    # 环境变量 (数据库密码、运行端口等)
├── requirements.txt        # 项目依赖
└── README.md               # 项目说明文档
```

## 数据库结构

### 文章表 (`articles`)

| 字段名       | 类型           | 说明                                   | 默认值    |
| :----------- | :------------- | :------------------------------------- | :-------- |
| `id`         | `VARCHAR(36)`  | 主键 ID                                | -         |
| `title`      | `VARCHAR(255)` | 文章标题                               | -         |
| `content`    | `TEXT`         | 文章内容 (HTML/Markdown)               | -         |
| `created_at` | `DATETIME`     | 创建时间                               | `UTC_NOW` |
| `updated_at` | `DATETIME`     | 更新时间                               | `UTC_NOW` |
| `tags`       | `JSON`         | 标签列表 (数组)                        | `NULL`    |
| `category`   | `VARCHAR(100)` | 文章分类                               | `NULL`    |
| `is_new`     | `BOOLEAN`      | 是否为新文章                           | `TRUE`    |
| `bgPicture`  | `VARCHAR(500)` | 背景图片 URL                           | `NULL`    |
| `state`      | `VARCHAR(20)`  | 状态 (`published`, `draft`, `takeoff`) | `draft`   |
| `comment`    | `INTEGER`      | 评论数量                               | `0`       |
| `author`     | `VARCHAR(100)` | 作者用户名                             | `NULL`    |

## 快速启动

1. **安装依赖**

   ```bash
   pip install -r requirements.txt
   ```

2. **启动服务**
   ```bash
   python main.py
   ```
   服务将运行在: http://127.0.0.1:5173

## 接口说明

- 所有 API 均以 `/api` 为前缀。
- **认证**：使用 `blog-session` Cookie 存储 JWT Token。
- **文档**：启动服务后访问 http://127.0.0.1:5173/docs 查看 Swagger 交互式文档。
