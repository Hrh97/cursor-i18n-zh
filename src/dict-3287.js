// Cursor 3.28.7 新增 UI 文案（probe --new-only A 级 392 条分类后的人工译稿）。
// 68 条来自 probe 分类（跳过 5 条日志/身份串 + 5 条 functional-keys 禁译 + 2 条主题名），
// 另补环境面板（env-pane-header）族：7 条短状态标签 + 12 条 tooltipLabel + 1 条 aria-label。
// 注意：'Repository' 不在此表（h6k 图标映射有 t==="Repository" 比较），已进 dict.js riskyShortWords。
module.exports = {
  // ===== 对话/重启/提示类 =====
  'Your organization has configured repository access rules that require Git to be installed. Please install Git and restart Cursor to continue using the agent.':
    '你的组织已配置仓库访问规则，要求安装 Git。请安装 Git 并重启 Cursor，以继续使用智能体。',
  "The Cursor team that connected this workspace only allows bots from its own organization there, so the app can't be updated. Ask that team's admin.":
    '连接此工作区的 Cursor 团队仅允许其组织内的机器人进入，因此无法更新此应用。请联系该团队的管理员。',
  "The Cursor team that connected this workspace only allows bots from its own organization there. Ask that team's admin, or pick another.":
    '连接此工作区的 Cursor 团队仅允许其组织内的机器人进入。请联系该团队的管理员，或另选一处工作区。',
  "Cursor will restart. Agent requests will then use Cursor-managed models instead of the team's inference gateway.":
    'Cursor 将重启。之后智能体请求将使用 Cursor 托管的模型，而非团队推理网关。',
  "Cursor will restart. Agent requests will then go to the team's inference gateway.":
    'Cursor 将重启。之后智能体请求将转由团队推理网关处理。',
  'This chat was created in an older version of Cursor and is no longer supported. Please start a new chat.':
    '此对话由旧版本 Cursor 创建，已不再受支持。请开启新的对话。',
  'Chat Too Old': '对话版本过旧',
  'Something went wrong. Please reload your workspace and try again.':
    '出错了。请重新加载工作区后重试。',
  'Something went wrong. Please try opening a new chat.':
    '出错了。请尝试开启新的对话。',
  "You'll be logged out of your Cursor account on this device.":
    '你将在此设备上退出登录 Cursor 账户。',
  'Enabling data handle debugging requires a window reload. Would you like to proceed?':
    '启用数据句柄调试需要重新加载窗口。是否继续？',
  'Bug reports are off under private inference for this team':
    '该团队在私有推理模式下已关闭缺陷报告',
  'Workspace Locked by Another Team': '工作区已被其他团队锁定',
  'Turn Off Private Inference?': '关闭私有推理？',
  'Turn On Private Inference?': '开启私有推理？',
  'Customer Evals UI is not enabled for your account.': '你的账户尚未启用客户评测界面。',
  'Remote Control is unavailable in this window': '此窗口中远程控制不可用',
  'Unable to load this automation.': '无法加载此自动化。',

  // ===== 命令/按钮/菜单 =====
  'Resolve Conflict in Chat': '在对话中解决冲突',
  'Fix Merge Conflicts': '修复合并冲突',
  'Run Security Review': '运行安全审查',
  'Run Bugbot Review': '运行 Bugbot 审查',
  'Report with Comment': '带评论报告',
  'Not a GitHub repository': '不是 GitHub 仓库',
  'Copy cursor.com link': '复制 cursor.com 链接',
  'Get Cursor for iOS': '获取 iOS 版 Cursor',
  'Choose an action': '选择一个操作',
  'Install a plugin': '安装插件',
  'View Status Page': '查看状态页面',
  "Don't ask again": '不再询问',
  'Open debug logs': '打开调试日志',
  'Reveal Agent Message': '定位到智能体消息',
  'Available at runtime': '运行时可用',
  'Available at build': '构建时可用',
  'Copied path to clipboard': '路径已复制到剪贴板',
  'Open in Terminal Pane': '在终端面板中打开',
  'Cloud Agent Settings': '云端智能体设置',
  'User View Container': '用户视图容器',

  // ===== 设置描述（≥20 裸替换；整句替换不影响内部被禁译的 "Add to Chat"/"Open worktree"） =====
  'Show the Add to Chat button when selecting code': '选中代码时显示「添加到对话」按钮',
  'Show the Add to Chat button': '显示「添加到对话」按钮',
  'Show an Open worktree link in the Terminal when the Agent works in a worktree':
    '智能体在工作树中工作时，在终端中显示「打开工作树」链接',
  'Show the Open worktree link in Terminal': '在终端中显示「打开工作树」链接',

  // ===== 密钥（secret）管理 =====
  'Delete this secret?': '删除此密钥？',
  'A secret with this key exists already. Saving replaces its value.':
    '已存在使用此键名的密钥，保存将替换其值。',
  'A secret with this key exists already. Pick another key.':
    '已存在使用此键名的密钥，请更换键名。',
  'This secret is missing a key. Add a key or remove the value.':
    '此密钥缺少键名。请添加键名或移除对应的值。',
  'This secret is missing a value. Add a value or remove the key.':
    '此密钥缺少值。请添加值或移除对应的键名。',
  'This secret was not saved. Change it and save again.':
    '此密钥未能保存。请修改后重新保存。',
  'This secret was saved, but this app keeps using another secret of this name.':
    '此密钥已保存，但该应用仍在使用另一个同名密钥。',
  'Use letters, digits and underscores, and do not start with a digit.':
    '仅可使用字母、数字和下划线，且不能以数字开头。',
  'This value is only whitespace. Type a value or clear the field.':
    '此内容只有空白字符。请输入内容或清空该输入框。',
  'This key is listed more than once. Keys must be unique.':
    '此键名出现了多次。键名必须唯一。',
  'An account with this name already exists.': '已存在同名账户。',
  'Failed to remove the app secret from the app': '从应用中移除该密钥失败',

  // ===== 模型设置 =====
  "The model a coordinator's workers start on when it names none":
    '协调者未指定模型时，其工作者启动所用的模型',
  "The model a new Project's coordinator starts on": '新项目的协调者默认使用的模型',
  'Default Project coordinator model': '默认的项目协调者模型',
  'Default Project worker model': '默认的项目工作者模型',
  'Same as coordinator': '与协调者相同',

  // ===== 流指标 / MCP / RequestContext =====
  'Total number of streams monitored': '监控的流总数',
  'Number of streams that experienced at least one stall': '经历过至少一次卡顿的流数量',
  'Number of bidirectional stream stalls detected': '检测到的双向流卡顿次数',
  'Duration of stream stalls in milliseconds': '流卡顿的总时长（毫秒）',
  'Total bytes substituted into one MCP tool call by $file:/abs/path arguments':
    '单次 MCP 工具调用中由 $file:/abs/path 参数替换的总字节数',
  'Number of distinct $file:/abs/path arguments expanded in one MCP tool call':
    '单次 MCP 工具调用中展开的不同 $file:/abs/path 参数个数',
  'Cannot set upstream: no branch is currently checked out':
    '无法设置上游：当前没有已检出的分支',
  'Time to hydrate, serialize, and hash RequestContext': '水合、序列化与哈希 RequestContext 的耗时',
  'Serialized RequestContext bytes staged by the client': '客户端暂存的 RequestContext 序列化字节数',
  'Prepared RequestContext blob references': '已准备的 RequestContext blob 引用',

  // ===== 环境面板（env-pane-header）短状态标签（安全闸已过：无 ===/case 冲突） =====
  'Ready to update': '已可更新',
  'Ready to save': '已可保存',
  'Setting up': '设置中',
  'Updating': '更新中',
  'Agent blocked': '智能体受阻',
  'Has changes': '有更改',
  'Needs build': '需要构建',
  'Unsaved': '未保存',
  'Updated': '已更新',
  'Environment overview': '环境概览',

  // ===== 环境面板 tooltipLabel（probe 因 tooltipLabel 不在 UI 属性清单而漏报，人工补） =====
  "The agent's fix is ready. Update the environment to use it.":
    '智能体的修复已就绪。更新环境以使用该更改。',
  'The agent needs your help before setup can continue. Complete or skip the blocking tasks to keep going.':
    '在设置继续之前，需要智能体协助。请完成或跳过阻塞任务。',
  'Saving the verified scripts to the environment.': '正在把验证过的脚本保存到环境。',
  'Updating the environment.': '正在更新环境。',
  "You've edited the saved scripts. Verify the changes to update the environment.":
    '你修改过已保存的脚本。请验证更改以更新环境。',
  'You have edited the scripts. Save to keep your changes.':
    '你修改过脚本。请保存以保留更改。',
  'These scripts have not been tested in an environment build. Ask the agent to create a new build.':
    '这些脚本尚未在环境构建中测试过。请让智能体创建新的构建。',
  'You have unsaved environment changes. Save again to update the snapshot.':
    '你有未保存的环境更改。请再次保存以更新快照。',
  "Environment is up to date. If you've made manual changes to the environment, ask the agent to create a new build.":
    '环境已是最新。如果你手动修改过环境，请让智能体创建新的构建。',
  'Snapshot is up to date with the current environment. You can still make changes and save again at any time, including from Terminal or Desktop.':
    '快照与当前环境一致。你仍可随时再次修改并保存，包括在终端或桌面端进行操作。',
  'Environment is ready to save. You can still make changes before saving.':
    '环境已可保存。保存前你仍可进行更改。',
  'Agent is setting up the environment. You can still add secrets or update network access. Install scripts will be available after the first snapshot is created.':
    '智能体正在设置环境。你仍可添加密钥或更新网络访问。首次创建快照后即可使用安装脚本。',
};
