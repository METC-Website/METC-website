# 资源加载与缓存

## 资源格式与缓存

网站采用“上传前优化 + R2 直出”，不依赖 Next Image Server Optimization。

- 活动图片优先使用 WebP；HEIC 在本地转换为可展示格式。
- Student Voice 输出 WebP quality 82、最长边 2400px，并移除原始元数据。
- R2 展示资源的基线响应头为 `Cache-Control: public, max-age=86400`。
- Student Voice 通过内容哈希版本参数更新同名对象；其他会替换的资源应使用新对象键或 ID。
- `public/images` 是随 Vercel 发布的站点外壳资源；Next 构建资源由平台使用长期不可变缓存。

每次资源发布后运行：

```bash
pnpm r2:verify-cache
```

## 会话级预热

根布局中的 `ResourcePreloader` 根据 `src/data/resources/preload.ts` 将资源分为三层：

| 层级 | 行为 |
| --- | --- |
| `critical` | 当前路由最可能立即使用的资源，优先请求 |
| `page` | 首帧完成并进入空闲期后加载当前页其余资源 |
| `background` | 低优先级逐步预热其他路由资源 |

单一页面会话内，已完成、进行中和排队中的 URL 会被去重；最多并发 3 个后台请求。路由变化只提升目标路由的优先级，不重建全站队列，也不会预先解码所有图片。

启用 Save-Data、`2g` 或 `slow-2g` 网络时，只加载当前路由关键资源，不执行全站后台预热。页面隐藏或路由过渡期间不启动非关键任务。

## 验收

资源或加载策略调整后，在真实浏览器连续访问 `/`、`/teaching`、`/activities`、`/voices`：确认代表性 R2 URL 可访问、同一 URL 不被重复预热、后台并发不超过 3，并检查弱网/省流量模式下只加载关键资源。
