// Cursor 3.29.9 新增 UI 文案（从运行中的 3.29.9 界面 + bundle 上下文人工核对）。
// 全部经过验证：① 无 ===/case 比较用法 ② 不在 functional-keys.json ③ 上下文均为纯展示位
// （title:"…"、label:"…"、动态标题三元、NLS 整条）。
// 侧栏区头部、Agents 主页、Glass 侧栏按钮、导航按钮。
module.exports = {
  // ===== Glass 主页侧栏（Agents 视图） =====
  'Projects': '项目',
  'New Project': '新建项目',
  'No agents yet': '还没有智能体',
  'Create an agent to get started': '创建一个智能体即可开始',

  // ===== Glass 侧栏按钮（title 动态标题 + aria） =====
  'Hide Sidebar': '隐藏侧边栏',
  'Show Sidebar': '显示侧边栏',
  'Customize Sidebar': '自定义侧边栏',
  'Show Apps': '显示应用',

  // ===== 导航/工具栏 =====
  'Go Back': '后退',
  'Go Forward': '前进',
  'Chat actions': '聊天操作',
};
