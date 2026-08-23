# 资源处理流程

资源脚本从仓库根目录运行，输入根目录由 `METC_RESOURCE_ROOT` 指定。

```bash
python3 tools/resource_pipeline/convert_docx.py
python3 tools/resource_pipeline/convert_pptx.py
python3 tools/resource_pipeline/generate_metadata.py
pnpm resources:feedback
```

| 脚本 | 作用 |
| --- | --- |
| `convert_docx.py` | DOCX → 经清理的 syllabus HTML 与图片；图片声明 eager/async，供全站预加载器提前发现 |
| `convert_pptx.py` | PPT/PDF → 预览 PDF 与逐页 PNG |
| `generate_metadata.py` | 活动照片 → WebP/JPEG 展示物；生成课程和相册索引 |
| `generate_student_feedback.py` | 审核后的反馈照片 → WebP；生成 Student Voice 索引 |
| `r2_sync.mjs` | 检查 Worker Access、执行上传前校验、通过 Worker 上传、验证管理与公共 URL |

## 依赖

- Python 3 与 Pillow
- LibreOffice/soffice
- Poppler `pdftoppm`
- macOS `sips`（HEIC）
- Node.js、pnpm
- 每位维护者独立的 Cloudflare Access Service Token

## R2 命令

```bash
pnpm r2:check
pnpm r2:verify-write
pnpm r2:verify-object -- <resources/对象键> <Content-Type>
pnpm r2:preflight -- <本地展示文件> <resources/对象键> [Content-Type]
pnpm r2:upload -- <本地展示文件> <resources/对象键> [Content-Type]
pnpm r2:preflight-feedback
pnpm r2:upload-feedback
pnpm r2:verify-feedback
pnpm r2:verify-cache
```

`r2:preflight` 在任何写入前校验本地秘密文件权限、Access 凭证、固定 Worker/公开域名、文件存在性、100 MB 限制、展示文件 MIME、Unicode NFC 对象键、`resources/` 前缀以及 `source` 禁止规则。`r2:upload` 只有在同一套预检通过后才执行 `PUT`，随后同时验证受保护 Worker `GET` 和公开域名 `HEAD`。

`r2:verify-write` 会在 `resources/_admin-test/` 创建唯一文本对象并验证公开读取。上传器不会自动删除它；删除必须针对用户明确确认的完整对象键单独执行。`r2:verify-cache` 只读取公共响应头，不使用写入凭证，也不会修改历史对象。

所有公开展示物先上传 R2，再提交引用它们的生成索引。Vercel 构建不运行资源转换，也不包含私有资源目录。

Student Voice 使用扁平路径 `听ta们说/source/<id>.<ext>` 与 `听ta们说/demonstration/<id>.webp`，清单不记录年份或学校分类。生成的 `imageSrc` 带有基于 WebP 内容的版本参数，允许同名 R2 对象更新后安全绕过旧浏览器缓存；上传对象键本身保持稳定。运行 `pnpm resources:feedback` 前必须通过当前 shell 提供 `METC_RESOURCE_ROOT`；Worker 命令则会从本地 `.env.worker.local` 加载同一字段。

## 版本控制

需要提交：配置模板、处理脚本、`src/data/resources/generated/*.json`。

不得提交：私有源目录、`.env.worker.local`、真实 Access Client Secret、生成的展示图片、`out/`、`public/resources/`。
