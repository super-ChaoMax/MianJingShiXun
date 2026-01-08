
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores/index.js'

const app = createApp(App)

app.use(pinia)
app.use(router)

// 禁用 Vue 实例的 DevTools 调试能力（仅开发环境生效）
if (import.meta.env.DEV) {
  app.config.devtools = false;
}

app.mount('#app')
