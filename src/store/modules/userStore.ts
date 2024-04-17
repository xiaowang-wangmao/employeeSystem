import { defineStore } from 'pinia';
import store  from '@/store/index';

export interface tokenValue {
    token: string;
}
export interface accountValue {
    // account: string;
    userName: string;
    staffCode: string;
    roleId: number|undefined;
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
});
export const accountStore = defineStore({
    id: 'app-account',
    state: (): accountValue => ({
        userName: '',
        staffCode: '',
        roleId:undefined,
    }),
    getters: {
        getAccount(): string {
            return this.userName;
        },
        getStaffCode(): string{
            return this.staffCode;
        },
        getRole() :any{
            return this.roleId;
        }
    },
    actions: {
        setAccount(userName: string) {
            this.userName = userName;
        },
        setStaffCode(code: string) {
            this.staffCode = code;
        },
        setRoleId(id: any) {
            this.roleId = id; 
        }
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
