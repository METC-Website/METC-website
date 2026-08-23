# Student Voice 图片生成与上传

正式学生反馈与活动照片使用同一个 Cloudflare R2 公共资源源。正式清单是页面唯一内容源，不保留本地 Demo 回退。

## 隐私边界

1. 取得学校、监护人和项目规范要求的公开授权。
2. 移除姓名、学号、电话、地址、聊天头像等敏感信息。
3. 未审核原图只保存在私有素材库；公共 R2 只接收审核通过、去元数据后的 WebP。
4. 每条反馈须确认双语替代文本和展示顺序；不按年份或学校建立子目录。

## 私有工作目录

环境变量 `METC_RESOURCE_ROOT` 指向私有 `resources/METC` 目录：

```text
听ta们说/
├── feedback.config.json
├── source/<feedback-id>.<原始扩展名>
└── demonstration/<feedback-id>.webp
```

从 `tools/resource_pipeline/templates/student-feedback.config.json` 复制配置模板。每项必须设置唯一小写 `id`、源文件、双语说明，并显式填写 `approvedForPublicUse: true`。

## 生成、上传、验证

```bash
pnpm resources:feedback
pnpm r2:check
pnpm r2:preflight-feedback
pnpm r2:upload-feedback
pnpm r2:verify-feedback
pnpm r2:verify-cache
pnpm typecheck
pnpm build
```

生成脚本会校验授权字段和文件类型、应用 EXIF 方向、限制长边为 2400px、去除原始元数据，并以 WebP quality 82 输出。前端清单写入 `src/data/resources/generated/feedbacks.json`，其中 `imageSrc` 自动附加由 WebP 内容生成的短 SHA-256 版本参数；覆盖同名 R2 对象后，浏览器会立即请求新版本，而不会复用含旧内容的缓存。只提交该清单，不提交私有原图或生成图片。

上传脚本为每张图提供并验证：

- `Content-Type: image/webp`
- Worker/公开域名响应：`Cache-Control: public, max-age=86400`
- 对象键：`resources/METC/听ta们说/demonstration/<id>.webp`

上传器会先对整份清单完成原子式预检；任何文件、对象键、授权或 Worker Access 检查失败时，不会开始上传。每个上传成功对象随后通过受保护 Worker GET 与公开域名 HEAD 验证。

最后必须在真实浏览器打开 `/voices`：信封数量、`feedbacks.json` 条目数和本次批准的 WebP 数量必须完全一致；不得出现旧 Demo、年份/学校筛选或无法公开读取的图片。首封图片作为当前页关键资源，其余反馈图在首帧空闲后进入会话级去重队列。

## 所需凭证

真实值只能放在仓库外的安全文件或本地被忽略的 `.env.worker.local` 中：

```text
CF_ACCESS_CLIENT_ID
CF_ACCESS_CLIENT_SECRET
R2_WORKER_UPLOAD_URL
NEXT_PUBLIC_RESOURCE_BASE_URL
METC_RESOURCE_ROOT
```

Access Service Token 必须属于保护 `upload.sciemetc.com` 的同一 Zero Trust Account，并被对应 Service Auth Policy 接受。不要在聊天、Git、脚本、日志、前端变量或 Vercel 中暴露 Client Secret；不要为本地维护者创建 R2 S3 密钥。
