import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

// 静态路由表
const routes: Array<RouteRecordRaw> = [
    {
        // 路由重定向配置
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: () => import('@/views/login/Login.vue')
    },
    {
        path: '/index',
        name: 'index',
        meta: {
            title: '首页'
        },
        component: () => import('@/views/home/index.vue')
    },
    {
        path: '/timeSheet',
        name: 'timeSheet',
        meta: {
            title: '工时表'
        },
        component: () => import('@/views/timeSheet/index.vue')
    },
]

// 路由对象
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router