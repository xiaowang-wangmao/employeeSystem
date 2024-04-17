import { defHttp } from "../utils/axios";

export const getSystemNoticeList = (params: any) =>
  defHttp.get({ url: '/notice/list', params }).then((res) => {
    return res.data;
  });