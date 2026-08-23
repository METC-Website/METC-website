# 资源分级加载与浏览器缓存

网站已经移除图片与 syllabus 的懒加载/交互后加载。资源不会等到进入视口、打开相册、拆开信封或展开 syllabus 才开始下载；根布局中的 `ResourcePreloader` 会在用户进入任意页面后按当前路由优先级启动加载。

## 三层加载顺序

`src/data/resources/preload.ts` 将资源分为：

1. `critical`：当前页面最可能立即使用的资源，立即以 High 优先级请求；
2. `page`：当前页面其余资源，在目标页面完成两个首帧并进入空闲期后提升为页面优先级；
3. `background`：其他页面资源，在首次首帧与空闲期之后以 Low 优先级逐步预热。

| 路由 | critical | page |
| --- | --- | --- |
| `/` | 首页首张精选照片 | 其余首页精选照片 |
| `/activities` | 首个相册的 4 张封面图 | 其余活动照片 |
| `/teaching` | 首份 syllabus HTML | 其余 syllabus HTML 与内嵌图片 |
| `/voices` | 首封反馈图片 | 其余反馈图片 |

## 会话级调度与去重

`ResourcePreloader` 在单个浏览器页面会话中维护模块级 `loadedResources`、`inFlightResources` 和 `queuedResources`：

- 已加载、正在加载或已经排队的 URL 不会再次进入队列；页面直接渲染的 `<img>` 请求也会被调度器接管。
- 全站资源清单只加入一次。pathname 改变时不重建队列，只把旧的待处理页面资源降为后台优先级，并提升新路由的 `critical`/`page` 项。
- 最多同时执行 3 个后台请求。图片和 syllabus 都通过 `fetch(..., { cache: "force-cache", mode: "no-cors", priority })` 预热 HTTP 缓存，不创建脱离 DOM 的 `Image`，因此不会提前解码所有图片。
- 路由切换时暂停启动非关键任务；目标页面完成两个 `requestAnimationFrame` 且进入 `requestIdleCallback` 后恢复。浏览器不支持 idle callback 时使用短延时回退。
- 页面隐藏时暂停启动后台任务；恢复可见后继续原队列，不重新创建任务。

## 网络保护

当浏览器开启 `Save-Data`，或网络类型为 `2g/slow-2g` 时，只请求当前路由关键资源，不启动全站后台队列。这是明确的流量保护边界；正常网络会继续加载当前页与跨页面资源。

## 路由过渡与动画预算

- 首页入口按钮立即执行客户端路由，不再人为等待 340ms。
- 活动页与 Student Voice 的目标页入场遮罩只保留 180ms，并在 220ms 后移除，不再叠加 520/760ms 等待。
- Student Voice 使用静态全屏渐变，并减少装饰星星、雨雪和流星数量。页面隐藏或带有 `route-transitioning` 状态时，页面动画全部暂停。

## 组件约束

- 图片使用真实 `src`，不得新增 `loading="lazy"`、`data-src` 或基于 `IntersectionObserver` 的资源注入。
- syllabus iframe 使用 `loading="eager"`；HTML 也由预加载器提前 `fetch(..., { cache: "force-cache" })`。
- `IntersectionObserver` 只可用于视觉动画、可见性或轮播控制，不得阻止资源进入后台队列。
- 正式 Student Voice 图片全部来自清单；照片数量、清单条数和信封数量必须一致。

## 缓存策略

- R2/Worker 展示资源：`Cache-Control: public, max-age=86400`。
- Vercel `public/images` 应用外壳：一天浏览器缓存、七天 `stale-while-revalidate`。
- 带内容哈希的 Next.js 构建资源由 Vercel 使用长期不可变缓存。
- Student Voice 同名对象由生成器在 `imageSrc` 附加内容哈希版本参数；其他公开图片替换应使用新 ID/对象键，避免一天缓存窗口内看到旧对象。

发布后运行：

```bash
pnpm r2:verify-cache
pnpm typecheck
pnpm build
```

真实浏览器验收应记录 R2 请求状态、High/Low 优先级、最大后台并发、URL 去重和重复访问的缓存复用；不能只以构建成功代替加载验证。2026-08-23 的 production 回归中，连续经过活动页、课程页和 Student Voice 后为 101 次 R2 请求、101 个唯一 URL、0 个重复 URL，后台最大并发为 3。
