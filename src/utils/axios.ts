import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

axiosInstance.interceptors.request.use(config => ({
  ...config,
  headers: {
    ...config.headers,
    Authorization: localStorage.getItem('token'), // local api auth
  },
}));

export default axiosInstance;
