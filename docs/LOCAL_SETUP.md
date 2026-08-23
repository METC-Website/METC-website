# 本地开发环境搭建（Sparse Clone）

本文记录如何把 METC 网站仓库以「精简 / 稀疏」方式克隆到本地并跑起来，适合新成员或换电脑时快速起步。

> 适用仓库：`git@github.com:METC-Website/METC-website.git`（私有仓库，需要 GitHub SSH 密钥与访问权限）

---

## 0. 前置条件

| 工具 | 用途 | 安装方式 |
| --- | --- | --- |
| `git` | 克隆仓库 | 系统自带或 `brew install git` |
| `Node.js` | 提供 `npm` | 推荐用 `nvm` 安装（见下） |
| `pnpm` | 安装依赖 / 启动开发服务器 | `npm install -g pnpm` |
| GitHub SSH 密钥 | 通过 `git@github.com` 地址克隆 | 在 GitHub 配置 SSH key |

### 安装 Node.js（用 nvm，推荐）

```bash
# 1. 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 2. 在当前终端加载 nvm（不重启 shell）
\. "$HOME/.nvm/nvm.sh"

# 3. 安装 Node.js 24
nvm install 24

# 4. 验证
node -v   # 应打印 v24.x.x
npm -v    # 应打印 11.x.x
```

> nvm 安装时会自动把加载命令写进 `~/.zprofile`，以后新开终端可直接用 `node` / `npm`。
> 若当前窗口找不到 `node`，重新执行一次 `\. "$HOME/.nvm/nvm.sh"` 即可。

### 安装 pnpm

```bash
npm install -g pnpm
pnpm -v   # 应打印版本号（如 10.x.x）
```

---

## 1. 稀疏克隆仓库（Sparse Clone）

只拉取运行网站真正需要的目录，速度快、占空间小。

```bash
# 跳过 LFS 大文件实际内容 + 浅克隆 + 稀疏下载，克隆到 METC-website-clean
GIT_LFS_SKIP_SMUDGE=1 git clone \
  --depth=1 \
  --filter=blob:none \
  --sparse \
  git@github.com:METC-Website/METC-website.git \
  METC-website-clean

cd METC-website-clean

# 只真正检出以下子目录（其余部分不下载）
git sparse-checkout set \
  app \
  components \
  content \
  data \
  docs \
  lib \
  src \
  tools \
  public/images
```

各参数含义：

- `GIT_LFS_SKIP_SMUDGE=1`：跳过 LFS 超大文件的实际内容，先不下载。
- `--depth=1`：只拉最近一次提交，不要完整历史。
- `--filter=blob:none`：先不下载文件内容，用到再取。
- `--sparse`：开启稀疏下载，配合 `sparse-checkout set` 只拉指定目录。

> 首次 `git clone` 后只会看到顶层少量文件，这是正常的；执行完 `sparse-checkout set` 后列出的目录才被真正拉下来。

---

## 2. 安装依赖

```bash
pnpm install
```

首次安装可能需要 1～3 分钟（会下载 `next` / `react` / `swc` 等）。看到 `Done in ...` 即完成。

---

## 3. 启动开发服务器

```bash
pnpm dev
```

启动成功后终端会一直停住（这是正常的，不是卡死），并出现类似：

```
▲ Next.js 16.x.x (Turbopack)
- Local:         http://localhost:3000
- Network:       http://172.16.x.x:3000
✓ Ready in xxxms
```

在浏览器打开 **http://localhost:3000** 即可查看网站。

- 想停止服务：在终端按 `Ctrl+C`。
- 改完代码保存后页面**自动热更新**，无需重启。
- 首次启动会提示 Next.js 匿名遥测（telemetry），非错误；如需关闭：`npx next telemetry disable`。

常用静态检查：

```bash
pnpm typecheck
pnpm build
```

加载策略改动还需用真实浏览器连续访问 `/`、`/teaching`、`/activities` 和 `/voices`：同一 R2 URL 在一个页面会话中不得重复预热，后台并发上限为 3，非当前页资源应在首帧空闲后才开始。仅通过构建不能替代这项验证。

---

## 4. 关于资源文件（resources）与 R2

公开图片、syllabus 和课件从 Cloudflare R2 加载。本地只需要仓库内的生成索引即可预览现有内容。

更新资源时，在受控私有目录准备 `resources/METC`，并设置：

```bash
export METC_RESOURCE_ROOT=/absolute/path/to/resources/METC
```

生成展示物后先上传并验证 R2，再提交生成索引。不要创建 `public/resources` 软链接，也不要把私有源文件提交到仓库。详见 `docs/RESOURCE_SYSTEM_ARCHITECTURE.md`。

需要上传权限的维护者从 `.env.example` 了解字段，但不得复制真实值进 Git。将个人 Access Service Token 保存在仓库外权限为 `600` 的文件，再创建被 Git 忽略的本地入口：

```bash
ln -s /absolute/path/to/protected/worker.env .env.worker.local
pnpm r2:check
```

本地文件只包含 `CF_ACCESS_CLIENT_ID`、`CF_ACCESS_CLIENT_SECRET`、Worker/公开域名和可选的 `METC_RESOURCE_ROOT`。不得把上传凭证配置到 Vercel。

---

## 5. 提交改动的工作流约定

本项目约定：**任何改动先在新建分支上完成，再合并回 `main`**，不要直接在 `main` 上提交。

```bash
# 1. 基于最新 main 开新分支
git checkout main
git pull
git checkout -b <type>/<short-description>   # 如 docs/local-setup-sparse-clone

# 2. 改动、提交（只 add 自己改的文件，避免误带本地产物）
git add <你改的文件>
git commit -m "清晰描述本次改动"

# 3. 合并回 main
git checkout main
git merge <type>/<short-description>
git push
```

> 注意：`next-env.d.ts` 已由仓库跟踪，但 Next.js 的开发/构建命令可能临时改变其中的生成路径。除非本次任务有意更新 Next.js 类型入口，否则提交前应与 `HEAD` 对照并恢复测试产生的差异。
