# Windows 安装使用指南（小白版）

> 适用工具：`cursor-i18n-zh`（Cursor IDE 一键汉化）  
> 当前版本：v1.2.0  
> 仓库：https://github.com/baishi1114010/cursor-i18n-zh

本指南面向**完全零基础**用户，按步骤做即可。全程大约 5～10 分钟。

---

## 一、开始前请先知道

1. 这是**非官方**工具，会修改你电脑上已安装的 Cursor 程序文件。
2. **不会**上传账号密码，只在本地替换界面英文。
3. Cursor **大版本更新**后，界面可能变回英文，需要再运行一次汉化。
4. 全程请用**简体中文**系统操作；命令可复制粘贴。

---

## 二、你需要准备什么

| 需要 | 说明 | 没有怎么办 |
|------|------|------------|
| 电脑系统 | Windows 10 / 11 | — |
| Cursor | 已安装并能正常打开 | 先去官网安装 Cursor |
| Node.js | 版本 ≥ 18 | 见下方「步骤 A」 |
| 网络 | 能访问 GitHub（或能下载 ZIP） | 见「方式二：下载 ZIP」 |

---

## 三、步骤 A：安装 Node.js（必须）

汉化工具用 Node.js 运行，**没有 Node 就跑不起来**。

### A1. 检查有没有装过

1. 按键盘 `Win` 键，输入：`cmd`
2. 打开 **命令提示符**
3. 输入下面这行，按回车：

```text
node -v
```

- 若显示类似 `v18.x.x`、`v20.x.x`、`v22.x.x` → **已安装，跳到步骤 B**
- 若提示「不是内部或外部命令」→ **继续 A2 安装**

### A2. 安装 Node.js

1. 打开官网：https://nodejs.org/
2. 下载左边 **LTS（长期支持版）**（推荐）
3. 双击安装包，一路点 **Next**
4. 安装选项里勾选 **Automatically install the necessary tools** 也可以，没有勾也不影响本工具
5. 装完后，**关闭旧的命令提示符窗口**，重新打开一个新的
6. 再执行：

```text
node -v
```

能显示版本号即可。

---

## 四、步骤 B：完全退出 Cursor（非常重要）

汉化时 Cursor 必须关掉，否则会失败或改不了文件。

### 正确退出方法

1. 关闭所有 Cursor 窗口
2. 看电脑右下角 **托盘区**（任务栏右下角小箭头 `^`）
3. 若还有 Cursor 图标：右键 → **Quit / 退出**
4. 仍不放心时：
   - 按 `Ctrl + Shift + Esc` 打开「任务管理器」
   - 找到 `Cursor` / `Cursor.exe`
   - 选中后点 **结束任务**

确认没有 Cursor 进程后，再继续。

---

## 五、步骤 C：下载汉化工具

任选一种方式。

### 方式一：用 Git 克隆（推荐，以后好更新）

#### C1. 先检查有没有 Git

在命令提示符输入：

```text
git --version
```

没有的话，去安装：https://git-scm.com/download/win  
安装时一路默认即可，装完**重开**命令提示符。

#### C2. 克隆仓库

建议放到好找的目录，例如桌面：

```text
cd %USERPROFILE%\Desktop
git clone https://github.com/baishi1114010/cursor-i18n-zh.git
cd cursor-i18n-zh
```

### 方式二：下载 ZIP（不会用 Git 就选这个）

1. 打开：https://github.com/baishi1114010/cursor-i18n-zh
2. 点绿色按钮 **Code** → **Download ZIP**
3. 解压到桌面（或任意文件夹）
4. 解压后文件夹名可能是 `cursor-i18n-zh-main`，进去即可
5. 在该文件夹空白处，按住 `Shift` + 右键 → **在此处打开 PowerShell 窗口**  
   或：地址栏输入 `cmd` 后回车

---

## 六、步骤 D：一键汉化（核心）

确认：

- [ ] Node.js 已安装（`node -v` 有版本）
- [ ] Cursor 已完全退出
- [ ] 命令行当前目录在 `cursor-i18n-zh` 文件夹内

### D1. 先看状态（可选，但建议）

```text
node index.js status
```

正常会显示 Cursor 版本、安装路径等信息。

### D2. 执行汉化

```text
node index.js localize
```

成功时大致会看到：

- 配置中文语言包
- 备份原始文件
- 应用中文翻译
- 修复完整性校验
- **汉化完成**

