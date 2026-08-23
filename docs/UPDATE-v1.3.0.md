# v1.3.0 更新指南 — Cursor 3.17 截图遗漏词条补全

根据 Cursor 3.17.8 Settings 实机截图，补全升级后仍为英文的界面文案。

## 覆盖页面

| 页面 | 主要补全 |
|------|----------|
| 侧栏 | Code Intelligence → 代码智能 |
| 通用 | Customize 迁移横幅、启动、窗口还原、继续中断的智能体、完成提示音 |
| 账号 | 邮箱/头像/姓名/用户名/链接/公开资料可见性 |
| 外观 | 智能体对话、高对比度、趣味彩带炮、隐藏邮箱描述 |
| 套餐与用量 | 用量重置前缀、还剩 N 天、其他模型用量 |
| 智能体 | 对话/默认环境/默认模型/新消息/队列/语音关键词/第三方导入 等 |
| 模型 | 模型选择器说明、Explore 默认说明 |
| Git | 审查提供商描述（既有规则加固） |
| 浏览器与网络 | 本地/网页链接开关标题、显示/隐藏域名、复制域名 |

## 未纳入（正常保留）

- 模型品牌名（Composer、Opus、GPT、Sol、Fast 等）
- 套餐价格数字（$60/mo、$200/mo）
- 用户 Rules / Skills 列表正文

## 应用

```bash
cd ~/Projects/cursor-i18n-zh
# Cmd+Q 完全退出 Cursor
node index.js localize
```

## 改动文件

- `src/dict-settings-pages.js`
- `src/settings-nav.js`
- `src/tricky.js`
- `scripts/audit.js`
- `index.js` / `package.json` → **1.3.0**
- `README.md`
- `docs/UPDATE-v1.3.0.md`
