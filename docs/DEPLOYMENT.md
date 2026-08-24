# Vercel 部署

本项目是 Next.js 静态导出站点：`pnpm build` 运行 `next build`，由 `output: "export"` 生成静态文件。Vercel 是唯一部署目标。

## 项目设置

一个正式 Vercel Project 应连接此仓库，并使用：

| 设置 | 值 |
| --- | --- |
| Framework Preset | Next.js（自动检测） |
| Root Directory | 仓库根目录 `.` |
| Node.js | 24.x |
| Package Manager | pnpm 10.33.0（由 `packageManager` 声明） |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` |
| Output Directory | **留空，不配置** |
| Production Branch | `main` |

不要在 `vercel.json` 或控制台覆盖 Output Directory。Next.js 适配器会自动处理静态导出；强制设为 `out` 会导致 `Routes Manifest Could Not Be Found`。

## 资源与环境变量

- `public/resources/`、本地 `output/` 和 `.env*` 被 `.vercelignore` 排除。
- 课程、活动和 Student Voice 展示资源从 `https://assets.sciemetc.com` 加载。
- `NEXT_PUBLIC_RESOURCE_BASE_URL` 可选；未设置时使用上述安全默认值。
- 绝不在 Vercel 配置 `CF_ACCESS_CLIENT_ID`、`CF_ACCESS_CLIENT_SECRET`、R2 写入密钥或上传 Worker 管理凭证。

## 发布流程

1. 在分支运行 `pnpm install --frozen-lockfile`、`pnpm typecheck`、`pnpm build`。
2. 如包含资源更新，先完成 [资源运维](RESOURCE_OPERATIONS.md)中的生成、R2 校验和浏览器验证。
3. 检查 Vercel Preview：`/`、`/teaching`、`/activities`、`/voices` 与代表性 R2 资源。
4. 合并到 `main` 后由正式 Project 创建生产部署。
5. 发布后确认根路径无 `/METC-website` 前缀，二维码状态正确，且 R2 资源可访问。

若仓库连接了历史 Vercel 项目，请先确认其域名和生产分支，再在控制台解除重复连接；不要误删正式项目。
