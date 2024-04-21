
import { defHttp } from "../utils/axios";
export interface loginReq {
    account: string;  //账号
    password: string;  //密码
}
//登录
export const login = (params: any) =>
    defHttp.post({ url: '/login', params });

