# 本地开发

## 前置条件

- Node.js 24.x
- Corepack（用于启用项目固定的 pnpm 10.33.0）
- Git
- 仅在更新课程或图片资源时需要 Python 3、Pillow、LibreOffice、Poppler；HEIC 转换还需要 macOS `sips`

仓库当前为公开仓库。可使用 HTTPS 或已配置的 SSH 地址克隆。

```bash
git clone --filter=blob:none --sparse https://github.com/METC-Website/METC-website.git
cd METC-website
git sparse-checkout set app components content data docs lib public/images src tools
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

打开 `http://localhost:3000`。开发服务支持热更新；停止服务使用 `Ctrl+C`。

## 日常检查

```bash
pnpm typecheck
pnpm build
```

静态导出会生成 `out/`，它是构建产物，不应提交。Next.js 可能更新已跟踪的 `next-env.d.ts`；若并非框架升级，请在提交前恢复由本地运行产生的差异。

## 稀疏检出与资源

`public/resources/` 是大体积、经授权的资源树，稀疏检出默认不下载它。运行网站只需要生成清单和 R2；更新资源时再显式检出该目录：

```bash
git sparse-checkout add public/resources
```

上传凭证只放在被 Git 忽略的 `.env.worker.local`，建议将其链接到仓库外、权限为 `600` 的文件。不要把 Cloudflare Access Client Secret 配置到 Vercel、提交到 Git 或复制到日志。

## 协作

在功能分支完成改动、通过检查和预览后，再经审查合并到 `main`。提交前只暂存本次有意修改的文件。
