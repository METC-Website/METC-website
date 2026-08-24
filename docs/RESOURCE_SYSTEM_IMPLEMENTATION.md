# 资源系统实施记录

## 已完成

- 将教学材料和活动成果整理为 `resources/METC/课程设计` 与 `resources/METC/活动成果展览`；原 DOCX、PPTX、PDF、照片、HEIC 和视频作为内容资产保留。
- 建立微观经济、宏观经济、物理-光、自由主题四门课程；课程可含中英文 DOCX 大纲与 PPT/PDF 课件。
- `/teaching` 使用书架和开书交互展示课程；左页显示课程信息与安全清理后的 DOCX HTML，右页显示真实课件列表。
- 课件被转为 PDF 和 slide PNG；浏览器支持缩略图、键盘翻页、关闭与原生全屏，不嵌入原始 PPTX。
- `/activities` 使用生成的学校相册索引，提供照片墙与灯箱。图片不再依赖懒加载或打开相册后才请求，而是由路由分级预加载器在进入网站后后台加载；HEIC 保留原文件，并在本地 macOS 生成 JPEG 展示副本。
- 建立资源脚本、前端索引和资源操作文档。
- Student Voice 已纳入同一 R2 公开展示目录模型：7 张已授权原图生成 7 张无 EXIF WebP 与 7 条 `feedbacks.json`，通过受 Cloudflare Access 保护的 Worker 上传并校验；页面不保留 Demo 回退。
- 本地上传器不再持有 R2 S3 密钥；它在写入前检查凭证文件权限、对象键、`source` 路径、100 MB 限制、MIME 和 Worker 读取权限，写入后验证管理域名与公共域名。
- 根布局会在用户进入网站后通过会话级去重队列后台预取活动照片、Student Voice 图片和 syllabus 内嵌图片；pathname 切换只提升目标页资源，不重复创建全站任务，后台预热不会提前解码图片。
- Vercel 是唯一部署目标；GitHub Pages 工作流已移除。

## 明确保留的边界

首页、Logo 与导航仍属于应用外壳。课程、活动和正式 Student Voice 内容均由生成索引接入 R2；已授权源文件版本化保存在 `public/resources/METC`，未审核源文件留在项目方私有素材存储中。

## 验证基线

资源系统首次交付时，已验证 DOCX 转换、PPT/PDF 转图片、课程与相册索引生成、TypeScript 检查、静态构建，以及课程/相册的浏览器交互。2026-08-23 的加载回归在连续访问活动页、课程页和 Student Voice 后记录到 101 次 R2 请求、101 个唯一 URL、0 次重复，后台最大并发为 3；Student Voice 动画在页面隐藏和路由切换状态下全部暂停。

后续资源或调度改动必须重新运行 `pnpm r2:verify-cache`、`pnpm typecheck`、`pnpm build` 和真实浏览器跨路由测试，不应将上述历史结果视为替代测试。
