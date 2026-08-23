# 资源系统架构

## 唯一公开资源源

Cloudflare R2 公共展示目录是课程、课件、活动照片和正式 Student Voice 图片的唯一运行时资源源。Git 仓库只保存应用代码、人工配置和生成索引，不再把大型展示资源打包进 Vercel。

```text
私有、已授权源文件
        ↓ 本地资源处理脚本
WebP / HTML / PDF / PNG 展示物
        ↓ 本地预检 + Cloudflare Access Service Token
upload.sciemetc.com（受保护 Worker）
        ↓ METC_BUCKET binding
R2: resources/METC/**
        ↓ assets.sciemetc.com 公共 GET/HEAD
generated/*.json + withResourceBaseUrl()
Vercel 静态前端
```

浏览器和 Vercel 只读取 `assets.sciemetc.com`，绝不持有上传凭证。维护者不直连 R2 S3 API；Worker 是唯一写入入口，并通过 Cloudflare Access Service Token 区分和撤销个人上传权限。

## R2 分类

```text
resources/METC/
├── 课程设计/<课程>/demonstration/       syllabus、课件 PDF、页面 PNG
├── 活动成果展览/<学校>/demonstration/   WebP/JPEG 展示照片
└── 听ta们说/demonstration/              Student Voice WebP（扁平目录）
```

原始 DOCX、PPTX、未审核照片和含隐私的原图不是公开网站资源，不得上传到公共 R2 路径。它们应保存在项目方受控的私有素材存储中。

## 索引和预加载

- `src/data/resources/generated/courses.json`：课程、syllabus 与课件索引。
- `src/data/resources/generated/albums.json`：活动相册与照片索引。
- `src/data/resources/generated/feedbacks.json`：已授权 Student Voice 索引。
- `components/resource-preloader.tsx`：用户进入任意页面后，使用会话级去重队列先加载当前路由关键资源；首帧空闲后以最多 3 个并发的低优先级 fetch 预热其余资源，路由切换只提升目标页面优先级；完整策略见 [分级加载与缓存](RESOURCE_LOADING_AND_CACHE.md)。

`lib/site-path.ts` 只把 `/resources/` 路径映射到 R2；`public/images` 仅保留站点 Logo 等应用外壳资产。真实内容不得新增到 `public/images`。

本地秘密保存在被 Git 忽略的 `.env.worker.local`，推荐让它指向仓库外、权限为 `600` 的个人凭证文件。唯一秘密字段为 `CF_ACCESS_CLIENT_ID` 和 `CF_ACCESS_CLIENT_SECRET`；它们不得进入脚本、提交、日志或 Vercel。
