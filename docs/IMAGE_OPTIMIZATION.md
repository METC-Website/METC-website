# 图片优化与缓存

网站采用“上传前优化 + R2 直出”，不依赖 Next Image Server Optimization。

## 格式

- JPG/PNG 活动照片统一生成 WebP quality 80。
- Student Voice 统一生成 WebP quality 82、最长边 2400px，并清除原始元数据。
- HEIC 活动照片当前通过 macOS `sips` 生成 JPEG；后续可继续升级为 WebP。
- syllabus 内嵌图片保持转换器输出格式，由课程清单记录并在用户进入网站后后台加载。

## 缓存

当前 Worker 和公开域名为 R2 展示资源统一返回：

```text
Cache-Control: public, max-age=86400
```

这会让浏览器在一天内充分复用重复访问资源，同时允许固定 syllabus 路径在更新后于合理时间内生效。普通图片替换应生成新对象键或新 ID；Student Voice 可以覆盖稳定对象键，因为生成器会在 `imageSrc` 上更新基于 WebP 内容的版本参数。

每次资源发布后执行：

```bash
pnpm r2:verify-cache
```

如果历史对象缺少缓存头，先检查 Worker/公开域名响应策略，再重新运行公共 HEAD 验证。本地工具不发送或伪造 Cache-Control、不持有 R2 S3 密钥，也不直接修改 bucket 元数据。若要把资源缓存延长到一年，必须在 Worker 中按资源类型设计版本化键和响应策略后修改。应用外壳下的 `public/images` 由 Vercel 设置一天浏览器缓存和七天后台重新验证；带内容哈希的 Next.js 构建资源继续使用平台的长期不可变缓存。

## 页面加载

`components/resource-preloader.tsx` 在根布局挂载后使用会话级去重队列按当前路由分三级加载，最多三个后台并发请求：

1. 立即加载当前页面最可能使用的关键资源，例如首页首张精选照片、活动页首本相册封面、首份 syllabus 或首封反馈；
2. 当前页面完成首帧并空闲后，提高本页其余资源的队列优先级；
3. 以 Low 优先级 `fetch` 逐步预热其他页面资源，不创建 `Image` 或提前解码图片。

pathname 改变只调整既有队列优先级，不重建全站任务；`loaded`/`inFlight`/`queued` 集合保证同一会话不重复预热。开启系统省流量模式或处于 2G/slow-2G 网络时，只加载关键资源，不启动全站后台队列。正常网络仍会在进入网站后逐步缓存全站展示资源，重复访问由 R2 的 24 小时公共缓存直接复用。
