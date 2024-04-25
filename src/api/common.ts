import { defHttp } from "../utils/axios";

export const getDayList = (params: any) =>
  defHttp.get({ url: '/test/getAllDayList', params }).then((res) => {
    return res.data;
  });