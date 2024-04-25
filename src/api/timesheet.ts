import { defHttp } from "../utils/axios";

export const delareTimesheet = (params: any) =>
  defHttp.post({ url: '/timesheet/declare', params }).then((res) => {
    return res.data;
  });

export const editTimesheet = (params: any) =>
  defHttp.post({ url: '/timesheet/editDeclare', params }).then((res) => {
    return res.data;
  });

export const getTimeSheetList = (params: any) =>
  defHttp.get({ url: '/timesheet/getTimeSheetList', params }).then((res) => {
    return res.data;
  });
export const getApprovalTimeSheetList = (params: any) =>
  defHttp.get({ url: '/timesheet/getApprovalTimeSheetList', params }).then((res) => {
    return res.data;
  });

export const getProjectList = (params: any) =>
  defHttp.get({ url: '/project/list', params }).then((res) => {
    return res.data;
  });

export const getStaffList = (params: any) =>
  defHttp.get({ url: '/staffInfo/list', params }).then((res) => {
    return res.data;
  });

export const getTimeSheetDetail = (params: any) =>
  defHttp.get({ url: '/timesheet/timeSheetDetail', params }).then((res) => {
    return res.data;
  });

export const getTimeSheetPage = (params: any) =>
  defHttp.post({ url: '/timesheet/page', params }).then((res) => {
    return res.data;
  });


  