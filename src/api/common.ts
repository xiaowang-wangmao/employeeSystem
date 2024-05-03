import { defHttp } from "../utils/axios";

export const getDayList = (params: any) =>
  defHttp.get({ url: '/test/getAllDayList', params }).then((res) => {
    return res.data;
  });

//文件上传->展示
export const uploadApi = (params: any = {}) => defHttp.post({
  url: '/files/upload',
  data: { ...params },
  headers: {
    'content-type': 'multipart/form-data',
  },
});

export const getFilesList = (params: any) =>
  defHttp.get({ url: '/files/list', params }).then((res) => {
    return res.data;
  });

export const deleteFile = (params: any) =>
  defHttp.get({ url: '/files/delete', params }).then((res) => {
    return res.data;
  });