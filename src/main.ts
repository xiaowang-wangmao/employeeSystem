import { createApp } from 'vue'
import './style.css'
import App from './App.vue';
import router from './router'
import Particles from 'particles.vue3'
import store from "./store/index";
import { message } from 'ant-design-vue';
import 'v-calendar/style.css';
import VCalendar from 'v-calendar';
// import vue3videoPlay from 'vue-video-play'; // 引入组件
// import 'vue3-video-play/dist/style.css';// 引入css
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'



//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径而来
  //next() 代表放行 next('xxx') 强制放行的xxx的路径
  if (to.path === '/' || to.path === '/login') {
    next();
  } else {
    const tokenStr = window.localStorage.getItem('token')
    // const vuexData = tokenStore().getToken;

    if (!tokenStr) {
      message.error("请先登录");
      return next('/login')
    }
    next();
  }
})

const app = createApp(App)
app.use(Particles)
app.use(router)
app.use(store);
app.use(VCalendar, {});
// app.use(vue3videoPlay);
app.use(VueVideoPlayer)
app.mount('#app')
