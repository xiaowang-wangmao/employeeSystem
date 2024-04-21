import { defHttp } from "../utils/axios";

export const getStaffInfo = (params: any) =>
  defHttp.get({ url: '/staffInfo/staff', params }).then((res) => {
    return res.data;
  });

export const updateBank = (params: any) =>
  defHttp.post({ url: '/staffInfo/updateBankAccount', params }).then((res) => {
    return res.data;
  });

export const updateBasic = (params: any) =>
  defHttp.post({ url: '/staffInfo/updateBasic', params }).then((res) => {
    return res.data;
  });
export const updatePassport = (params: any) =>
  defHttp.post({ url: '/staffInfo/updatePassport', params }).then((res) => {
    return res.data;
  });
export const updateContact = (params: any) =>
  defHttp.post({ url: '/staffInfo/updateContact', params }).then((res) => {
    return res.data;
  });