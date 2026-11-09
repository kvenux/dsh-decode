# Decode 使用细节

[English](usage.md) · **简体中文**

README 讲 Decode 为什么存在、怎么装。这里是完整的说明：读回答的每个部分、时间和 token、工具与安全、网页接口、开发。

## 安装（全部方式）

- 要求 dsh 0.2.1-rc.5 或更新（npm 的 latest、next 都可以）。0.1.x 不能用：它没有右侧面板。装 0.2.x 的其他预发布版（如 0.2.3-rc.1）时 npm 可能报 peer 警告：npm 的版本范围不把别的版本号的预发布版算进去；dsh 自己的兼容检查算，插件照常加载。
- 从 npm 装（预览版用 preview 标签）：`dsh plugin --profile web add dsh-decode@preview`
- 从本机目录装（改了 `src/client/` 要先 `npm run build`；之后刷新页面或重启 dsh web 就生效）：`dsh plugin --profile web add C:/path/to/dsh-decode`
- 从打包文件装：在本仓库运行 `npm pack`，然后 `dsh plugin --profile web add C:/path/to/dsh-decode-0.1.0-preview.1.tgz`
- `dsh plugin add` 会把插件加进 profile 的 bundles。用新的 profile 名时，dsh 只放 `@deepseek-ai/dsh-base`，要在 profile 的 `package.json` 里手动加 `@deepseek-ai/dsh-web-app`（放在插件前面）。
- 重启 dsh web。

## 读回答

- **卡片**：一句结论，然后是编号段落。每段下面标出有几处引文（模型抄的代码）；在文件里找不到原文时，标“N 处没有原文”。卡片顶部常驻一行说明：引文找到只说明代码存在，不代表结论已验证。
- **右侧面板**：图跟着你指向的段落移动。上面是标题、段落进度和当前段落，下面放图和文件，右上角切换三种布局：上下（默认）、左右、标签（图和文件分开看）。图按窗格大小整体缩放，整张可见；字要缩到原来的 0.78 倍以下才放得下时，改为占满宽度、窗格滚动。上下布局默认图要多高给多高（最多 80%），剩下的给文件；拖中间的分隔条可以调整，双击恢复。布局和比例记在浏览器里。时序图右上角有“时序 / 通信”切换：通信图用同一份数据，画谁和谁通信，消息按编号排在连线上。
  - “涉及的文件”：可以切换“目录树”和“地图”两种视图。目录树视图从上到下：
    - 一行数字：读了几个文件、引用几个、本段几处引文；仓库里有未提交的文件时，再写“仓库 N 个未提交”和总的 +增 −删 行数（整个仓库的，和这个回答无关）。下面一行是颜色说明。卡片顶部只写“引用 N 个文件”，“读了”只在这里出现。
    - “查找文件”在最上面（见下）。“引用的文件”平铺清单：默认列本段引用的文件，可切到“整个回答”（每行带“第 N 段”链接，最多 4 个，多的写 +N；点了跳到那段）；超过 6 个折叠。文件名完整显示，目录先缩短。本段文件那一行右边写着引用的行段，点它代码在下面展开；悬停出现追问、复制、打开。引用的文件有未提交改动时，行尾写 +增 −删 和“未提交”：引文是从工作区读的，可能和提交的版本不同。
    - “查找文件”：输入文件名或路径的几个字母（按顺序出现即可，如 `cwuml`），结果替换下面的目录树，Esc 清空。
    - “全部文件”目录树：把用到的文件放回仓库的目录里，目录旁写它负责什么；树里放回答用到的全部文件（橙=本段，蓝=引用，引用的行有浅底色；浅蓝=只读过、没引用），目录右边的数字是下面被引用的文件数。点树里的文件在编辑器里打开（看代码在上面的清单里点）。“全部收起”收起所有目录，再点展开引用所在的目录。
  - 有未提交改动的文件，文件名后标 git 状态字母：M 改过、A 新加、D 删了（每次提问和打开回答时重新读 `git status`，不含未跟踪文件）；里面有改动的目录标一个紫点，收起时也看得到。文件图标按类型显示（vscode-icons，MIT），目录图标用图里地点的颜色。最上面两层的目录全部列出（没用到的灰色、收起），读者看到仓库的布局；其余没用到的目录和文件收在“…”里，点开像文件管理器一样逐层浏览。选“地图”时，本段的证据仍单独显示在图下面。“地图”是整个仓库的矩形图。
