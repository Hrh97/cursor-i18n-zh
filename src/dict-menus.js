// 会话 / 智能体右键菜单与状态标签（版本无关）
// 来源：对 3.27.14 原版 bundle 扫描所有 {id,label,icon} 菜单项 + 三态标签，
// 经逻辑位扫描确认全部「仅展示位」（不参与 ===/case/includes 等比较）后才收录。
// 例外：Done / Canceled 同时被当作枚举值（e.DONE="Done"、e[e.Canceled=1]="Canceled"），
// 因此它们不放这里，而是放在 dict.js 的 riskyShortWords（仅在 UI 属性位替换）。
const dictMenus = {
  // ── 智能体会话右键菜单 ──
  'Pin': '置顶',
  'Unpin': '取消置顶',
  'Edit Icon': '编辑图标',
  'Mark as Read': '标为已读',
  'Mark as Unread': '标为未读',
  'Fork': '分叉',
  'Move to': '移动到',
  'Create Project': '创建项目',
  'Archive': '归档',
  'Unarchive': '取消归档',
  'Archive All Below': '归档以下全部',
  'New Section': '新建分组',
  'Clear Filter': '清除筛选',

  // ── 复制类 ──
  'Copy request ID': '复制请求 ID',
  'Copy Branch': '复制分支',
  'Copy Transcript': '复制对话记录',

  // ── 分屏 / 视图 ──
  'Split Down': '向下拆分',
  'Split Right': '向右拆分',
  'View Source': '查看源代码',
  'Canvas': '画布',
  'Open in Datadog': '在 Datadog 中打开',

  // ── 任务状态标签 ──
  'For Review': '待审查',
  'In Progress': '进行中',
  'Queued': '排队中',
};
module.exports = { dictMenus };
