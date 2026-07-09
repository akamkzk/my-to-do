/* ============================================
   手帐待办 — 入口 & 初始化
   ============================================ */

(function() {
  'use strict';

  // 确保 model 和 store 可用
  if (typeof Store === 'undefined') {
    console.error('Store not loaded');
    return;
  }

  // 加载已保存的语言并初始化语言选择器
  I18n.loadSaved();
  I18n.initSelector();
  I18n.apply();

  // 初始化渲染器
  Renderer.init();

  // 初始化时钟
  Clock.init();

  // 初始化 UI 事件
  UI.init();

  // 首次渲染
  UI.render();

})();
