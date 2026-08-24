# 资源运维

本文件是课程、相册、Student Voice 和微信群二维码的唯一维护流程。资源发布不通过 CMS 或浏览器上传；所有写入均从受控本地环境经 Cloudflare Access Worker 完成。

## 发布前边界

1. 确认公开授权、隐私处理、双语文案和内容准确性。
2. 已授权源文件可版本化保存在 `public/resources/METC/`；未审核或敏感文件不得提交。
3. `source/` 只保存原始材料，永不上传 R2；只有 `demonstration/` 展示物可以发布。
4. 不手工篡改生成清单或展示物。修改源文件/配置后运行生成脚本。

## 课程与活动

输入与展示物均位于 `public/resources/METC/`：

```text
课程设计/<课程>/source/                 原始 DOCX、PPTX、PDF
课程设计/<课程>/demonstration/          syllabus、预览 PDF、逐页 PNG
活动成果展览/<学校>/                     原始照片与 album.config.json
活动成果展览/<学校>/demonstration/       WebP/JPEG 展示照片
```

相册配置使用 `album.config.json` 选择 `coverPhoto` 和 `homepageFeaturePhoto`。完成内容修改后运行：

```bash
python3 tools/resource_pipeline/convert_docx.py
python3 tools/resource_pipeline/convert_pptx.py
python3 tools/resource_pipeline/generate_metadata.py
```

这些脚本更新展示物以及 `courses.json`、`albums.json`。依赖为 Python 3、Pillow、LibreOffice、Poppler；HEIC 预览转换仅依赖 macOS `sips`。

## Student Voice

目录结构：

```text
听ta们说/
├── feedback.config.json
├── source/<feedback-id>.<ext>
└── demonstration/<feedback-id>.webp
```

每项必须具有唯一小写 `id`、双语替代文本，并明确设置 `approvedForPublicUse: true`。生成器会校正方向、移除元数据、限制最长边为 2400px，以 WebP quality 82 输出，并更新 `feedbacks.json` 的内容哈希版本参数。

```bash
pnpm resources:feedback
pnpm r2:preflight-feedback
pnpm r2:upload-feedback
pnpm r2:verify-feedback
```

发布后在 `/voices` 检查信封数量、清单条数和本次批准图片数一致，并确认没有旧 Demo 或敏感信息。

## R2 上传与验证

真实凭证只放在 `.env.worker.local`（建议链接到仓库外、权限为 `600` 的文件）：

```dotenv
CF_ACCESS_CLIENT_ID=
CF_ACCESS_CLIENT_SECRET=
R2_WORKER_UPLOAD_URL=https://upload.sciemetc.com
NEXT_PUBLIC_RESOURCE_BASE_URL=https://assets.sciemetc.com
```

先验证访问权限，再对每个通用展示文件预检、上传和复核：

```bash
pnpm r2:check
pnpm r2:preflight -- /absolute/path/to/display.webp 'resources/METC/.../demonstration/file.webp'
pnpm r2:upload -- /absolute/path/to/display.webp 'resources/METC/.../demonstration/file.webp'
pnpm r2:verify-object -- 'resources/METC/.../demonstration/file.webp' 'image/webp'
pnpm r2:verify-cache
```

上传器只接受允许的展示 MIME、非空且不超过 100 MB 的文件；它验证对象键、凭证文件权限、受保护 Worker GET、公开域名 HEAD 和至少 24 小时的公共缓存。不要创建 R2 S3 密钥、打印 Client Secret，或直接修改 bucket 元数据。

`pnpm r2:verify-write` 会写入 `resources/_admin-test/` 做运维验证，且不会自动删除测试对象；仅在明确需要测试写入能力时运行。

## 微信群二维码

二维码是随 Vercel 发布的 `public/images` 站点资源，不上传 R2。使用官方、获准公开的 JPG、PNG 或 WebP，文件不超过 10 MB：

```bash
pnpm contact:qr -- /absolute/path/to/qr.jpg
pnpm contact:qr -- /absolute/path/to/qr.jpg --valid-days 10
pnpm contact:qr -- /absolute/path/to/qr.jpg --expires-on 2026-08-30
```

命令更新 `public/images/contact/wechat-join-qr.*` 和 `src/data/resources/generated/contact-qr.json`。前端按 `Asia/Shanghai` 判断有效期；到期或加载失败时不显示二维码。发布前用手机实际扫码，并运行 `pnpm typecheck`、`pnpm build`。

## 最终检查

1. 提交已审核源文件、展示物、配置和生成清单；绝不提交凭证或未审核素材。
2. 完成 `pnpm r2:verify-cache`、`pnpm typecheck` 和 `pnpm build`。
3. 在 Vercel Preview 检查 `/`、`/teaching`、`/activities`、`/voices` 及代表性 R2 URL。
4. 合并 `main` 后复核生产站点、缓存和二维码状态。
