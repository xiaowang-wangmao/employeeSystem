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
        component: () => import('@/views/timeSheet/index.vue'),
        children: [
            { path: '', redirect: '/timeSheet/FillDailyTimeSheet' },// 默认指向
            {
                path: 'FillDailyTimeSheet',
                name: 'fillDaily',
                meta: {
                    title: ''
                },
                component: () => import('@/views/timeSheet/FillTable.vue'),
            },
            {
                path: 'Approval,',
                name: 'approval',
                meta: {
                    title: ''
                },
                component: () => import('@/views/timeSheet/Approval.vue'),
            },
            {
                path: 'MyList',
                name: 'myList',
                meta: {
                    title: ''
                },
                component: () => import('@/views/timeSheet/MyRecord.vue'),
            },
            {
                path: 'FillOT',
                name: 'fillOT',
                meta: {
                    title: ''
                },
                component: () => import('@/views/timeSheet/FillOT.vue'),
            },
            {
                path: 'AllTimeSheetList',
                name: 'AllTimeSheetList',
                meta: {
                    title: ''
                },
                component: () => import('@/views/timeSheet/AllTimeSheet.vue'),
            },

        ],
    },
    {
        path: '/employeeMsg',
        name: 'employeeMsg',
        meta: {
            title: '个人信息'
        },
        component: () => import('@/views/employeeMsg/index.vue'),
        children: [
            { path: '', redirect: '/employeeMsg/BasicInformation' },// 默认指向
            {
                path: 'BasicInformation',
                name: 'BasicInformation',
                meta: {
                    title: ''
                },
                component: () => import('@/views/employeeMsg/BasicInfo.vue'),
            },
            {
                path: 'EmergencyContact',
                name: 'EmergencyContact',
                meta: {
                    title: ''
                },
                component: () => import('@/views/employeeMsg/EmergencyContact.vue'),
            },
            {
                path: 'EducationBackground',
                name: 'EducationBackground',
                meta: {
                    title: ''
                },
                component: () => import('@/views/employeeMsg/EducationBg.vue'),
            },
            {
                path: 'Professional',
                name: 'Professional',
                meta: {
                    title: ''
                },
                component: () => import('@/views/employeeMsg/Professional.vue'),
            },
            {
                path: 'BankAccount',
                name: 'BankAccount',
                meta: {
                    title: ''
                },
                component: () => import('@/views/employeeMsg/BankAccount.vue'),
            },
            {
                path: 'Payslip',
                name: 'Payslip',
                meta: {
                    title: ''
                },
                component: () => import('@/views/employeeMsg/Payslip.vue'),
            },

        ]
    },
    {
        path: '/onboard',
        name: 'onboard',
        meta: {
            title: '培训'
        },
        component: () => import('@/views/onboarding/index.vue')
    },
    {
        path: '/leave',
        name: 'leave',
        meta: {
            title: '休假'
        },
        component: () => import('@/views/leave/index.vue')
    },
]

// 路由对象
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router