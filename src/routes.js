import Attach from './view/Attach/index.vue'
import Category from './view/Category/index.vue'
import Comment from './view/Comment/index.vue'
import Post from './view/Post/index.vue'
import Setting from './view/Setting/index.vue'
import Tag from './view/Tag/index.vue'
import Dashboard from './view/Dashboard/index.vue'
import Admin from './view/Admin.vue'
import Logout from './view/Logout.vue'
import ListPost from "./view/Post/component/ListPost.vue"
import UpdatePost from "./view/Post/component/UpdatePost.vue"

const routes = [
    {
        component: Admin,
        path: '/',
        children:[
            { path: '/', redirect: '/dashboard' },
            { path: '/dashboard', component: Dashboard },
            { path: '/post', component: Post ,
            children:[
                { path: '/post/update/:id', component: UpdatePost },
                { path: '/post/update', component: UpdatePost },
                { path: '/post', component: ListPost },
            ]},
            { path: '/category', component: Category },
            { path: '/attach', component: Attach },
            { path: '/comment', component: Comment },
            { path: '/setting', component: Setting },
            { path: '/tag', component: Tag },
        ]
    },
    { path: '/logout', component: Logout },
]

export default routes