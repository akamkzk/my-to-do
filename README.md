# マイ・ジャーナル — 手帳スタイル TODO

[![Deploy to GitHub Pages](https://github.com/akamkzk/my-to-do/actions/workflows/deploy.yml/badge.svg)](https://github.com/akamkzk/my-to-do/actions/workflows/deploy.yml)
[![Deploy](https://github.com/akamkzk/my-to-do/actions/workflows/deploy.yml/badge.svg)](https://akamkzk.github.io/my-to-do/)

> [在线体验 →](https://akamkzk.github.io/my-to-do/)

一款手帐风格的 TODO 应用，采用牛皮纸主题视觉设计，配有和纸胶带装饰、模拟/数字时钟和多语言支持。

## ✨ 特性

- 📝 **手帐风格 UI** — 牛皮纸背景、和纸胶带装饰、手绘圆角、柔和阴影
- ⏰ **双时钟显示** — 模拟时钟 + 数字时钟，实时显示当前时间
- 🌐 **多语言支持** — 日语 / 简体中文 / 英语，自动检测浏览器语言偏好
- 🔍 **智能搜索与筛选** — 分类筛选、优先级筛选、实时搜索（防抖）
- 📊 **统计面板** — 进度环、分类柱状图、完成统计一目了然
- 💾 **本地持久化** — 数据存储在浏览器 localStorage，刷新不丢失
- 📱 **响应式设计** — 适配桌面和移动端
- 🎨 **牛皮纸主题** — 温暖的纸质色调，沉浸式手帐体验

## 🛠️ 技术栈

- **React 19** — 最新 React，使用 Hooks 和 Context API
- **TypeScript** — 严格的类型安全
- **Vite 7** — 极速开发体验和构建
- **CSS 自定义属性** — 全局设计系统，牛皮纸主题配色
- **localStorage** — 纯客户端数据持久化

## 📦 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（带热更新）
npm run dev

# 类型检查 + 生产构建
npm run build

# 本地预览生产构建
npm run preview
```

## 🚀 部署

本项目自动部署到 GitHub Pages，每次 push 到 `main` 分支会触发 GitHub Actions 自动构建和部署。

## 📁 项目结构

```
src/
├── main.tsx                 # 入口
├── App.tsx                  # 根组件
├── types/index.ts           # 类型定义
├── utils/                   # 工具函数
│   ├── store.ts             # TodoStore（数据层）
│   ├── model.ts             # 常量与工具函数
│   ├── i18n.ts              # 多语言翻译
│   ├── clock.ts             # 时钟计算
│   └── validators.ts        # HTML 转义、防抖
├── hooks/                   # 自定义 Hooks
├── components/              # React 组件
└── styles/                  # 样式模块
```

## 📄 许可证

MIT
