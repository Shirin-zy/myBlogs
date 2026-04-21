# MEMORY.md - 项目长期记忆

## 项目信息

**项目名称**：Personal Blog - 个人博客系统（原 OSS Manager，已重构）
**项目路径**：`d:\project\OSS-manger\front`
**项目类型**：Next.js 15 前端应用（博客公开展示 + 管理后台）

## 最新路由结构（2026-04-18 重构后）

```
app/
├── (auth)/login/              # 登录页（管理员登录）
├── (home)/                    # 博客公开展示端（无需登录）
│   ├── layout.tsx             # 公共布局：SiteNavbar + SiteFooter
│   ├── page.tsx               # 首页（文章列表 + 侧边栏）
│   ├── posts/[slug]/page.tsx  # 文章详情（动态路由，SSR）
│   └── archive/page.tsx       # 归档页（时间轴）
└── (dashboard)/               # 管理后台（需登录）
    ├── layout.tsx             # 布局：Sidebar + Header
    ├── dashboard/page.tsx     # 数据工作台
    ├── posts/page.tsx         # 文章管理
    ├── audit/page.tsx         # 评论审核
    └── settings/page.tsx      # 系统配置
```

## 技术栈

| 类别 | 技术 | 版本 |
|:---|:---|:---|
| 框架 | Next.js (App Router, src 目录) | 15 |
| 语言 | TypeScript | 5 |
| 样式 | Tailwind CSS v4（CSS-first 配置） | 4 |
| UI 组件 | Shadcn UI 风格（手写基础组件） | - |
| 状态管理 | Zustand | 5 |
| 图标 | Lucide React | latest |
| 主题切换 | next-themes | - |
| 国际化 | next-intl（预留） | - |

## Less 集成方案（Next.js 15）

Next.js 15 **不原生支持** `.less` 文件，需要手动配置：

1. **安装包**：`npm install --save-dev less less-loader`
2. **配置 `next.config.js`**：在 `webpack()` 钩子中找到内置 CSS Modules 规则，**克隆一份**并修改 `test: /\.module\.less$/`，同时在 `use` 数组末尾追加 `less-loader`
3. **类型声明**：在 `src/types/less.d.ts` 添加 `declare module '*.module.less'`
4. **注意**：不能单独插入 less-loader 规则，必须复用 Next.js 已有的 css-loader + MiniCssExtractPlugin 处理链

## 重要配置规则

1. **Tailwind CSS v4** 使用 CSS-first 配置，无 `tailwind.config.js`
   - PostCSS 插件用 `@tailwindcss/postcss`，不用 `tailwindcss`
   - CSS 中用 `@import "tailwindcss"` + `@theme {}` 定义 token
   - `tailwindcss-animate` 在 v4 不可用，改用手写 keyframes

2. **路由结构**
   - `(auth)` 路由组：登录页
   - `(dashboard)` 路由组：所有业务页（带侧边栏布局）
   - `middleware.ts`：路由守卫，依赖 `oss-session` Cookie

3. **开发账号（Mock）**：admin / admin123

## 项目规范（来自 plan.md）

- 禁止 `any` 类型（http.ts 的 params 参数除外，有注释豁免）
- 敏感信息不存 localStorage，用安全 Cookie
- 大列表使用虚拟滚动
- 搜索防抖 300ms
- 敏感操作需二次确认弹窗
