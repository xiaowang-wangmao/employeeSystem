import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import Particles from 'particles.vue3'
import store from "./store/index";

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径而来
  //next() 代表放行 next('xxx') 强制放行的xxx的路径
  if (to.path === '/' || to.path === '/login') {
    next();
  } else {
    const tokenStr = window.localStorage.getItem('token')

    if (!tokenStr) {
      return next('/login')
    }
    next();
  }
})

const app = createApp(App)
app.use(Particles)
app.use(router)
app.use(store);
app.mount('#app')
