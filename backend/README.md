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
    │   │   │   ├── updateStatus.py # 更新文章状态
    │   │   │   └── tagStats.py     # 标签统计接口
    │   │   ├── auth/           # 认证模块
    │   │   ├── base/           # 基础模块
    │   │   │   ├── __init__.py
    │   │   │   ├── health.py       # 健康检查接口
    │   │   │   ├── upload.py       # 上传图片接口 
    │   │   │   ├── test_get.py     # 测试 GET 方法接口
    │   │   │   ├── toolset.py      # 工具集接口
    │   │   │   └── overview.py     # 网站概览接口
    │   │   ├── llm/            # AI 模块
    │   │   └── __init__.py     # 统一导出所有模块路由
    │   ├── schemas/            # Pydantic 数据模型 (用于校验和序列化)
    │   ├── deps.py             # FastAPI 依赖项 (如 JWT 鉴权)
    │   └── __init__.py
├── models/                 # SQLAlchemy 数据库模型
│   ├── __init__.py
│   ├── article.py          # 文章表模型
│   ├── toolset.py          # 工具集表模型
│   └── user.py             # 用户表模型
├── utils/                  # 工具类
│   ├── text_utils.py       # 文本处理工具 (字数统计等)
│   └── scheduler.py        # 定时任务 (文章字数统计)
├── storage/                # 持久化存储
│   └── tasks/              # 定时任务执行结果 (json 缓存)
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
| `views`      | `INTEGER`      | 文章查看次数                           | `0`       |
| `author`     | `VARCHAR(100)` | 作者用户名                             | `NULL`    |
| `location`   | `VARCHAR(100)` | 文章发布者地理位置                     | `NULL`    |

### 工具集表 (`toolsets`)

| 字段名       | 类型           | 说明           | 默认值 |
| :----------- | :------------- | :------------- | :----- |
| `id`         | `INTEGER`      | 主键 ID (自增) | -      |
| `categoryId` | `VARCHAR(50)`  | 分类 ID (索引) | -      |
| `name`       | `VARCHAR(100)` | 工具名称       | -      |
| `desc`       | `TEXT`         | 工具描述       | `NULL` |
| `url`        | `VARCHAR(500)` | 工具链接       | -      |
| `iconUrl`    | `VARCHAR(500)` | 网站图标地址   | `NULL` |

### 用户表 (`user`)

| 字段名             | 类型             | 说明                                     | 默认值    |
| :----------------- | :--------------- | :--------------------------------------- | :-------- |
| `id`               | `BIGINT UNSIGNED`| 主键 ID (自增)                           | -         |
| `email`            | `VARCHAR(128)`   | 用户邮箱 (登录账号，唯一索引)            | -         |
| `password`         | `VARCHAR(128)`   | 加密后的密码 (推荐 BCrypt 加密)          | -         |
| `nickname`         | `VARCHAR(50)`    | 用户昵称                                 | `''`      |
| `avatar_url`       | `VARCHAR(255)`   | 头像地址                                 | `''`      |
| `verify_code`      | `VARCHAR(32)`    | 动态验证码                               | `''`      |
| `verify_expire_time` | `DATETIME`     | 验证码过期时间 (索引)                    | `NULL`    |
| `ext_info`         | `JSON`           | 用户拓展信息 (JSON 格式)                 | `NULL`    |
| `role`             | `VARCHAR(20)`    | 用户角色 (admin 管理员 / user 普通用户)  | `'user'`  |
| `status`           | `TINYINT UNSIGNED`| 账号状态 (0 禁用 / 1 正常)             | `1`       |
| `create_time`      | `DATETIME`       | 创建时间                                 | `NOW()`   |

#####　说明
categoryId取值:
{ id: "ai-tools", name: "AI 工具", icon: "Bot" },
{ id: "design-drawing", name: "绘图设计", icon: "Palette" },
{ id: "dev-tools", name: "开发工具", icon: "Code" },
{ id: "video-music", name: "影音资源", icon: "Video" },
{ id: "material-resources", name: "设计素材", icon: "Library" },
{ id: "others", name: "其它", icon: "MoreHorizontal" },

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
