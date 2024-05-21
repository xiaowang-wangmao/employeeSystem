import { defHttp } from "../utils/axios";


export const trainPage = (params: any) =>
  defHttp.post({ url: '/train/page', params }).then((res) => {
    return res.data;
  });

export const taskPage = (params: any) =>
  defHttp.post({ url: '/train/taskPage', params }).then((res) => {
    return res.data;
  });
export const myTaskPage = (params: any) =>
  defHttp.post({ url: '/train/myTaskPage', params }).then((res) => {
    return res.data;
  });

export const addPlan = (params: any) =>
  defHttp.post({ url: '/train/editPlan', params }).then((res) => {
    return res.data;
  });


export const bindTask = (params: any) =>
  defHttp.post({ url: '/train/bindTask', params }).then((res) => {
    return res.data;
  });

export const deletePlan = (params: any) =>
  defHttp.get({ url: '/train/deletePlan', params }).then((res) => {
    return res.data;
  });

export const planDetails = (params: any) =>
  defHttp.get({ url: '/train/planDetails', params }).then((res) => {
    return res.data;
  });
export const taskDetails = (params: any) =>
  defHttp.get({ url: '/train/taskDetails', params }).then((res) => {
    return res.data;
  });


export const uploadFile = (params: any = {}) => defHttp.post({
  url: '/train/upload',
  data: { ...params },
  headers: {
    'content-type': 'multipart/form-data',
  },
});

export const taskStatus = (params: any) =>
  defHttp.get({ url: '/train/taskStatus', params }).then((res) => {
    return res.data;
  });

export const getProblemList = (params: any) =>
  defHttp.get({ url: '/train/problemList', params }).then((res) => {
    return res.data;
  });

export const endTask = (params: any) =>
  defHttp.post({ url: '/train/endTask', params }).then((res) => {
    return res.data;
  });