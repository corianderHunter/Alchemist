import router from '@/router';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Notification } from 'element-ui';
import { clearToken, token } from './../token';
import store from '@/store'
import { ABANDON_MARK, isOverCallRequest } from './fetchDebounce';

const COMMON_NOTIFICATION = '请求异常，请稍后再试！'

const unAuthReponseCodes = [1003]

const serviceWhite = ['/exportList']

const checkServiceWhite = (url: string) => {
  for (const value of serviceWhite) {
    if (url.indexOf(value) > -1) {
      return true
    }
  }
  return false
}

let lastFetchTime: number;

const openFetching = () => {
  lastFetchTime = Date.now();
  store.commit('setMainFetching', true);
}

const closeFetching = () => {
  if (Date.now() - lastFetchTime < 300) {
    setTimeout(() => {
      store.commit('setMainFetching', false);
    }, 300 - Date.now() + lastFetchTime)
  } else {
    store.commit('setMainFetching', false);
  }


}


const requestSuccess = (config: AxiosRequestConfig) => {
  if (isOverCallRequest(config)) {
    return Promise.reject({ mark: ABANDON_MARK, url: config.url });
  }
  openFetching()
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
}

const requestError = (error: any) => {
  return Promise.reject(error);
}

const responseSuccess = (response: AxiosResponse<any>) => {
  closeFetching();
  if (checkServiceWhite(response.config.url || '')) {
    return response;
  }
  const { data = {} } = response
  const { code, message, success } = data
  if (!success || unAuthReponseCodes.includes(code)) {
    Notification.error({ title: '失败', message: message || COMMON_NOTIFICATION });
    if (unAuthReponseCodes.includes(code)) {
      clearToken()
      router.push({ name: 'Login' })
    }
    return Promise.reject(response);
  }
  return response;
}

const responseError = (error: any) => {
  closeFetching();
  if (error?.mark === ABANDON_MARK) {
    return Promise.reject(error);
  }
  Notification.error({ title: '失败', message: COMMON_NOTIFICATION });
  return Promise.reject(error);
}

export {
  requestSuccess,
  requestError,
  responseSuccess,
  responseError
}
