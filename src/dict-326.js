/**
 * Cursor 3.26.x 新增界面文案
 * 这些条目在 3.26.13 中仍为英文，来源于对已汉化产物的反向扫描。
 * 全部长度 >= 20，可进入 longEntries 裸全局替换。
 */

const dict326 = {
  // ── Automation 权限 ──
  'Automations are not available until privacy mode is reconciled to a storage-eligible setting.':
    '在隐私模式调整为允许存储的设置之前，自动化功能不可用。',
  'This automation can only be viewed by the creator and team admins.':
    '此自动化仅创建者和团队管理员可见。',
  'Only the creator can make this automation private':
    '只有创建者才能将此自动化设为私有',
  'Everyone on your team can view and edit this automation':
    '你团队中的所有人都可以查看和编辑此自动化',
  'Everyone on your team can view this automation':
    '你团队中的所有人都可以查看此自动化',
  'Everyone on your team can edit or disable it':
    '你团队中的所有人都可以编辑或禁用它',
  'Only team admins can edit or disable it':
    '只有团队管理员可以编辑或禁用它',
  'Team admins can still disable or delete it':
    '团队管理员仍可禁用它或删除它',
  'Team admins can still view, disable, or delete it':
    '团队管理员仍可查看、禁用它或删除它',
  'Only visible to the owner and team admins':
    '仅所有者和团队管理员可见',
  'You can view or toggle this automation, but only the owner can edit it':
    '你可以查看或开关此自动化，但只有所有者可以编辑',
  'You can activate this automation, but runs may hit errors until the issues below are resolved.':
    '你可以激活此自动化，但在下方问题解决之前，运行可能会出错。',
  'Only the creator can add MCP servers for this automation':
    '只有创建者可以为这个自动化添加 MCP 服务器',
  'Anyone who can view or run this automation may be able to access information from that channel in the automation output or run history.':
    '任何能查看或运行此自动化的人都可能从自动化输出或运行历史中访问该频道的信息。',
  'Anyone who can view or run this automation may be able to access information from those channels in the automation output or run history.':
    '任何能查看或运行此自动化的人都可能从自动化输出或运行历史中访问这些频道的信息。',
  'One or more MCP tools used by this automation need to be authenticated or configured':
    '此自动化使用的一个或多个 MCP 工具需要认证或配置',
  'User MCP servers are unavailable when the automation runs as a service account':
    '当自动化以服务账号身份运行时，用户 MCP 服务器不可用',
  'Save and enable to configure the webhook URL':
    '保存并启用后可配置 webhook URL',
  'Save this automation to enable and configure memory notes':
    '保存此自动化后可启用并配置记忆笔记',
  'Select a repository or environment above to use this tool':
    '请在上方选择仓库或环境以使用此工具',
  'Select repositories for this test run, or use the default environment.':
    '为本次测试运行选择仓库，或使用默认环境。',
  'The saved scheduled task chat is busy or awaiting input':
    '已保存的定时任务对话正忙或正在等待输入',

  // ── 团队与插件市场 ──
  'Select who can see and use plugins from this team marketplace':
    '选择谁可以查看和使用此团队市场中的插件',
  'Automatically update plugins when changes are pushed to the repository':
    '当仓库推送变更时自动更新插件',
  'Choose whether pull requests are created on GitHub or Origin for repositories mirrored between the two':
    '对于在 GitHub 与 Origin 之间镜像的仓库，选择在哪个平台创建拉取请求',

  // ── 隐私与数据 ──
  'When data sharing is enabled, Cursor learns from code to help your team get the best experience possible.':
    '启用数据共享后，Cursor 会从代码中学习，以帮助你的团队获得最佳体验。',
  'Prompts and limited telemetry may also be shared with model providers when you explicitly select their models.':
    '当你明确选择模型提供商的模型时，提示词和有限的遥测数据也可能共享给该提供商。',
  'A backup of the current data is kept in your user data folder.':
    '当前数据的备份保存在你的用户数据文件夹中。',
  'Only you can view this transcript.':
    '只有你可以查看此记录。',

  // ── 云智能体 ──
  'Cloud agents ship better code and run faster when you set up their development environment.':
    '设置好开发环境后，云智能体能交付更好的代码并运行得更快。',
  'The Cursor app needs to be installed on your repository to use Cloud Agents.':
    '要在你的仓库上使用云智能体，需要先安装 Cursor 应用。',
  'Cloud Agents are not supported for public repositories for which you are not a collaborator.':
    '云智能体不支持你并非协作者的公开仓库。',
  'Connect your GitHub to use cloud agents, automations, and the Cursor mobile app':
    '连接你的 GitHub 以使用云智能体、自动化和 Cursor 移动端应用',
  'Connect your repos to use cloud agents, automations, and the Cursor mobile app':
    '连接你的仓库以使用云智能体、自动化和 Cursor 移动端应用',
  'Move this agent to the Cloud to run longer without your computer open.':
    '将此智能体移到云端，无需保持电脑开启即可运行更久。',
  'Fetching and switching to the Cloud Agent branch.':
    '正在获取并切换到云智能体分支。',
  'Add custom setup steps, required services, network requirements, or commands to run the app.':
    '添加自定义设置步骤、所需服务、网络要求或运行应用的命令。',
  'Subagents are still running and will keep working after this agent is archived':
    '子智能体仍在运行，此智能体归档后它们会继续工作',
  'Subagents are specialized assistants that run in their own context window so Agent can parallelize and stay focused.':
    '子智能体是运行在各自上下文窗口中的专用助手，让智能体能够并行处理并保持专注。',
  'Commands are reusable prompts you invoke with /name to standardize common workflows across your team.':
    '命令是可用 /name 调用的可复用提示词，用于在团队内统一常见工作流程。',
  'This agent will go back to the worktree':
    '此智能体将返回工作树',
  'The git worktree for this agent is no longer on disk.':
    '此智能体的 git 工作树已不在磁盘上。',
  'No branch name set for this worktree':
    '此工作树未设置分支名称',
  'Use this after creating a worktree or whenever the conversation should continue from a different workspace root.':
    '在创建工作树之后使用，或当对话需要从其他工作区根目录继续时使用。',
  'No workspace folder found, project hooks will not be available':
    '未找到工作区文件夹，项目钩子将不可用',
  'Connects browser tools so the agent can inspect and interact with web pages.':
    '连接浏览器工具，使智能体能够检查网页并与之交互。',
  'Remote Agent Host skills are not loaded yet':
    '远程智能体主机的技能尚未加载',
  'Remote Agent Host workspace is not trusted':
    '远程智能体主机的工作区未受信任',
  'Remote controllers can only answer or skip a question':
    '远程控制方只能回答问题或跳过问题',
  'Agent environment is not ready to connect MCP servers':
    '智能体环境尚未就绪，无法连接 MCP 服务器',
  'Agent environment is not ready to run MCP actions':
    '智能体环境尚未就绪，无法执行 MCP 操作',

  // ── Project 与工作区 ──
  'That agent is joining this Project as its first worker and is still running its task, so do not start, delegate, or redo work.':
    '该智能体正作为首位工作者加入此项目且仍在执行任务，因此不要启动、委派或重做工作。',
  'You get your own chat in this Project, working from its shared notes and files.':
    '你会在此项目中拥有自己的对话，并基于共享笔记和文件工作。',
  'Teammates who message it join this Project and can read its notes and files':
    '向它发消息的队友会加入此项目，并可读取其笔记和文件',
  'The environment snapshot you requested does not exist, or you do not have permission to access it.':
    '你请求的环境快照不存在，或你无权访问它。',
  'Choose a Folder for This Project':
    '为此项目选择一个文件夹',
  'Choose a folder on this remote':
    '在此远程主机上选择文件夹',
  'Name this workspace and choose folders on this remote':
    '为此工作区命名并选择此远程主机上的文件夹',
  'Name this workspace and choose folders to include':
    '为此工作区命名并选择要包含的文件夹',
  'Add a folder to save this workspace.':
    '添加文件夹以保存此工作区。',
  'Choose a single local folder (repository root) to open this Bugbot link.':
    '选择一个本地文件夹（仓库根目录）以打开此 Bugbot 链接。',
  'Create an Origin namespace to save and publish your work easily':
    '创建 Origin 命名空间，轻松保存和发布你的工作',
  'Cursor could not initialize the connection to this workspace':
    'Cursor 无法初始化与此工作区的连接',

  // ── 对话与编辑 ──
  'The message is no longer available to edit and resubmit.':
    '该消息已无法编辑并重新提交。',
  'This message is no longer available to edit and resubmit':
    '该消息已无法编辑并重新提交',
  'This will create a new chat with the following prompt:':
    '这将使用以下提示词创建一个新对话：',
  'Are you sure you want to reset the chat mode to default?':
    '确定要将对话模式重置为默认吗？',
  'Are you sure you want to close this window?':
    '确定要关闭此窗口吗？',
  'Are you sure you want to delete this comment?':
    '确定要删除此评论吗？',
  'Are you sure you want to perform this action?':
    '确定要执行此操作吗？',
  'Fork this chat and submit the current prompt':
    '分叉此对话并提交当前提示词',
  'Chat forked successfully - you can now continue the conversation':
    '对话已成功分叉 — 你现在可以继续对话',
  'Open chat as editor tabs is unavailable while non-chat content is placed in the Secondary Side Bar.':
    '当次级侧边栏中放置了非对话内容时，无法将对话作为编辑器标签页打开。',
  'Cmd+K: Escape Focuses the Editor When You Have a Diff':
    'Cmd+K：存在差异时按 Escape 会聚焦编辑器',
  'Click to enable the other action':
    '点击以启用另一操作',
  'This rule attached to every chat and command+k request':
    '此规则附加到每次对话和 command+k 请求',
  'Enter the commit hash you want to analyze for AI-generated content':
    '输入你想要分析 AI 生成内容的提交哈希',
  'The completed run snapshot is not a regular file':
    '已完成的运行快照不是常规文件',
  'The notebook editor is not attached with view model yet.':
    '笔记本编辑器尚未附加视图模型。',
  'Workspace file is not valid JSON':
    '工作区文件不是有效的 JSON',
  'Not authorized to read this file':
    '无权读取此文件',
  'File or folder no longer exists.':
    '文件或文件夹已不存在。',

  // ── Git ──
  'This will reset both index and working tree to HEAD.':
    '这会将索引和工作树都重置到 HEAD。',
  'This will reset both index and working tree for the selected files.':
    '这会将所选文件的索引和工作树都重置。',
  'This will revert all changes to the selected files.':
    '这会还原所选文件的所有更改。',
  'Stash and save your changes so you can restore them later':
    '储藏并保存你的更改，以便之后恢复',

  // ── 设置项说明 ──
  'Choose the theme used when your system is in light high contrast mode':
    '选择系统处于浅色高对比度模式时使用的主题',
  'Choose the theme used when your system is in dark high contrast mode':
    '选择系统处于深色高对比度模式时使用的主题',
  'Choose the theme used when your system is in high contrast mode':
    '选择系统处于高对比度模式时使用的主题',
  'Add Extension to Workspace Folder Recommendations':
    '将扩展添加到工作区文件夹推荐',
  'Add Extension to Workspace Folder Ignored Recommendations':
    '将扩展添加到工作区文件夹已忽略的推荐',
  'Show or hide problems (errors, warnings, info) only from the active file in the problems view.':
    '在问题视图中仅显示或隐藏当前文件的问题（错误、警告、信息）。',
  'Opens a new diff editor to compare the active file with the contents of the clipboard.':
    '打开新的差异编辑器，将当前文件与剪贴板内容进行比较。',
  'This model is blocked by your administrator and cannot be enabled.':
    '此模型已被你的管理员阻止，无法启用。',
  'Without the pro plan, you do not have access to this feature/model.':
    '没有 Pro 套餐，你无法访问此功能/模型。',

  // ── 更新与网络 ──
  'This track will silently download and install updates without prompting whenever Cursor is closed.':
    '此通道会在 Cursor 关闭时静默下载并安装更新，不会提示。',
  'Bidirectional streaming is not supported by the http2 proxy in your network environment':
    '你的网络环境中的 http2 代理不支持双向流',
  'Check if the URL is correct, or check your internet connection.':
    '请检查 URL 是否正确，或检查你的网络连接。',
  'The certificate for this site is not trusted':
    '此站点的证书不受信任',
  'Cursor needs your Slack permission again to manage the app':
    'Cursor 需要你重新授权 Slack 才能管理该应用',
  'Your account has been updated and you can continue working.':
    '你的账户已更新，可以继续工作。',

  // ── macOS 专属(Windows 下不会出现,但保持词表完整) ──
  'To fix this, fully quit Cursor, move it to your Applications folder, then relaunch.':
    '要解决此问题，请完全退出 Cursor，将其移到「应用程序」文件夹，然后重新启动。',
};

module.exports = { dict326 };
