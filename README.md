# METC Website

METC（Maths and Engineering Teaching Club）官网已进入上线维护期。网站以静态导出的 Next.js 前端展示社团课程、活动成果与学生反馈；公开展示资源由 Cloudflare R2 提供，Vercel 负责站点部署。

## 当前站点

- `/`：社团介绍、课程/活动/Student Voice 入口及加入社群弹窗。
- `/teaching`：4 门课程的双语大纲与课件预览。
- `/activities`：6 个学校活动相册、照片墙与灯箱。
- `/voices`：7 份已授权的学生反馈互动展示。
- 微信群二维码由仓库内配置控制有效期；过期或加载失败时页面会显示提示，而不会展示旧二维码。

网站不包含登录、CMS、浏览器端上传或服务器端内容审核。内容变更通过版本化源文件、生成清单和受 Cloudflare Access 保护的上传 Worker 完成。

## 技术与部署

- Next.js 16、React 19、TypeScript 5、pnpm 10
- App Router + `output: "export"` 静态导出
- Vercel 根路径部署；不要配置 Vercel **Output Directory**
- Cloudflare R2：`https://assets.sciemetc.com`
- 上传 Worker：`https://upload.sciemetc.com`，仅供具备 Access Service Token 的维护者使用

`public/resources/` 保存经授权的源文件与展示物，但被 `.vercelignore` 排除；前端在构建时只需要 `src/data/resources/generated/` 下的 JSON 清单。

## 本地运行

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

提交前执行：

```bash
pnpm typecheck
pnpm build
```

## 维护文档

| 文档 | 用途 |
| --- | --- |
| [项目范围](docs/PROJECT_CONTEXT.md) | 已上线的产品范围与维护边界 |
| [设计语言](docs/DESIGN_LANGUAGE.md) | 当前界面与动效的视觉约束 |
| [本地开发](docs/LOCAL_SETUP.md) | 克隆、依赖、稀疏检出与开发工作流 |
| [Vercel 部署](docs/DEPLOYMENT.md) | 预览、生产发布及项目设置 |
| [资源系统架构](docs/RESOURCE_SYSTEM_ARCHITECTURE.md) | R2、Worker、生成清单与安全边界 |
| [资源运维](docs/RESOURCE_OPERATIONS.md) | 课程、相册、Student Voice、二维码与 R2 发布流程 |
| [加载与缓存](docs/RESOURCE_LOADING_AND_CACHE.md) | 资源格式、缓存与前端预热策略 |

所有保留文档描述当前线上维护方式；已完成的迁移计划、实施记录和调试过程不再保留在仓库中。
