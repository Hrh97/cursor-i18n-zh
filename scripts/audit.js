#!/usr/bin/env node
/**
 * 汉化覆盖率自检脚本
 * 用法: node scripts/audit.js [-p <Cursor 安装目录>]
 *
 * 注意：Windows 上 Cursor 若不在 C 盘（%LOCALAPPDATA% 之外），
 * 默认候选路径找不到安装目录，必须用 -p / --path 指定。
 */
const fs = require('fs');
const path = require('path');
const { detectCursorPath } = require('../src/platform');
const { translateContent } = require('../src/translate');

const PRIORITY_STRINGS = [
  // Settings 侧栏
  ['general:"General"', 'Settings → General'],
  ['chat:"Agents"', 'Settings → Agents'],
  ['tab:"Tab"', 'Settings → Tab'],
  ['models:"Models"', 'Settings → Models'],
  ['mcp:"Tools & MCPs"', 'Settings → Tools & MCPs'],
  ['hooks:"Hooks"', 'Settings → Hooks'],
  ['network:"Network"', 'Settings → Network'],
  ['beta:"Beta"', 'Settings → Beta'],
  // Settings 描述
  ['Show warning-level in-app toasts', '警告通知描述'],
  ['Show Cursor in menu bar', '菜单栏描述'],
  ['Open pull request links inside Cursor', 'PR 链接描述'],
  // Glass 主页
  ['"New Agent"', 'Glass → New Agent'],
  ['"Automations"', 'Glass → Automations'],
  ['"Plan New Idea"', 'Glass → Plan New Idea'],
  // Agent 常用
  ['"Learn More"', 'Learn More 按钮'],
  ['"Open Settings"', 'Open Settings 按钮'],
  ['"Start New Chat"', 'Start New Chat'],
  // Automations 页
  ['"Total Automations"', 'Automations → 总数'],
  ['"New Automation"', 'Automations → 新建'],
  ['"Run History"', 'Automations → 运行历史'],
  ['"Find critical bugs"', 'Automations → 模板'],
  ['Automate repetitive tasks', 'Automations → 副标题'],
  // Appearance 页
  ['Tool Call Density', 'Appearance → 工具调用密度'],
  ['UI Font Size', 'Appearance → 界面字体大小'],
  ['Reduce Transparency', 'Appearance → 降低透明度'],
  ['Choose between light, dark', 'Appearance → 主题描述'],
  // ① 账号 Profile
  ['Create your public profile', 'Profile → 创建公开资料'],
  ['Claim handle', 'Profile → 认领用户名'],
  // ② 外观补全
  ['Reduce Motion', 'Appearance → 减少动效'],
  ['Your system has Reduce Transparency turned on right now', 'Appearance → 系统降低透明度提示'],
  ['Unavailable while Reduce Motion is on', 'Appearance → 减少动效不可用提示'],
  ['Hide Email Address', 'Appearance → 隐藏邮箱'],
  // ③ 套餐与用量
  ['Current Plan</div>', 'Plan → 当前套餐'],
  ['Upgrade Available</div>', 'Plan → 可升级'],
  ['Included in Pro+', 'Plan → Pro+ 包含'],
  ['On-Demand Usage', 'Plan → 按需用量'],
  ['Auto + Composer', 'Plan → Auto+Composer'],
  // ④ 智能体补全
  ['Code Block Word Wrap', 'Agents → 代码块换行'],
  ['"Enable Remote Control for this computer"', 'Agents → 远程控制按钮'],
  ['Run Mode', 'Agents → 运行模式'],
  // ⑤ 工作树
  ['Max worktrees', 'Worktree → 最大工作树数'],
  ['No Cursor-managed worktrees on this machine.', 'Worktree → 空状态'],
  // ⑥ 工具与 MCP
  ['Wait for MCP Authentication', 'MCP → 等待认证'],
  ['Browser Automation', 'MCP → 浏览器自动化'],
  ['Team MCP Servers', 'MCP → 团队服务器'],
  // ⑦ 钩子
  ['Configured Hooks', 'Hooks → 已配置钩子'],
  ['Open user config', 'Hooks → 打开用户配置'],
  [' are moving to Customize', 'Hooks/MCP → Customize 迁移'],
  // v1.2.0 截图补全
  ['browser:"Browser & Network"', 'Settings → Browser & Network'],
  ['"git-prs":"Git & PRs"', 'Settings → Git & PRs'],
  ['Adjust Plan', 'Plan → 调整套餐'],
  ['Allowlist Options', 'Agents → 白名单选项'],
  ['Enable LSPs', 'Agents → 启用 LSP'],
  ['Terminal and Editing', 'Agents → 终端与编辑'],
  ['Max Worktrees', 'Worktree → Max Worktrees'],
  ['Cursor-Managed Worktrees', 'Worktree → Managed'],
  ['Explore Subagent Model', 'Models → Explore Subagent'],
  ['Task Models', 'Models → Task Models'],
  ['Branch Prefix', 'Git → 分支前缀'],
  ['Ignore Files', 'Indexing → 忽略文件'],
  ['Include Third-Party Plugins, Skills, and Other Configs', 'Rules → 第三方配置'],
  ['Usage limits reset on <!> (<!>)', 'Plan → 用量重置模板'],
  // v1.3.0 Cursor 3.17 截图补全
  ['Code Intelligence', 'Settings → 代码智能'],
  ['Window Restoration', 'General → 窗口还原'],
  ['Continue Interrupted Agents', 'General → 继续中断的智能体'],
  ['Choose Custom Sound...', 'General → 自定义提示音'],
  ['Profile Image', 'Account → 头像'],
  ['Follow System High Contrast', 'Appearance → 高对比度'],
  ['Give the Agent a Confetti Cannon', 'Appearance → 彩带炮'],
  ['Default Environment', 'Agents → 默认环境'],
  ['Voice Submit Keywords', 'Agents → 语音关键词'],
  ['Choose which models appear in the model picker', 'Models → 模型选择器'],
  ['Open Local Links in Cursor Browser', 'Browser → 本地链接'],
  ['"Usage limits reset on "', 'Plan → 用量重置前缀'],
];

