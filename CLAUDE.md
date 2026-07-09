# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

"我的日志"（マイ・ジャーナル）— 一款手帐风格的 TODO 应用，基于 React 19 + TypeScript + Vite 7 构建。采用牛皮纸主题视觉设计，配有和纸胶带装饰、模拟/数字时钟、多语言支持（日语、简体中文、英语），数据通过 localStorage 持久化存储。

## 常用命令

- `npm run dev` — 启动 Vite 开发服务器（带热更新 HMR）
- `npm run build` — 先用 `tsc -b` 做类型检查，再用 Vite 执行生产构建
- `npm run preview` — 在本地预览生产构建结果

本项目未配置测试框架，也未安装代码检查工具（linters）。

## 架构

### 数据流

```
AppProvider（上下文）──包裹──> 所有组件
       │
       ├── 状态：todos[], activeTab, searchQuery, filterCategory, filterPriority, language
       ├── 操作：addTodo, removeTodo, toggleTodo, updateTodo, clearCompleted
       ├── 计算值：filteredTodos（按 tab → 分类 → 优先级 → 搜索 → 排序的流水线处理）
       └── 委托给：TodoStore（单例）负责增删改查和 localStorage 持久化
```

**唯一数据源**：`src/utils/store.ts` 导出了一个单例 `TodoStore` 类，带有发布/订阅机制（`subscribe`/`emit`）。该 Store 负责所有 localStorage 的读写操作，存储键名为 `todo_journal_data`。组件不直接操作 localStorage。

**上下文层**：`src/contexts/AppContext.tsx` 将 Store 包装在 React 状态中。通过 `useEffect` 加载初始数据并订阅 Store 变更，使 React 状态保持同步。`filteredTodos` 通过 `useMemo` 计算得出——以 `todos` 数组为基础，依次应用 tab 过滤、分类过滤、优先级过滤、搜索过滤，最后通过 `sortTodos()` 排序（已完成排最后 → 高优先级优先 → 新创建优先）。

### 目录结构

```
src/
├── main.tsx                 # 入口 — 渲染 <AppProvider><App /></AppProvider>
├── App.tsx                  # 根组件 — 连接上下文提供者与各功能区块
├── types/
│   └── index.ts             # Todo、CategoryKey、PriorityKey、TabKey、Language、Translations、Stats
├── utils/
│   ├── store.ts             # TodoStore 类 — 增删改查、localStorage、搜索、统计
│   ├── model.ts             # 常量（CATEGORIES、PRIORITY_ORDER）、工具函数（sortTodos、formatDate、getCategoryInfo）
│   ├── i18n.ts              # 翻译字典 + t() 获取函数 + 语言偏好持久化
│   ├── clock.ts             # 模拟时钟角度计算、日期字符串格式化
│   └── validators.ts        # escapeHtml、debounce
├── hooks/
│   ├── useTodos.ts          # 从 useApp() 重新导出所有 Store 操作的便捷 Hook
│   ├── useI18n.ts           # 从 useApp() 重新导出语言相关状态的便捷 Hook
│   └── useClock.ts          # 每秒更新的模拟/数字时钟状态 Hook
├── components/
│   ├── Header.tsx           # 标题、语言选择器下拉框、模拟时钟组件、数字时间
│   ├── TabBar.tsx           # 四个标签页（全部/未完成/已完成/统计），带实时计数
│   ├── SearchBar.tsx        # 搜索输入（防抖）、分类筛选、优先级筛选
│   ├── AddTodoForm.tsx      # 文本输入 + 分类选择 + 优先级选择 + 添加按钮
│   ├── TodoList.tsx         # 空状态提示或 TodoItem 列表
│   ├── TodoItem.tsx         # 复选框、可编辑文本、分类贴纸、优先级徽章、编辑/删除按钮
│   └── StatsPanel.tsx       # 统计卡片（总计/已完成/待完成）、SVG 进度环、分类柱状图、清除按钮
└── styles/
    ├── index.css            # 导入所有样式模块
    ├── main.css             # CSS 自定义属性（颜色、字体、阴影、间距、手绘圆角）+ 全局重置
    ├── layout.css           # 页面布局：头部、标签栏、主内容区、响应式断点
    ├── components.css       # 组件样式：复选框、徽章、表单、入场/退场动画
    └── kraft-paper.css      # 主题装饰：牛皮纸背景渐变、和纸胶带、撕裂边缘、呼吸阴影动画
```

### 关键设计决策

- **不使用 Redux/Zustand** — React Context + TodoStore 单例在此规模下已足够。
- **不使用路由** — 标签页切换通过在 AppContent 中条件渲染来切换区块可见性。
- **无构建时 i18n** — 所有翻译数据集中在 `src/utils/i18n.ts` 中，以 `Language` 类型为键的普通对象。
- **无后端** — 纯客户端运行，使用 localStorage 存储数据。
- **CSS** — 全部为全局样式（无 CSS Modules 或 styled-components）。设计系统围绕 `main.css` 中定义的 CSS 自定义属性展开。
- **TypeScript** — 启用严格模式，包含 `noUnusedLocals` 和 `noUnusedParameters`。使用 `tsc -b` 进行项目级编译。

### 如何添加翻译键

1. 在 `src/types/index.ts` 的 `Translations` 接口中添加新键。
2. 在 `src/utils/i18n.ts` 的 `ja`、`zh-CN`、`en` 三个语言对象中分别填入对应翻译。
3. 在任意组件中调用 `t('你的键名')`。

### 如何添加分类或优先级

1. 在 `src/types/index.ts` 中将新值加入 `CategoryKey` 或 `PriorityKey` 联合类型。
2. 在 `src/utils/model.ts` 中向 `CATEGORIES` 或 `PRIORITY_KEYS` / `PRIORITY_ORDER` 添加对应常量。
3. 更新任何硬编码的映射关系（例如 `StatsPanel.tsx` 中的 emoji/颜色映射）。
每次都使用中文回答我