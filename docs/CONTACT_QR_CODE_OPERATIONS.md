# METC 微信群二维码运维

二维码入口已在前端预留，但当前尚未启用。该文件面向仓库和部署负责人，不会由网站公开链接。

## 上线步骤

1. 从官方、仍有效的 METC 微信群入口导出方形 PNG。
2. 由社团负责人确认二维码可公开、有效期及更换责任人；不将群成员截图或后台页面放入仓库。
3. 将图片放到 `public/images/contact/wechat-join-qr.png`。文件名必须完全一致，建议至少 600 × 600 px、无多余边框或说明文字。
4. 将 `components/homepage/community-actions.tsx` 中的 `JOIN_QR_CODE_IS_CONFIGURED` 从 `false` 改为 `true`。
5. 运行 `pnpm build`，在导出站中测试二维码是否清晰、弹窗是否出现，并确认生产路径为 `/images/contact/wechat-join-qr.png`。
6. 部署后使用手机实际扫码；二维码失效、满员或群链接变更时，立即替换图片并重新发布。

加入社团弹窗只读取本地公开静态图片，没有上传流程、后端 API 或把操作路径暴露给访客的机制。二维码在本仓库中是公开内容，不应包含仅面向内部的邀请信息。
