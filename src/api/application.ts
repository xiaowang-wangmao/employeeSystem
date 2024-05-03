import { defHttp } from "../utils/axios";

export const applicationOne = (params: any) =>
  defHttp.post({ url: '/application/one', params }).then((res) => {
    return res.data;
  });

export const ApplicationRevocation = (params: any) =>
  defHttp.post({ url: '/application/revocation', params }).then((res) => {
    return res.data;
  });
export const getApplicationOne = (params: any) =>
  defHttp.get({ url: '/application/getDetails', params }).then((res) => {
    return res.data;
  });

export const deleteApplicationOne = (params: any) =>
  defHttp.get({ url: '/application/delete', params }).then((res) => {
    return res.data;
  });

export const applicationPage = (params: any) =>
  defHttp.post({ url: '/application/page', params }).then((res) => {
    return res.data;
  });

export const approvalPage = (params: any) =>
  defHttp.post({ url: '/application/ApprovalPage', params }).then((res) => {
    return res.data;
  });

  //附件上传
export const uploadApi = (params: any = {}) => defHttp.post({
  url: '/application/upload',
  data: { ...params },
  headers: {
    'content-type': 'multipart/form-data',
  },
});

export const getProcessList = (params: any) =>
  defHttp.get({ url: '/process/getList', params }).then((res) => {
    return res.data;
  });

export const getImage = (params: any) =>
  defHttp.get({ url: '/application/files', params }).then((res) => {
    return res.data;
  });

export const pass = (params: any) =>
  defHttp.get({ url: '/process/pass', params }).then((res) => {
    return res.data;
  });
export const refuse = (params: any) =>
  defHttp.get({ url: '/process/refuse', params }).then((res) => {
    return res.data;
  });


export const getHolidays = (params: any) =>
  defHttp.get({ url: '/application/holidays', params }).then((res) => {
    return res.data;
  });