- **追问**：段落上的“追问这段”把这段引用到输入框；证据上的“追问”把 `@路径 第 s–e 行：` 填进输入框。两者都不会自动发送。
- **查证时**：面板用同样的目录树实时显示读过的文件，文件名颜色：橙=正在看，蓝=读过；有未提交改动的同样标 M/A/D。

适合问的问题：跨多个模块的流程、状态变化、改动影响、几种做法的对照、进程和部署。只查一处代码时，用普通模式更快。

## 时间和 token（实测）

- 每题通常 1.5–4 分钟（DeepSeek-V4.1-Flash，推理 high），约是标准模式的 1.9 倍。多出的时间主要用在组织段落和图上。查证超过 3 分钟时，插件让模型用已有证据收尾，卡片上会标出来。
- 每题输入约 0.4M–2M token（会话页脚显示，九成以上命中缓存），输出约 2–3.5 万 token（推理 max 时测得）。

## 工具与安全

- 这个模式给模型 read、grep、glob 和本机的终端（Windows 上是 PowerShell，其他系统是 bash）。文件的写和编辑工具没有给，回答问题用不到；终端命令不另加限制，按 dsh 自己的权限设置执行。模型会读仓库里的文件，不可信的仓库可能借文件内容让模型运行命令：问陌生仓库时，用 dsh 的权限设置让终端命令先问你。
- 和标准模式一样，每次提问都把工作区的 `AGENTS.md` 等说明文件放进模型的上下文（dsh 的 `agent-instructions` 插件，最多 64 KB）：仓库自己写的架构说明能让回答更完整、查证更快。这些文件是仓库作者写的，模型会把它们当作说明来读：不可信的仓库同样可能借它们让模型运行命令，处理办法同上。
- 通过终端读的文件不会出现在查证时的文件树上（只统计 read）。
- 插件自己运行的命令都是 git（按 PATH 里的绝对目录找到 `git.exe`/`git` 的完整路径，不用当前目录里的；找不到就不运行），不写工作区、提交和 index，异步运行（不卡 dsh），每条最多 15 秒：`git ls-files -z`（目录树和地图的文件列表、证据路径的解析）；`git status --porcelain=v1 -z --no-renames --untracked-files=no --ignore-submodules=all` 和 `git diff-index HEAD --no-ext-diff --no-textconv --ignore-submodules=all --numstat -z --no-renames`（未提交的文件和它们的增删行数）；`git config -z --get-regexp ^filter\.`（找出仓库配置里的 filter）。除读 filter 配置那条外，每条都加 `--no-optional-locks`、`-c core.fsmonitor=false` 和 `-c core.hooksPath=<插件启动时建的私有空目录>`（仓库的 hook 不运行；建不出这个目录就不运行 git）；status 和 diff 还把仓库配置里每个 filter 的命令置空，读不到配置时就不运行；子模块不看（它有自己的配置）。读文件：右侧代码只读已跟踪文件，引文校验也读工作区里未跟踪的文件（新文件也能引用），都不读 `.git` 目录、不读链接到仓库外的文件，最大 4 MB。
- 插件加的网页接口（只读，只接受本机 git 仓库的绝对路径；以 `\\` 或 `//` 开头的路径一律拒绝，包括网络路径 `\\host\share` 和 `\\?\` 形式）。每个接口先过 dsh 的连接检查：别的网站来的请求（含 DNS rebinding）返回 403，没有登录 token 的返回 401，和 dsh 自己的接口一样。登录后的用户能读本机任何 git 仓库里的已跟踪文件，这和模型本来就能用的读文件工具相同：
  - `GET /dsh-decode/inventory?root=<仓库>`：仓库的文件列表，一分钟内再问用上次的结果（空列表不留）。
  - `GET /dsh-decode/source?root=&file=&start=&end=`：一个已跟踪文件的若干行，最多约 40 行。
  - `GET /dsh-decode/changes?root=<仓库>`：未提交的已跟踪文件（M/A/D）和增删行数。
- 插件不上传任何内容。模型调用走 dsh 里已配置的服务。

## 开发

插件运行时用到 dsh 的两个包：`@deepseek-ai/dsh-tools`、`@deepseek-ai/dsh-llm`。它们必须写在 `peerDependencies` 里，dsh 才会把它们交给插件（profile 不自动安装 peer）。漏写时插件的 agent 起不来，模式菜单里不出现 Decode，也没有报错。

| 命令 | 做什么 |
|---|---|
| `npm run build` | 生成 `lib/client.js`（cw-uml + `src/client/icon-svgs.js` + `icons.js` + `files.js` + `app.js`）。改了 `src/client/` 或 `vendor/` 后运行，然后刷新 dsh 页面。改了 `src/agent.js`、`check.js`、`prompt.js`、`web.js` 要重启 dsh web。 |
| `npm test` | 单元测试（node:test）：答案校验、文件分组、构建产物、提示词。2 条 todo 是已知的证据误报。 |
| `npm run test:render` | 在无头 Chromium 里按面板尺寸画 `tests/fixtures/answers.json` 里每个回答的每张图、每一段，统计文字溢出、截断、断词、重叠、当前步骤不在可见区域。与 `tests/render-baseline.json` 比，数量变多就失败；修好后用 `-- --update` 写入新基线。 |
| `npm run shots -- <url> <list> <out> [--ask] [--live]` | 在真实 dsh web 里打开已存的会话并截图，不提问、不花 token。`--ask` 检查追问和复制，`--live` 检查查证时的面板。 |

浏览器测试需要 playwright：设置 `RC_PLAYWRIGHT`（一个 node_modules 里有 playwright 的目录）和 `RC_CHROME`（Chromium 可执行文件），或者在本仓库安装 playwright。

`bench/` 里是真实提问的评测（`rc-dsh.mjs`，花 token）、Opus 盲评（`judge.mjs`）和一次早期评审（`review-2026-11-04.md`）。`bench/out/` 不进 git（里面有浏览器配置）。

## 代码

| 文件 | 内容 |
|---|---|
| `cordis.patch.yml` | 模式定义：工具、提示词插件、网页接口 |
| `src/agent.js` | 模式里的智能体插件：提示词、`submit_answer` 工具、记录读过的行、3 分钟收尾提示 |
| `src/check.js` | 答案校验和修复：图能不能画、证据按内容核对、语言和代码名检查 |
| `src/prompt.js` | 提示词 |
| `src/web.js` | 网页接口 |
| `src/client/app.js`、`files.js` | 浏览器端：卡片、面板、查证时的面板、目录树 |
| `src/client/icons.js`、`icon-svgs.js` | 文件图标：按文件名和扩展名选 vscode-icons（MIT）；`icon-svgs.js` 由 `node scripts/icons.mjs <icon-svgs.ts 或 icons.json>` 生成 |
| `vendor/cw-uml.*` | 交互图库（从 codewiki-next 复制，同一作者，MIT）。图里的 class 名只取字母、数字、`_`、`-`：spec 来自模型，是数据 |
| `THIRD_PARTY_NOTICES.md` | 第三方材料：vscode-icons、claude-files-pane（MIT） |

## 已知限制

- “引文”只说明模型抄的代码在文件里找到了，不说明它支持这段话。文档也算在内。存疑的有三种：没找到原文、推断（没抄代码）、没有这个文件。
- 引文由不相邻的几行组成、或被模型重新换行时，会误报“未核实”（见 `tests/check.test.js` 的 todo）。
- 回答不记录仓库的提交号；不能带着 diff 或报错提问。
