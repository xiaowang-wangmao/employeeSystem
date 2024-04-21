import { defineStore } from 'pinia';
import store  from '@/store/index';

export interface tokenValue {
    token: string | null;
}
export interface accountValue {
    // account: string;
    userName: string;
    staffCode: string;
    roleId: number|undefined;
}

export const tokenStore = defineStore({
    id: 'app-token',
    state: (): tokenValue => ({
        token: localStorage.getItem('token'),
    }),
    getters: {
        getToken(): any{
            return this.token;
        },
    },
    // actions: {
    //     setToken(token: string) {
    //         this.token = token;
    //     },
    // },
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

// Need to be used outside the setup
export function tokenStoreWidthOut() {
    return tokenStore(store);
}
export function accountStoreWidthOut() {
    return accountStore(store);
}
