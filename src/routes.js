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
import Page from './view/Page/index.vue'
import Micro from './view/Micro/index.vue'
import ListGallery from './view/Gallery/comment/ListGallery.vue'
import UpdateGallery from "./view/Gallery/comment/UpdateGallery.vue";

const routes = [
    {
        component: Admin,
        path: '/',
        children: [
            {path: '/', redirect: '/dashboard'},
            {path: '/dashboard', component: Dashboard, meta: {title: 'Dashboard'}},
            {
                path: '/post',
                children: [
                    {path: '/post/update/:id', component: UpdatePost, meta: {title: '更新文章'}},
                    {path: '/post/update', component: UpdatePost, meta: {title: '新文章'}},
                    {path: '/post', component: ListPost, meta: {title: '文章列表'}},
                ]
            },
            {path: '/page', component: Page, meta: {title: '页面管理'}},
            {path: '/micro', component: Micro, meta: {title: '碎语管理'}},
            {path: '/category', component: Category, meta: {title: '分类管理'}},
            {path: '/attach', component: Attach, meta: {title: '附件管理'}},
            {path: '/comment', component: Comment, meta: {title: '评论管理'}},
            {path: '/setting', component: Setting, meta: {title: '设置'}},
            {path: '/tag', component: Tag, meta: {title: '标签管理'}},
            {path: '/gallery',
                children: [
                    {path: '/gallery/update', component: UpdateGallery, meta: {title: '新建相册'}},
                    {path: '/gallery/update/:id', component: UpdateGallery, meta: {title: '编辑相册'}},
                    {path: '/gallery', component: ListGallery, meta: {title: '相册列表'}},
                ]
            },
        ]
    },
    {path: '/logout', component: Logout},
]

export default routes