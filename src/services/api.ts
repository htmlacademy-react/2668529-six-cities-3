import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import {getToken} from './token.ts';

const REQUEST_TIMEOUT = 5000;
const BASE_URL = 'https://15.design.htmlacademy.pro/six-cities';

function createAPI(): AxiosInstance {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers['X-Token'] = token;
    }

    return config;
  });

  return api;
}

export {createAPI};
