import { defineStore } from 'pinia';
import { store } from '@/store/index';

export interface tokenValue {
    token: string;
}
export interface accountValue {
    account: string;
}
export interface loginStatus {
    isLogin: boolean;
}

export const tokenStore = defineStore({
    id: 'app-token',
    state: (): tokenValue => ({
        token: '',
    }),
    getters: {
        getToken(): string {
            return this.token;
        },
    },
    actions: {
        setToken(token: string) {
            this.token = token;
        },
    },
    persist: {
        enabled: true,
        strategies: [
          {
            key: 'token',  //自定义 Key值
            storage: localStorage,  // 选择存储方式
            paths: ['token']
          },
        ],
      },
});
export const accountStore = defineStore({
    id: 'app-account',
    state: (): accountValue => ({
        account: '',
    }),
    getters: {
        getAccount(): string {
            return this.account;
        },
    },
    actions: {
        setAccount(account: string) {
            this.account = account;
        },
    },
    persist: {
        enabled: true,
        strategies: [
          {
            key: 'account',  //自定义 Key值
            storage: localStorage,  // 选择存储方式
            paths: ['account']
          },
        ],
      },
});
export const loginStore = defineStore({
    id: 'app-login',
    state: (): loginStatus => ({
        isLogin: null!,
    }),
    getters: {
        getLoginStatus(): boolean {
            return this.isLogin;
        },
    },
    actions: {
        setLoginStatus(isLogin: boolean) {
            this.isLogin = isLogin;
        },
    },
    persist: {
        enabled: true,
        strategies: [
          {
            key: 'isLogin',  //自定义 Key值
            storage: localStorage,  // 选择存储方式
            paths: ['isLogin']
          },
        ],
      },
});

// Need to be used outside the setup
export function tokenStoreWidthOut() {
    return tokenStore(store);
}
export function accountStoreWidthOut() {
    return accountStore(store);
}
export function loginStoreWidthOut() {
    return loginStore(store);
}