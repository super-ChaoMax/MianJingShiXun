/**
 * 移动端全屏 Loading 封装
 * 功能：全屏遮罩、不可点击、自定义文案、单例模式（避免重复创建）
 * 方法：
 *   showLoading(message = '加载中...') - 开启 Loading
 *   hideLoading() - 关闭 Loading
 */

// 单例标识：避免重复创建 Loading 节点
let loadingInstance = null;

// 创建 Loading 节点的核心函数
const createLoadingNode = (message) => {
  // 1. 创建遮罩层（全屏、半透明、不可点击）
  const mask = document.createElement('div');
  mask.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    touch-action: none; /* 禁止移动端触摸交互 */
    pointer-events: none; /* 父层不拦截点击，但子层 Loading 容器可拦截 */
  `;

  // 2. 创建 Loading 容器（白色背景、圆角、加载动画）
  const loadingContainer = document.createElement('div');
  loadingContainer.style.cssText = `
    background: #fff;
    padding: 20px 30px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    pointer-events: auto; /* 容器内不可点击 */
  `;

  // 3. 创建加载动画（CSS 旋转动画，无需图片）
  const loadingIcon = document.createElement('div');
  loadingIcon.style.cssText = `
    width: 30px;
    height: 30px;
    border: 3px solid #eee;
    border-top-color: #1989fa; /* Vant 主题色，可自定义 */
    border-radius: 50%;
    animation: loading-rotate 1s linear infinite;
    margin-bottom: 10px;
  `;

  // 4. 创建加载文案
  const loadingText = document.createElement('div');
  loadingText.style.cssText = `
    font-size: 14px;
    color: #333;
    text-align: center;
  `;
  loadingText.innerText = message;

  // 5. 拼接节点
  loadingContainer.appendChild(loadingIcon);
  loadingContainer.appendChild(loadingText);
  mask.appendChild(loadingContainer);

  // 6. 添加旋转动画样式（避免全局污染）
  const style = document.createElement('style');
  style.id = 'loading-animation-style';
  style.innerHTML = `
    @keyframes loading-rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  return mask;
};

/**
 * 开启全屏 Loading
 * @param {string} message - 加载文案，默认「加载中...」
 */
export const showLoading = (message = '加载中...') => {
  // 单例模式：如果已有 Loading，先关闭再创建
  if (loadingInstance) {
    hideLoading();
  }
  // 创建节点并挂载到 body
  loadingInstance = createLoadingNode(message);
  document.body.appendChild(loadingInstance);
  // 禁止页面滚动
  document.body.style.overflow = 'hidden';
};

/**
 * 关闭全屏 Loading
 */
export const hideLoading = () => {
  if (loadingInstance) {
    // 移除 Loading 节点
    document.body.removeChild(loadingInstance);
    loadingInstance = null;
    // 恢复页面滚动
    document.body.style.overflow = '';
  }
};

// 防止页面卸载时残留 Loading
window.addEventListener('beforeunload', () => {
  hideLoading();
});