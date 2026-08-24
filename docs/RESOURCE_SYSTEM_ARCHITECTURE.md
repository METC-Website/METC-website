# 资源系统架构

## 运行时模型

课程、课件、活动照片和 Student Voice 的公开展示物只从 Cloudflare R2 读取；Vercel 只提供静态前端和少量站点外壳图片。

```text
已授权源文件（仓库中的 public/resources/METC）
        ↓ 本地转换与索引生成
展示物 + src/data/resources/generated/*.json
        ↓ Access Service Token
upload.sciemetc.com（受保护 Worker）
        ↓
R2: resources/METC/**
        ↓ 公开 GET/HEAD
assets.sciemetc.com
        ↓
Vercel 静态前端
```

`lib/site-path.ts` 将生成清单中遗留的 `/resources/` 路径转换到公开 R2 域名，并移除历史 GitHub Pages 前缀。`NEXT_PUBLIC_RESOURCE_BASE_URL` 未设置时回退到 `https://assets.sciemetc.com`。

## 仓库边界

| 位置 | 职责 |
| --- | --- |
| `public/resources/METC/` | 已授权源文件、配置和生成展示物；由 Vercel 忽略 |
| `src/data/resources/generated/` | 课程、相册、反馈与二维码的前端清单；必须进入构建 |
| `public/images/` | Logo、二维码等少量随站点发布的应用外壳资源 |
| `tools/resource_pipeline/` | 本地转换、清单生成与 R2 上传脚本 |

公开 R2 路径只接收 `demonstration/` 下的展示物。原始 DOCX、PPTX、未审核照片和含隐私原图不得上传到 R2；未审核或敏感素材必须留在受控的私有位置。

## 安全边界

- Worker 是唯一写入入口，维护者不使用 R2 S3 Access Key。
- 浏览器、GitHub、Vercel 和生成清单都不得包含写入凭证。
- `CF_ACCESS_CLIENT_ID` 与 `CF_ACCESS_CLIENT_SECRET` 仅存在于维护者本地、被忽略的环境文件。
- R2 对象键以 `resources/` 开头；正式内容位于 `resources/METC/**/demonstration/`。

具体内容发布流程见[资源运维](RESOURCE_OPERATIONS.md)，缓存与预热策略见[加载与缓存](RESOURCE_LOADING_AND_CACHE.md)。
