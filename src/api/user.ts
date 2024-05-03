
import { defHttp } from "../utils/axios";
export interface loginReq {
    account: string;  //账号
    password: string;  //密码
}
//登录
export const login = (params: any) =>
    defHttp.post({ url: '/login/index', params });

export const updatePassword = (params: any) =>
    defHttp.post({ url: '/login/update-password', params });



//账号信息导入
export const uploadApi = (params: any = {}) => defHttp.post({
    url: '/staffInfo/upload',
    data: { ...params },
    headers: {
        'content-type': 'multipart/form-data',
    },
});