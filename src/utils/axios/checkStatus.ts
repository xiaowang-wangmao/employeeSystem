import type { ErrorMessageMode } from '../../types/axios';
// import router from '/@/router';
// import { useUserStoreWithOut } from '/@/store/modules/user';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { log } from 'console';
import { h } from 'vue';
const  showMessageModal = Modal.confirm
const showMessage  = message.error;
// const error = createMessage.error!;

export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message',
): void {

  // const userStore = useUserStoreWithOut();
  let errMessage = '';

  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      console.log("dsdd",msg)
      // userStore.setToken(undefined);
      errMessage = msg || '很抱歉，您没有权限（令牌、用户名、密码错误）！';
      // if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
      //   userStore.setSessionTimeout(true);
      // } else {
      //   userStore.logout(true);
      // }
      break;
    case 403:
      errMessage = msg || '很抱歉，您没有权限访问此页面，若有疑问请联系管理员。';
      break;
    // 404请求不存在
    case 404:
      errMessage = msg || '网络请求错误，未找到该资源！';
      break;
    case 405:
      errMessage = msg || '网络请求错误，请求方法未允许！';
      break;
    case 408:
      errMessage = msg || '网络请求超时！';
      break;
    case 500:
      errMessage = msg || '服务器错误，请联系管理员';
      break;
    case 501:
      errMessage = msg || '网络未实现';
      break;
    case 502:
      errMessage = msg || '网络错误';
      break;
    case 503:
      errMessage = msg || '服务不可用，服务器暂时过载或维护';
      break;
    case 504:
      errMessage = msg || '网络超时';
      break;
    case 505:
      errMessage = msg || 'http版本不支持该请求';
      break;
    default:
  }

  if (errMessage) {
    if (errorMessageMode === 'modal') {
      showMessageModal({ title: '错误提示', icon: h(ExclamationCircleOutlined), content: errMessage });
    } else if (errorMessageMode === 'message') {
      showMessage(errMessage);
    }
  }
}
