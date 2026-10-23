# cursor-i18n-zh

Cursor IDE 界面一键汉化工具 — 将 Cursor 专有英文界面替换为简体中文。

> 非官方工具，与 Cursor 团队无关。修改的是本地安装包，请自行评估风险。

## 功能覆盖

| 区域 | 说明 |
|------|------|
| **Cursor Settings** | General、Account、Appearance、Plan & Usage、Agents、Worktree、Tools & MCP、Hooks 等 |
| **Glass 主页** | New Agent、Automations、Plan New Idea 等 |
| **Automations** | 自动化列表、模板、触发器、MCP 等 |
| **Appearance** | 主题、颜色、字体排版、工具调用密度 |
| **Agent 聊天** | 常用操作按钮与提示文案 |
| **VS Code 基础 UI** | 通过中文语言包汉化 File / Edit / 命令面板等 |

## 环境要求

- **Node.js** ≥ 18
- **Cursor IDE**（macOS / Windows / Linux）
- macOS 修改 `/Applications/Cursor.app` 可能需要管理员权限

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/baishi1114010/cursor-i18n-zh.git
cd cursor-i18n-zh

# 无需 npm install（零依赖）

# 1. 完全退出 Cursor（macOS: Cmd+Q）

# 2. 一键汉化
node index.js localize

# 3. 重启 Cursor
```

## 命令说明

| 命令 | 作用 |
|------|------|
| `node index.js localize` | 一键汉化（含 VS Code 语言包配置） |
| `node index.js restore` | 恢复英文原版 |
| `node index.js status` | 查看汉化状态与 Cursor 版本 |
| `node index.js locale` | 仅配置 VS Code 中文语言包 |
| `npm run audit` | 自检优先词条覆盖率（固定 171 条清单，防回归） |
| `npm run probe` | 反向探测遗漏：动态挖出 bundle 里未被命中的英文文案 |
| `npm run fkeys` | 扫描「绝不能翻译」的功能位字符串（防启动卡死） |
| `node index.js help` | 显示帮助 |

也可使用 npm scripts：

```bash
npm run localize
npm run restore
npm run status
npm run audit
npm run probe
npm run fkeys
```

### 为什么有些英文故意不翻译：`src/functional-keys.json`

Cursor 的 bundle 里有相当一部分英文字符串**不用于显示**，而是参与运行逻辑。把它们翻成
中文会让程序按中文去查英文表，直接崩在启动阶段（3.27.6 就发生过：启动后进程挂着、
永远不出窗口）。

两类高危字符串：

1. **比较/分支用**：`case "X"`、`x === "X"`、`list.includes("X")`、`.name === "X"` 等；
2. **名字构件表**：如主题语义 token 的图像素表
   `{red:"Red", added:"Added", modified:"Modified", removed:"Removed", ...}`，
   这些值会被拼进 token 名（`bg` + `Git` + `Added` + `PrimaryHover` = `bgGitAddedPrimaryHover`）。
   一旦 `"Added"` 变成 `"已添加"`，运行时拼出 `bgGit已添加PrimaryHover`，
   按英文名查表查不到 → 抛 `cursor semantic: missing ref` → workbench 引导中断。

因此 `src/dict.js` 在合并完所有词典后会执行：

```js
for (const k of require('./functional-keys.json')) delete safeGlobalDict[k];
```

清单由 `npm run fkeys` 扫描原版备份生成（默认只预览，加 `--write` 才写入）。

> ⚠️ **Cursor 大版本更新后**：先 `npm run fkeys` 看清单是否有新增，写入后必须验证
> ① 能正常启动出窗口 ② `npm run audit` 遗漏为 0。


### `npm run probe` 反向探测

`audit.js` 只查一份固定清单，发现不了 Cursor 新版本带来的全新文案；`probe.js` 反过来从产物里挖：

1. 抓出三个 bundle 的全部字符串字面量；
2. 跑一遍 `translateContent()` 得到「模拟汉化结果」；
3. 用集合差集判断哪些英文原样存活 = 字典里没有 = 遗漏。

因此未汉化状态也能直接跑，不需要先 localize。

```bash
npm run probe                # A 级：UI 属性位 / JSX 文本位，误报极少
npm run probe -- --deep      # 附加 B 级：句法像文案，需人工甄别
npm run probe -- --new-only  # 剔除字典已有键，只报真正要新增的词条
npm run probe -- --json      # 输出 JSON 清单，便于批量处理
```

Cursor 每次自动更新后，先 `npm run probe -- --new-only` 看有没有新文案，补进 `src/dict-*.js` 再 `npm run localize`。

## 工作原理

```
┌─────────────────────────────────────────────────────────┐
│                    cursor-i18n-zh                        │
├─────────────────────────────────────────────────────────┤
│  1. 检测 Cursor 安装路径与版本                           │
│  2. 配置 VS Code 中文语言包（locale.json）               │
│  3. 备份原始文件 → ~/.cursor-i18n-zh/backups/<版本>/     │
│  4. 按字典对 JS 打包文件做安全字符串替换                 │
│  5. 修复 product.json 完整性校验 Hash                    │
│  6. macOS: 清除隔离属性 + 本地重签名                     │
└─────────────────────────────────────────────────────────┘
```

### 汉化的目标文件

| 文件 | 内容 |
|------|------|
| `workbench.desktop.main.js` | Settings、Agent 聊天等 |
| `workbench.glass.main.js` | Glass 主页、Appearance 等 |
| `workbench.anysphere-ui-automations.js` | Automations 页面 |
| `product.json` | 校验 Hash 修复 |

### 翻译引擎

字典分三类，避免误替换导致白屏：

1. **安全长句**（`dict.js` 等）：在引号内全局替换，如 `"Privacy Mode"` → `"隐私模式"`
2. **危险短词**（`riskyShortWords`）：仅在 `label:`、`description:` 等 UI 属性中替换
3. **特殊规则**（`tricky.js`、`settings-nav.js`）：三元表达式、Settings 导航映射等

### 备份机制

- 备份存放在用户目录，**不在** `.app` 包内（避免 macOS EPERM）
- 路径：`~/.cursor-i18n-zh/backups/<Cursor版本>/`
- 状态记录：`~/.cursor-i18n-zh/state.json`

## 项目结构

```
cursor-i18n-zh/
├── index.js                 # CLI 入口
├── package.json
├── scripts/
│   ├── audit.js             # 覆盖率自检（固定清单，防回归）
│   └── probe.js             # 反向探测遗漏（动态扫描，发现新文案）
└── src/
    ├── platform.js          # 路径检测、提权、运行状态
    ├── backup.js            # 外部目录备份/还原
    ├── hash.js              # product.json 校验修复
    ├── translate.js         # 核心翻译引擎
    ├── locale.js            # VS Code 语言包配置
    ├── tricky.js            # 特殊格式正则替换
    ├── settings-nav.js      # Settings 侧栏导航映射
    ├── dict.js              # 主翻译字典
    ├── dict-326.js          # Cursor 3.26.x 新增词条字典
    ├── dict-automations.js  # Automations 专用字典
    ├── dict-appearance.js   # Appearance 专用字典
    └── dict-settings-pages.js # Settings 七大页面补全字典
