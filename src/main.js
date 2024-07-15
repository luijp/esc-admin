import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './reset.css'
import routes from './routes.js'
import {createRouter, createWebHistory} from "vue-router";
import {createPinia} from 'pinia'
import setTitle from './util/setTitle.js'

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
const router = createRouter({
    history: createWebHistory('/admin/'),
    routes,
})
router.afterEach((to, from) => {
    if (to.meta.title) {
        setTitle.routeTitle.value = to.meta.title
    }
})
const pinia = createPinia()
app.use(ElementPlus)
    .use(router)
    .use(pinia)
    .mount('#app')