### D3. 重新打开 Cursor

双击打开 Cursor，进入 **Settings（设置）**，检查侧栏、套餐、智能体等页面是否已中文。

---

## 七、如果提示找不到 Cursor 安装路径

默认会自动查找：

- `C:\Users\你的用户名\AppData\Local\Programs\cursor\`
- `C:\Program Files\cursor\`

若你装在 D 盘或其他位置，用 `-p` 指定路径：

```text
node index.js localize -p "D:\software\cursor"
```

说明：

- 可以指向 Cursor 安装根目录（里面有 `Cursor.exe`）
- 也可以直接指向 `...\cursor\resources\app` 目录
- 路径有空格时，务必加英文双引号

---

## 八、如果提示权限不足 / 无法写入

### 方法 1：用管理员身份运行（最常用）

1. 开始菜单搜索 `cmd` 或 `PowerShell`
2. 右键 → **以管理员身份运行**
3. 再进入工具目录，例如：

```text
cd %USERPROFILE%\Desktop\cursor-i18n-zh
node index.js localize
```

### 方法 2：检查杀毒软件

个别杀毒软件会拦截修改程序文件。可临时允许，或把工具目录加入白名单后再试。

### 方法 3：确认 Cursor 没在运行

回到「步骤 B」再检查一次任务管理器。

---

## 九、常用命令一览

在 `cursor-i18n-zh` 目录下执行：

| 命令 | 作用 |
|------|------|
| `node index.js localize` | 一键汉化 |
| `node index.js status` | 查看汉化状态 / Cursor 版本 |
| `node index.js restore` | 恢复英文原版 |
| `node index.js help` | 查看帮助 |
| `node index.js localize -p "路径"` | 指定 Cursor 安装路径后汉化 |

恢复英文示例：

```text
node index.js restore
```

执行后重启 Cursor。

---

## 十、Cursor 更新后又变英文了？

正常现象。官方更新会覆盖本地文件。

处理：

1. 完全退出 Cursor
2. 进入工具目录
3. 再执行：

```text
node index.js localize
```

若你是用 Git 克隆的，可先更新工具再汉化：

```text
cd %USERPROFILE%\Desktop\cursor-i18n-zh
git pull
node index.js localize
```

---

## 十一、图文操作顺序（速查）

```text
安装 Node.js
    ↓
完全退出 Cursor（含托盘 / 任务管理器）
    ↓
下载或克隆 cursor-i18n-zh
    ↓
打开命令行，进入该文件夹
    ↓
node index.js localize
    ↓
重新打开 Cursor → 检查设置页是否中文
```

---

## 十二、常见问题 FAQ

### Q1：必须安装 Git 吗？

不一定。不会用 Git，下载 ZIP 解压即可。

### Q2：需要 `npm install` 吗？

**不需要。** 本工具零依赖，装好 Node.js 就能跑。

### Q3：会不会影响我的项目代码 / 设置？

主要修改的是 Cursor 安装目录里的界面文件；会顺带配置中文语言包。你的项目代码一般不受影响。工具会先备份，可用 `restore` 恢复。

### Q4：汉化后部分英文还在？

可能原因：

- 模型名、价格、部分服务端文案本身保留英文
- Cursor 又发了新界面，词条尚未收录

可到 GitHub Issues 反馈截图：https://github.com/baishi1114010/cursor-i18n-zh/issues

### Q5：公司电脑装在特殊目录怎么办？

用 `-p` 指定完整路径，并用管理员终端执行。

### Q6：PowerShell 执行策略报错？

可改用 **命令提示符（cmd）**，或在当前用户放开脚本策略（需自行评估安全风险）。对多数用户，用 cmd 最省事。

---

## 十三、安全与免责声明

- 非 Cursor 官方工具，与 Cursor 团队无关
- 修改本地安装包，请自行评估风险
- 建议在个人电脑使用；企业管控环境请遵守公司规定
- 使用前工具会自动备份，仍建议重要工作先保存

---

## 十四、需要帮助时请提供这些信息

反馈问题时，尽量附上：

1. Windows 版本（10 / 11）
2. `node -v` 输出
3. `node index.js status` 完整输出
4. 报错截图或文字
5. Cursor 安装路径（如果知道）

祝使用顺利。汉化成功后，重启 Cursor 即可看到中文界面。
