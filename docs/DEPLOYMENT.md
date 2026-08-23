# Vercel 部署指南

Vercel 是本项目唯一的部署目标。项目使用 Next.js `output: "export"`，`pnpm build` 生成 `out/`，Vercel 配置见根目录 `vercel.json`。

## 部署边界

- GitHub Pages 工作流已移除，不再创建 Pages artifact 或 deployment。
- Vercel 只部署应用代码、生成索引与 `public/images` 中少量站点外壳资源。
- 课程、课件、活动照片与正式 Student Voice 图片从 Cloudflare R2 公共展示目录读取；`resources/` 与旧 `public/resources/` 不进入 Vercel 上传内容。
- 生产部署使用域名根路径，不再依赖 `/METC-website`。资源索引中的历史前缀会由 `lib/site-path.ts` 兼容移除。

## Vercel 项目要求

GitHub 仓库只应连接一个正式 Vercel Project。项目设置必须为：

| 设置 | 值 |
| --- | --- |
| Framework | Next.js |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` |
| Output Directory | `out` |
| Production Branch | `main` |
| `NEXT_PUBLIC_RESOURCE_BASE_URL` | `https://assets.sciemetc.com` |

不要在 Vercel 中配置 `CF_ACCESS_CLIENT_ID`、`CF_ACCESS_CLIENT_SECRET`、Worker 写入地址或任何 R2 写入密钥；生成与上传资源只在受控本地维护环境执行。

## 发布流程

1. 先生成、上传并通过公共 HEAD 请求验证 R2 对象。
2. 执行 `pnpm r2:verify-cache`、`pnpm typecheck` 与 `pnpm build`。
3. 在功能分支检查 Preview Deployment。
4. 合并至 `main`，由唯一的 Vercel Project 创建 Production Deployment。
5. 在线验证 `/`、`/teaching`、`/activities`、`/voices` 及 R2 图片。
6. 在同一浏览器页面会话中连续切换主要路由，确认 R2 URL 无重复预热、后台并发不超过 3、当前路由资源先于跨页资源，且切到后台时 Student Voice 动画暂停。

如果 GitHub Deployments 中出现多个 Vercel Production 环境，应在 Vercel 控制台解除旧 Project 与本仓库的连接，只保留正式 Project。
