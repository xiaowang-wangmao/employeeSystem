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

export const updateEducation = (params: any) =>
  defHttp.post({ url: '/staffInfo/updateEducation', params }).then((res) => {
    return res.data;
  });
export const deleteEducation = (params: any) =>
  defHttp.get({ url: '/staffInfo/deleteEducation', params }).then((res) => {
    return res.data;
  });

export const deleteContact = (params: any) =>
  defHttp.get({ url: '/staffInfo/deleteContact', params }).then((res) => {
    return res.data;
  });

export const updateContactList = (params: any) =>
  defHttp.post({ url: '/staffInfo/updateContactList', params }).then((res) => {
    return res.data;
  });

export const getStaffPage = (params: any) =>
  defHttp.post({ url: '/staffInfo/page', params }).then((res) => {
    return res.data;
  });

export const updateStaff = (params: any) =>
  defHttp.post({ url: '/staffInfo/updateStaff', params }).then((res) => {
    return res.data;
  });