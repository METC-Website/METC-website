# Cloudflare Worker 资源上传操作

## 架构与权限边界

网站公开资源的唯一存储源是 R2 bucket `metc-data`。公开读取和管理写入分离：

| 地址 | 用途 | 权限 |
| --- | --- | --- |
| `https://assets.sciemetc.com` | 网站和上传后校验 | 公开 `GET/HEAD` |
| `https://upload.sciemetc.com` | 上传器管理读写 | Cloudflare Access Service Token |
| `metc-data` | 实际对象存储 | Worker `METC_BUCKET` binding |

维护者不获得 R2 S3 Access Key。每人使用独立 Access Service Token，例如 `metc-upload-hanchen`；Token 必须属于保护上传域名的同一 Zero Trust Account，并被 Service Auth Policy 接受。

## 本地环境

版本库只提交无真实值的 `.env.example`。真实凭证保存在仓库外、权限为 `600` 的文件中，本地使用被 Git 忽略的入口：

```bash
ln -s /absolute/path/to/protected/worker.env .env.worker.local
```

本地字段：

```dotenv
CF_ACCESS_CLIENT_ID=
CF_ACCESS_CLIENT_SECRET=
R2_WORKER_UPLOAD_URL=https://upload.sciemetc.com
NEXT_PUBLIC_RESOURCE_BASE_URL=https://assets.sciemetc.com
METC_RESOURCE_ROOT=/absolute/path/to/resources/METC
```

Client Secret 不得发送到聊天、写入脚本、提交到 Git、打印到日志或配置到 Vercel。上传器启动时会检查本地凭证目标文件没有 group/other 权限。

## 对象与文件限制

- 对象键必须以 `resources/` 开头并使用 Unicode NFC。
- 路径不得包含空段、`.`、`..`、反斜线或名为 `source` 的目录。
- 本地文件路径也不得位于 `source/` 下。
- 只上传 WebP/JPEG/PNG/GIF/SVG、HTML、PDF 和纯文本展示产物。
- HTML 必须使用 `text/html; charset=utf-8`。
- 单文件必须非空且不超过 100 MB。
- 正式内容放在 `resources/METC/**/demonstration/`；`resources/_admin-test/` 只用于明确的运维验证。

## 命令

只读检查个人 Token、Access Policy、Worker 和 R2 binding：

```bash
pnpm r2:check
```

通用文件先预检再上传：

```bash
pnpm r2:preflight -- \
  /absolute/path/to/display.webp \
  'resources/METC/听ta们说/demonstration/feedback-01.webp'

pnpm r2:upload -- \
  /absolute/path/to/display.webp \
  'resources/METC/听ta们说/demonstration/feedback-01.webp'
```

上传器会从扩展名推导 Content-Type，也可提供第三个参数；显式类型必须与扩展名一致。`PUT` 成功必须返回 `201`，随后管理域名 GET 和公开域名 HEAD 都必须返回 `200`、Content-Type 一致并至少提供 24 小时公共缓存。只读后置校验会有限重试，PUT 不自动重试，避免网络结果不明时重复写入。

Student Voice 使用清单批量流程：

```bash
pnpm resources:feedback
pnpm r2:check
pnpm r2:preflight-feedback
pnpm r2:upload-feedback
pnpm r2:verify-feedback
```

批量上传会先检查完整清单，任何一项失败时不会开始写入。

## 写入能力验证

```bash
pnpm r2:verify-write
```

该命令先完成鉴权读，再向 `resources/_admin-test/` 写入唯一文本对象并验证公开读取。为遵守删除审批边界，工具不会自动删除验证对象；输出中的完整对象键应进入测试记录，只有用户明确批准该键后才能删除。

已有对象可以在不重新写入的情况下复核：

```bash
pnpm r2:verify-object -- \
  'resources/_admin-test/worker-uploader-....txt' \
  'text/plain; charset=utf-8'
```

## 缓存审计

```bash
pnpm r2:verify-cache
```

该命令只读取生成清单中的公共响应头，不需要写入权限。当前 Worker/公开域名统一返回 `Cache-Control: public, max-age=86400`；客户端上传器不发送无效的缓存指令，而是验证实际响应至少满足这一基线。若要延长缓存，必须修改 Worker 并为会更新的对象设计版本化键；禁止退回本地 S3 密钥直连。

## 故障判断

| 状态 | 含义 |
| --- | --- |
| `200` 管理 GET | Access Token、Policy、Worker 读取与 R2 binding 正常 |
| `201` PUT | Worker 接受上传 |
| `403` Cloudflare Access 页面 | Token 错误、过期、属于错误账户或未加入 Service Auth Policy |
| `404` | 认证通常已通过，但对象键不存在 |
| `413` | 文件超过 Worker 限制 |
| `5xx` | Worker 或 R2 binding 异常 |

上传前记录完整对象键；上传后验证公开 URL。删除操作不由仓库脚本提供，必须由用户明确指定单个完整对象键后按 Worker 运维流程执行。
