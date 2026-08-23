# 公开资源维护规范

公开展示资源统一发布到 Cloudflare R2；仓库仅保存生成索引。当前没有 CMS 或网页上传后台，资源维护在受控本地环境完成。

## 分类

| 资源 | 私有输入目录 | R2 公开展示目录 |
| --- | --- | --- |
| Word syllabus | `课程设计/<课程>/source/` | `课程设计/<课程>/demonstration/syllabus.*` |
| PPT/PDF 课件 | 同上 | `课程设计/<课程>/demonstration/lesson*/` |
| 活动照片 | `活动成果展览/<学校>/` | `活动成果展览/<学校>/demonstration/` |
| Student Voice | `听ta们说/source/` | `听ta们说/demonstration/` |

以上路径均位于 `METC_RESOURCE_ROOT`。原始办公文件、未审核照片和敏感素材不得上传到 R2 公共展示目录。

## 更新规则

1. 完成授权、隐私和内容审核。
2. 将原始文件放入私有输入目录并维护配置 JSON。
3. 运行对应生成脚本，检查 WebP/HTML/PNG 等展示物。
4. 运行 Worker 上传器预检；全部对象通过后才允许上传。
5. 通过 `upload.sciemetc.com` Worker 上传，再通过 `assets.sciemetc.com` 公共 URL 校验。
6. 执行 `pnpm r2:verify-cache`，确认清单中的公开对象至少返回 24 小时公共缓存。缓存策略由 Worker/公开域名统一控制；本地工具不再直连 R2 修改 bucket 或对象元数据。
7. 提交 `src/data/resources/generated/*.json`。
8. 在 Vercel Preview 中检查页面后再合并 `main`。

前端不依赖交互或视口进入才开始下载图片。当前页面关键资源立即加载；其余 URL 只加入一次会话级队列，在首帧空闲后由最多 3 个低优先级 `fetch` 预热 HTTP 缓存，不提前解码图片。pathname 改变只更新既有任务的优先级，不重建全站队列；详见 [分级加载与缓存](RESOURCE_LOADING_AND_CACHE.md)。

活动相册通过 `album.config.json` 选择 `coverPhoto` 和 `homepageFeaturePhoto`。Student Voice 使用 `feedback.config.json`，必须设置 `approvedForPublicUse: true`。

## 禁止事项

- 不将真实内容新增到 `public/images` 或 `public/resources`。
- 不创建或分发 R2 S3 Access Key；上传只使用个人 Cloudflare Access Service Token。
- 不将 Access Client Secret、未审核源文件或私有目录提交到 Git、日志或 Vercel。
- 不直接手改 `demonstration/` 或生成索引。
- 不在 R2 上传后遗漏 Content-Type、既定公共缓存头和公共访问验证。
