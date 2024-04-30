import { defHttp } from "../utils/axios";

export const applicationOne = (params: any) =>
  defHttp.post({ url: '/application/one', params }).then((res) => {
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