import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia=createPinia()

pinia.use(piniaPluginPersistedstate)


export default pinia



//管理其他仓库

export * from './user'

