# METC 项目范围

METC（Maths and Engineering Teaching Club）是由学生运营的公益教育社团。官网是一个面向公众的成果展示站点，不是课程管理系统或内容后台。

## 已上线功能

| 页面 | 当前内容 |
| --- | --- |
| `/` | 社团介绍、课程/活动/Student Voice 入口、加入社群与联系弹窗 |
| `/teaching` | 课程书架、双语 syllabus、课件 PDF 与图片预览 |
| `/activities` | 学校相册、照片墙、灯箱与首页精选照片 |
| `/voices` | 经审核的 Student Voice 信封式浏览体验 |

内容由 `src/data/resources/generated/` 中的版本化清单驱动。当前清单包含 4 门课程、6 个活动相册和 7 条学生反馈；这些数量会随内容发布而更新，不应在组件中写死。

## 明确边界

- 不提供账号、登录、CMS、浏览器端上传、在线编辑或服务器端审核。
- Vercel 只部署静态站点；Cloudflare R2 提供课程、活动与 Student Voice 展示资源。
- 维护者通过受 Cloudflare Access 保护的 Worker 上传公开展示物；浏览器、GitHub 和 Vercel 不持有写入凭证。
- 所有学生材料须先完成授权、隐私和内容审核，再进入仓库或公开资源流程。

## 维护优先级

1. 持续补充已审核的课程、活动和 Student Voice 内容。
2. 在二维码过期前更新官方群二维码并完成手机扫码验证。
3. 保持一个规范的 Vercel 生产项目，生产分支为 `main`。
4. 每次内容或界面变更后完成预览验证、类型检查和静态构建。

操作见[资源运维](RESOURCE_OPERATIONS.md)和[Vercel 部署](DEPLOYMENT.md)。
