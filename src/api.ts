import axios, {AxiosInstance} from 'axios';

const REQUEST_TIMEOUT = 5000;
const BASE_URL = 'https://15.design.htmlacademy.pro/six-cities';

function createAPI(): AxiosInstance {
  return axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
  });
}

export {createAPI};
