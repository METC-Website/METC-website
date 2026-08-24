# METC 网站交接总览

本文件是下一位技术负责人接手仓库的起点。代码、经审核的资源源文件、展示物与生成索引位于仓库；公开展示物位于 R2。

## 当前交付状态

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| 首页 | 已实现 | 中英切换、品牌首屏、活动/课程/反馈入口和响应式布局 |
| 课程设计 `/teaching` | 已实现 | 课程书架、大纲 HTML 预览、课件图片浏览与全屏 |
| 活动成果 `/activities` | 已实现 | 自动生成学校相册、照片墙和灯箱 |
| 学生反馈 `/voices` | 已实现并接入正式内容 | 7 张已授权反馈对应 7 个信封；无 Demo 回退、年份或学校分类 |
| 全站资源加载与缓存 | 已实现并完成回归 | 当前路由优先、会话内 URL 去重、最多 3 个后台请求；跨页资源在首帧空闲后以低优先级预热 |
| 资源上传 Worker | 已实现 | `upload.sciemetc.com` 由 Access Service Token 保护，通过 `METC_BUCKET` binding 写入 R2 |
| 微信群二维码 | 预留完成，未启用 | 需添加 PNG 并调整一个开关 |
| CMS/网页管理后台 | 未实现 | 当前维护方式为版本化索引、本地处理脚本和受保护 Worker，不提供浏览器上传 UI |
| 正式线上部署 | Vercel only | 仓库只保留 Vercel 配置；需确认唯一正式 Project 与域名 |

## 目录职责

```text
app/                            路由、全局与页面级 CSS
components/                     页面可复用组件
content/                        人工维护的双语内容和正式资源映射
public/resources/METC/          已授权源文件与展示物；由 Vercel 忽略
src/data/resources/generated/   课程、相册、Student Voice 前端索引
tools/resource_pipeline/        资源转换和索引生成脚本
public/images/                  Logo 等站点外壳静态资产
docs/                            全部维护、运维和交接文档
```

`public/resources/METC/**/source/` 中的已授权原始教学文件必须保留，不允许由脚本覆盖。只有 `demonstration/` 中的展示物可上传 R2；`source/` 原件永不上传 R2 或 Vercel。仓库同时提交资源文件与 `src/data/resources/generated/` 索引。

## 交接后先做什么

1. 阅读根目录 `README.md` 和本文件，再按需阅读 `docs/RESOURCE_OPERATIONS.md`、`docs/STUDENT_FEEDBACK_OPERATIONS.md`、`docs/DEPLOYMENT.md`。
2. 执行 `pnpm install && pnpm typecheck && pnpm build`，确认接手环境可构建。
3. 确认 LibreOffice、Poppler 和 macOS `sips` 是否可用；它们只在更新资源预览时必需。
4. 与内容负责人确认后续学生反馈的隐私授权、双语文案、微信群二维码与唯一 Vercel Project。
5. 每次新增资源后，执行生成、R2 上传、公共校验，再提交生成索引。
6. 发布前用真实浏览器依次访问主要路由，确认同一 R2 URL 在一个页面会话中只请求一次、后台并发不超过 3，并确认路由切换和页面隐藏期间 Student Voice 动画暂停。

## 清理规则

以下都是本地机器或构建工具产物，不应提交：`.DS_Store`、`.next/`、`out/`、`output/`、`.playwright-cli/`、`node_modules/`、`*.tsbuildinfo`、日志文件。忽略规则已写入 `.gitignore`。`next-env.d.ts` 是已跟踪的 Next.js 类型入口；开发或构建命令可能临时改写它，若没有有意升级框架配置，应恢复为仓库基线而不是把测试产物带入提交。

不要把私有 Word/PPT/PDF、未审核照片或 Cloudflare Access Client Secret 提交到 Git。维护者通过受 Access 保护的 Worker 上传；仓库、前端和 Vercel 均不持有 R2 S3 写入密钥。
