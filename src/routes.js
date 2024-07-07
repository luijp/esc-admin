import Attach from './view/Attach/index.vue'
import Category from './view/Category/index.vue'
import Comment from './view/Comment/index.vue'
import Post from './view/Post/index.vue'
import Setting from './view/Setting/index.vue'
import Tag from './view/Tag/index.vue'
import Dashboard from './view/Dashboard/index.vue'
import Login from './view/Login/index.vue'

const routes = [
    { path: '/', component: Dashboard },
    { path: '/post', component: Post },
    { path: '/category', component: Category },
    { path: '/attach', component: Attach },
    { path: '/comment', component: Comment },
    { path: '/setting', component: Setting },
    { path: '/tag', component: Tag },
    { path: '/login', component: Login },
]

export default routes