```

## 更新日志

### v1.3.0（2026-08-23）

根据 Cursor 3.17 Settings 截图补全遗漏词条：

- 侧栏：代码智能（Code Intelligence）
- 通用：Customize 迁移横幅、启动、窗口还原、完成提示音
- 账号：邮箱/头像/姓名/链接与公开资料说明
- 外观：智能体对话、高对比度、彩带炮
- 套餐：用量重置与「还剩 N 天」模板、其他模型用量
- 智能体：对话分区、默认环境/模型、队列与语音关键词、第三方导入
- 模型 / 浏览器：选择器说明、本地与网页链接标题

详见 `docs/UPDATE-v1.3.0.md`。

### v1.2.0（2026-07-26）

根据 Cursor 3.13 Settings 截图补全遗漏词条：

- 侧栏：Git 与拉取请求、浏览器与网络
- 套餐：调整套餐、其他模型、用量重置模板、已使用
- 智能体：白名单选项、终端与编辑、自动审查、LSP 全套
- 工作树：Max Worktrees 等 Title Case 标签
- 模型：任务模型、Explore 子智能体模型、查看全部模型、API 密钥
- Git：分支、分支前缀
- 规则：包含第三方插件/技能配置、显示全部
- 索引：Ignore Files 新文案

详见 `docs/UPDATE-v1.2.0.md`。

### v1.1.0（2026-07-10）

补全 Settings 七大页面汉化：

| 页面 | 主要补全内容 |
|------|-------------|
| 账号 | 公开资料、认领用户名 |
| 外观 | 动效、隐藏邮箱 |
| 套餐与用量 | 当前套餐、可升级、按需用量、API 用量条 |
| 智能体 | 代码块换行、远程控制、运行模式 |
| 工作树 | 清理策略、最大工作树数 |
| 工具与 MCP | 认证、浏览器自动化、团队 MCP |
| 钩子 | 已配置钩子、Customize 迁移横幅 |

```bash
npm run audit   # 优先词条 0 遗漏
```

## 常见问题

### Cursor 更新后界面变回英文？

大版本更新会覆盖修改过的文件，重新运行：

```bash
node index.js localize
```

如果更新后仍有个别新界面是英文（新版本带来了全新文案），用反向探测把它们找出来：

```bash
npm run probe -- --new-only   # 列出字典里还没有的新文案
```

把结果补进 `src/dict-*.js`，再跑一次 `localize` 即可。

### 权限不足 / EPERM？

1. 确保 Cursor 已完全退出（Cmd+Q）
2. 运行 `node index.js localize`，在弹出的 macOS 授权框输入密码
3. 或手动：`sudo node index.js localize`
4. 若仍失败：系统设置 → 隐私与安全性 → 完全磁盘访问权限 → 授权「终端」

### 如何恢复英文？

```bash
node index.js restore
```

然后重启 Cursor。

### 如何贡献翻译？

在 `src/dict.js`（或 `dict-automations.js`、`dict-appearance.js`）中添加条目：

```javascript
'English text here': '中文翻译',
```

运行 `npm run audit` 验证，然后提交 Pull Request。

## 已知限制

- 服务端动态下发的文案（部分套餐页、模板描述）无法本地汉化
- 每次 Cursor **大版本更新**后需重新汉化
- 品牌名（GitHub、Slack、MCP 等）保留英文
- 非官方方式，不在 Cursor 支持范围内

## 许可证

[MIT](LICENSE)

## 致谢

翻译引擎思路参考社区项目 [cursor-i18n-tool](https://github.com/Wuyf5275/cursor-i18n-tool)，在本项目基础上扩展了 Glass、Automations、Appearance 等模块。
