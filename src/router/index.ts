import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
 
// 静态路由表
const routes: Array<RouteRecordRaw> = [
    {
        // 路由重定向配置
        path: '/',
        redirect: '/login'
    }, 
    {
        path: '/Home',
        component: () => import('@/components/HelloWorld.vue')
    },
    {
        path: '/login',
        component: () => import('@/views/login/Login.vue')
    },
    {
        path: '/regist',
        name: 'regist',
        meta: {
            title: '用户注册'
        },
        component: () => import('@/views/login/Regist.vue')
    },
]
 
// 路由对象
const router = createRouter({
    history: createWebHistory(),
    routes
})
 
export default router