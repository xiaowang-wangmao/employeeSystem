import { defineStore } from 'pinia';
import { store } from '@/store/index';
//存储全部菜单名称和地址
export interface globalRoutes {
    globalRoutes: Array<routeArray>;
}
export interface routeArray {
    title:String;
    path:String;
}
export const routesStore = defineStore({
    id: 'app-routes',
    state: (): globalRoutes => ({
        globalRoutes: [],
    }),
    getters: {
        getRoutes(): Array<routeArray> {
            return this.globalRoutes;
        },
    },
    actions: {
        setRoutes(globalRoutes: Array<routeArray>) {
            this.globalRoutes = globalRoutes;
        },
    },
    persist: {
        enabled: true,
        strategies: [
          {
            key: 'globalRoutes',  //自定义 Key值
            storage: localStorage,  // 选择存储方式
            paths: ['globalRoutes']
          },
        ],
      },
});
//进入过的菜单
export interface globalRoute {
    globalRoute:{title:String;path:String}[];
}

export const routeStore = defineStore({
    id: 'app-route',
    state: (): globalRoute => ({
        globalRoute: [],
    }),
    getters: {
        getRoute(): {title:String;path:String}[] {
            return this.globalRoute;
        },
    },
    actions: {
        pushRoute(globalRoute: {title:String;path:String}) {
            this.globalRoute.push(globalRoute);
        },
    },
    persist: {
        enabled: true,
        strategies: [
          {
            key: 'globalRoute',  //自定义 Key值
            storage: localStorage,  // 选择存储方式
            paths: ['globalRoute']
          },
        ],
      },
});
//当前菜单
export interface nowPageValue {
    nowPage:String;
}
export const nowPageStore = defineStore({
    id: 'app-nowPage',
    state: (): nowPageValue => ({
        nowPage: '',
    }),
    getters: {
        getNowPage(): String {
            return this.nowPage;
        },
    },
    actions: {
        setNowPage(nowPage: String) {
            this.nowPage=nowPage;
        },
    },
    persist: {
        enabled: true,
        strategies: [
          {
            key: 'nowPage',  //自定义 Key值
            storage: localStorage,  // 选择存储方式
            paths: ['nowPage']
          },
        ],
      },
});

export function routesStoreWidthOut() {
    return routesStore(store);
}
export function routeStoreWidthOut() {
    return routeStore(store);
}
export function nowPageStoreWidthOut() {
    return nowPageStore(store);
}