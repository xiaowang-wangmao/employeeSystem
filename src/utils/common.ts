
import { defHttp } from "../utils/axios";
import { getDayList } from '@/api/common';
import { message } from 'ant-design-vue';

export const getDateList = () => {
  getDayList({}).then((res) => {
    return res;
  })
}


// 下载public里面文件模板
export const handleExportTemplate = (url, downloadName) => {
  const xhr = new XMLHttpRequest();
  // get后边是public文件夹下需要下载的模板的文件名
  xhr.open('get', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function download() {
    if (this.status === 200) {
      const downloadElement = document.createElement('a');
      const href = window.URL.createObjectURL(this.response);
      downloadElement.href = href;
      // 这个也是文件名
      downloadElement.download = downloadName;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      window.URL.revokeObjectURL(href);
    }
  };
  xhr.send();
};

export const getFileblob = (url, parameter) => defHttp.get(
  {
    url,
    params: parameter,
    responseType: 'blob',
  },
  { isTransformResponse: false },
);

/**
 * 下载文件
 * @param url 文件路径
 * @param fileName 文件名
 * @param parameter
 * @returns {*}
 */
export const downloadFile = (_url, fileName?, parameter?) => getFileblob(
  _url,
  parameter,
).then((data) => {
  if (!data || data.size === 0) {
    message.warning("下载失败");
    return;
  }
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // 下载完成移除元素
  window.URL.revokeObjectURL(url); // 释放掉blob对象
});

