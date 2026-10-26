// Cursor 3.27.14 新增用户可见文案词典（8 条）
// 由 scripts/probe.js --new-only 挖出（A 级 317 条，人工终审后仅这 8 条是用户可见文案，
// 其余为组件断言/库内部错误/遥测指标/开发者命令，按既有约定跳过不译
const dict32714 = {
  // Project / 协作
  "You get your own chat in this Project, working from its shared notes and files":
    "你会在此项目中拥有自己的对话，基于其共享笔记和文件工作",
  "Teammates can't message it until you add it again":
    "在你重新添加之前，队友无法给它发消息",
  "To rejoin, ask the project owner to invite you again":
    "如需重新加入，请让项目所有者再次邀请你",
  "You're no longer in this project":
    "你已不在该项目中",
  "Couldn't load who's in this Project":
    "无法加载此项目的成员",

  // Slack 集成
  "Cursor deletes the Slack app, so approving the request later does nothing":
    "Cursor 会删除该 Slack 应用，因此之后再批准请求不会生效",
  "You can add the app to Slack again later":
    "你之后可以再次将该应用添加到 Slack",

  // GitHub 连接
  "Timed out waiting for a response to the Connect GitHub prompt":
    "等待「连接 GitHub」提示的响应超时",
};
module.exports = { dict32714 };
