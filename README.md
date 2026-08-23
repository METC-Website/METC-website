# METC Website

METC（Maths and Engineering Teaching Club）公开网站。它展示社团的教学资源、课堂活动和学生反馈；站点本身是静态导出的 Next.js 前端，不包含账号系统或 CMS。公开展示物存储在 R2，维护者通过受 Cloudflare Access 保护的 Worker 上传。

## 当前阶段

网站已完成可交接的前端与资源展示基础：首页、课程设计、活动成果展览、学生反馈页均已实现。公开展示资源统一由 Cloudflare R2 提供，受保护 Worker 是唯一写入入口，Vercel 是唯一部署目标。浏览器采用会话级去重和路由分级预热：当前页优先，其余资源在首帧空闲后低优先级进入 HTTP 缓存，不提前解码全站图片。

尚待完成的事项：

- 上传并启用 METC 微信群二维码。
- 在唯一的正式 Vercel Project 中完成域名与线上验收。
- 持续补充真实活动照片、课程材料与元数据。

## 技术栈

- Next.js 16（App Router，`output: "export"` 静态导出）
- React 19、TypeScript 5、pnpm
- 原生 CSS；不使用 Tailwind、CSS-in-JS 或组件库
- Python 3 资源处理脚本；DOCX/PPTX 转换依赖 LibreOffice，幻灯片导出依赖 Poppler，HEIC 预览转换使用 macOS `sips`

## 路由

| 页面 | 开发地址 | 说明 |
| --- | --- | --- |
| 首页 | `/` | 品牌介绍、活动入口与社团内容 |
| 课程设计 | `/teaching` | 课程大纲与图片化课件预览 |
| 活动成果展览 | `/activities` | 学校相册、瀑布流与灯箱 |
| 听 ta 们说 | `/voices` | 7 份已授权学生反馈；正式清单是唯一内容源 |

生产环境由 Vercel 在域名根路径提供；资源索引中的历史 `/METC-website` 前缀由路径工具兼容处理。

## 本地运行

```bash
pnpm install
pnpm dev
```

常用检查：

```bash
pnpm typecheck
pnpm build
```

资源更新后，先执行：

```bash
python3 tools/resource_pipeline/convert_docx.py
python3 tools/resource_pipeline/convert_pptx.py
python3 tools/resource_pipeline/generate_metadata.py
pnpm resources:feedback
pnpm r2:check
pnpm r2:preflight-feedback
pnpm r2:upload-feedback
pnpm r2:verify-feedback
```

## 项目结构

```text
app/                    页面路由与页面级样式
components/             页面与交互组件
content/                人工维护的双语文案与正式资源映射
私有 METC_RESOURCE_ROOT  已授权源文件及本地生成展示物
src/data/resources/     由资源脚本生成的前端索引
tools/resource_pipeline/ 资源转换与元数据生成脚本
public/images/          Logo 等站点外壳资源；真实内容不放在这里
docs/                   全部项目、交接和运维文档
```

## 文档导航

所有非本文件的文档均位于 `docs/`：

| 文档 | 用途 |
| --- | --- |
| [交接总览](docs/HANDOVER.md) | 当前交付状态、目录职责、交接检查清单 |
| [项目背景](docs/PROJECT_CONTEXT.md) | METC 定位、网站目标与范围 |
| [资源系统架构](docs/RESOURCE_SYSTEM_ARCHITECTURE.md) | 课程与相册如何进入前端 |
| [资源上传与封面](docs/RESOURCE_OPERATIONS.md) | Word、PPT、PDF、照片上传和封面选择规范 |
| [资源处理流程](docs/RESOURCE_PIPELINE.md) | 脚本、依赖、生成产物和故障排查 |
| [Worker 上传操作](docs/WORKER_UPLOAD_OPERATIONS.md) | Access Token、本地秘密、预检、上传与验证 |
| [学生反馈照片](docs/STUDENT_FEEDBACK_OPERATIONS.md) | 真实反馈照片的隐私审核、上传与前端适配 |
| [分级加载与缓存](docs/RESOURCE_LOADING_AND_CACHE.md) | 去除懒加载后的会话去重、页面优先级、后台预热与浏览器缓存策略 |
| [二维码运维](docs/CONTACT_QR_CODE_OPERATIONS.md) | 微信群二维码替换和启用步骤 |
| [部署指南](docs/DEPLOYMENT.md) | 静态导出、发布前检查与待定事项 |
| [资源系统实施记录](docs/RESOURCE_SYSTEM_IMPLEMENTATION.md) | 已完成资源系统的实现边界与验证记录 |
| [本地开发环境](docs/LOCAL_SETUP.md) | 稀疏克隆、依赖安装、本地运行与凭证入口 |
| [图片优化与缓存](docs/IMAGE_OPTIMIZATION.md) | WebP、响应头、版本参数与页面预热约束 |
| [设计语言](docs/DESIGN_LANGUAGE.md) | 品牌视觉原则 |
| [首页愿景](docs/HOMEPAGE_VISION.md) | 首页叙事与首屏约束 |
| [前端迁移计划](docs/FRONTEND_MIGRATION_PLAN.md) | 历史规划及已完成/待完成范围 |

`docs/superpowers/plans/` 与 `docs/superpowers/specs/` 仅保存已完成方案的历史决策。每份文件顶部均标记其历史状态；当前行为以代码、README 和上述现行运维文档为准。
