# OSS Manager - 对象存储管理系统

基于 **Next.js 15 + TypeScript + Shadcn UI + Tailwind CSS** 构建的高效、易用的 OSS 对象存储 Web 端管理界面。

## 🚀 技术栈

| 类别 | 技术 | 版本 |
|:---|:---|:---|
| 框架 | Next.js (App Router) | ^15 |
| 语言 | TypeScript | ^5 |
| UI 组件库 | Shadcn UI + Tailwind CSS | latest |
| 状态管理 | Zustand | ^5 |
| 图标 | Lucide React | latest |
| 主题切换 | next-themes | ^0.4 |
| 国际化 | next-intl | ^4 |

## 📁 项目结构

```
src/
├── app/                         # Next.js App Router
│   ├── (auth)/                  # 认证路由组
│   │   └── login/page.tsx       # 登录页
│   ├── (dashboard)/             # 控制台路由组
│   │   ├── layout.tsx           # 控制台布局（含侧边栏）
│   │   ├── dashboard/page.tsx   # 控制台首页
│   │   ├── buckets/page.tsx     # Bucket 管理
│   │   ├── files/page.tsx       # 文件管理
│   │   ├── permissions/page.tsx # 权限管理
│   │   ├── audit/page.tsx       # 操作日志
│   │   └── settings/page.tsx    # 全局设置
│   ├── globals.css              # 全局样式 + CSS 变量
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 根页面（重定向）
├── components/
│   ├── auth/                    # 认证相关组件
│   ├── buckets/                 # Bucket 模块组件
│   ├── dashboard/               # 控制台组件
│   ├── layout/                  # 布局组件（侧边栏、顶栏）
│   ├── providers/               # 全局 Provider
│   └── ui/                      # Shadcn UI 基础组件
├── hooks/                       # 自定义 Hooks
│   ├── use-toast.ts             # 通知 Hook
│   └── use-debounce.ts          # 防抖 Hook
├── lib/
│   ├── utils.ts                 # 工具函数
│   └── http.ts                  # HTTP 请求封装
├── services/                    # API 服务层
│   └── bucket-service.ts
├── stores/                      # Zustand 状态管理
│   ├── auth-store.ts            # 认证状态
│   └── settings-store.ts        # 全局设置
├── types/                       # TypeScript 类型定义
│   └── index.ts
└── middleware.ts                 # Next.js 中间件（路由守卫）
```

## 🛠️ 开发指南

### 环境准备

```bash
# 安装依赖
npm install

# 复制环境变量
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

### 常用命令

```bash
npm run dev         # 启动开发服务器（http://localhost:3000）
npm run build       # 构建生产包
npm run start       # 启动生产服务器
npm run lint        # 运行 ESLint
npm run type-check  # TypeScript 类型检查
```

### 添加 Shadcn UI 组件

```bash
npx shadcn@latest add <component-name>
# 例如：npx shadcn@latest add table dialog select
```

## 📋 开发规范

详见 [plan/plan.md](./plan/plan.md) 中的开发规范章节。

### 核心原则

- **TypeScript 严格模式**：禁止 `any`，所有接口必须定义类型
- **组件单一职责**：UI 展现与业务逻辑（Hooks）分离
- **性能优先**：大列表使用虚拟滚动，搜索使用防抖
- **安全编码**：敏感操作二次确认，XSS 防护，Token 存储于 Cookie

## 🎨 主题

支持亮色 / 暗色 / 跟随系统三种模式，通过顶部导航栏切换。

## 🔐 认证（开发模拟）

测试账号：`admin` / `admin123`（开发模式下的模拟登录）
