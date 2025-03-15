
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
const app = createApp(App)
app.use(ElementPlus)
Object.values(ElementPlusIconsVue).forEach(icon => {
    app.component(icon.name, icon)
})
app.use(router)
app.mount('#app')