function auditFile(label, filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`\n⚠️  ${label}: 文件不存在`);
    return { missing: PRIORITY_STRINGS.length, total: PRIORITY_STRINGS.length };
  }

  const current = fs.readFileSync(filePath, 'utf8');
  const simulated = translateContent(current);

  console.log(`\n=== ${label} ===`);
  let missing = 0;
  for (const [needle, desc] of PRIORITY_STRINGS) {
    const stillInSim = simulated.includes(needle);
    const inCurrent = current.includes(needle);
    if (stillInSim) {
      console.log(`  ❌ ${desc}`);
      missing++;
    } else if (inCurrent) {
      console.log(`  ✅ ${desc} (补全后可达)`);
    } else {
      console.log(`  ✅ ${desc} (已汉化)`);
    }
  }
  return { missing, total: PRIORITY_STRINGS.length };
}

function parseCustomPath(argv) {
  const i = argv.findIndex((a) => a === '-p' || a === '--path');
  if (i === -1) return null;
  const value = argv[i + 1];
  if (!value || value.startsWith('-')) {
    console.error('❌ 请在使用 -p / --path 后提供 Cursor 安装目录。');
    process.exit(1);
  }
  return value;
}

function main() {
  const paths = detectCursorPath(parseCustomPath(process.argv.slice(2)));
  if (!paths) {
    console.error('❌ 未找到 Cursor 安装目录，请用 -p <Cursor 安装目录> 指定。');
    process.exit(1);
  }

  console.log('Cursor 汉化覆盖率自检');
  console.log(`安装路径: ${paths.appPath}`);

  const results = [
    auditFile('desktop.main.js', paths.targets[0].abs),
    auditFile('glass.main.js', paths.targets[1].abs),
    auditFile('automations.js', paths.targets[2].abs),
  ];

  const totalMissing = results.reduce((s, r) => s + r.missing, 0);
  console.log(`\n--- 汇总 ---`);
  console.log(`优先词条遗漏: ${totalMissing}`);
  if (totalMissing > 0) {
    console.log('\n请运行: node index.js localize （需先退出 Cursor）');
  } else {
    console.log('\n优先词条已全部覆盖 ✅');
  }
}

main();
