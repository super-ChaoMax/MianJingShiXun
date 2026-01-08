import axios from "axios";
// 导入自定义 Loading 函数
import { showLoading, hideLoading } from './loading.js';


// 创建 Axios 实例
const instance = axios.create({
  baseURL: 'https://interview-api-t.itheima.net',
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' }
});

// 请求计数：避免并发请求重复显示/关闭 Loading
let requestCount = 0;

// 封装显示 Loading 的逻辑
const showLoadingHandler = () => {
  if (requestCount === 0) {
    showLoading('正在请求...'); // 自定义加载文案
  }
  requestCount++;
};

// 封装关闭 Loading 的逻辑
const hideLoadingHandler = () => {
  requestCount--;
  if (requestCount <= 0) {
    requestCount = 0;
    hideLoading();
  }
};

// 请求拦截器：发送请求前显示 Loading
instance.interceptors.request.use(
  (config) => {
      showLoadingHandler();

      // ----------------------------- 如果有登录的token值就存储起来 -----------------------------

      const userstoreJSON = localStorage.getItem('MJSX-userstore'); // 从本地存储取 MJSX-userstore
      // 关键修复：判断条件写反了！应该是「有值时」才解析，而非「无值时」
      if (userstoreJSON) { // 只有本地存储有数据时，才执行解析和设置Header
        try {
          const userstore = JSON.parse(userstoreJSON);
          // 额外容错：用可选链判断 token 是否存在，避免 userstore 解析后无 token 报错
          if (userstore?.token) {
            config.headers.Authorization = `Bearer ${userstore.token}`;
          }
        } catch (error) {
          console.error('解析用户信息失败：', error);
        }
      }





    return config;
  },
  (error) => {

    hideLoadingHandler(); // 请求失败也关闭 Loading




    return Promise.reject(error);
  }
);

// 响应拦截器：请求完成后关闭 Loading
instance.interceptors.response.use(
  (response) => {
    hideLoadingHandler();

    
    return response.data; // 直接返回响应体
  },
  (error) => {
    hideLoadingHandler(); // 响应失败也关闭 Loading
    // 错误提示（可替换为你的 Toast 组件）
    const errMsg = !error.response 
      ? '网络异常，请检查网络' 
      : error.response.data?.msg || '请求失败，请稍后重试';
    console.error(errMsg);
    return Promise.reject(error);
  }
);

export default instance;