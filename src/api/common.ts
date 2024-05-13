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


export const projectPage = (params: any) =>
  defHttp.post({ url: '/project/page', params }).then((res) => {
    return res.data;
  });

export const updateProject = (params: any) =>
  defHttp.post({ url: '/project/updateProject', params }).then((res) => {
    return res.data;
  });

export const deleteProject = (params: any) =>
  defHttp.get({ url: '/project/delete', params }).then((res) => {
    return res.data;
  });

export const noticePage = (params: any) =>
  defHttp.post({ url: '/notice/page', params }).then((res) => {
    return res.data;
  });

export const updateNotice = (params: any) =>
  defHttp.post({ url: '/notice/updateNotice', params }).then((res) => {
    return res.data;
  });
export const deleteNotice = (params: any) =>
  defHttp.get({ url: '/notice/delete', params }).then((res) => {
    return res.data;
  });