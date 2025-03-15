import axios from "axios";

const service = axios.create({
  baseURL: "http://localhost:3000", 
  timeout: 5000, 
});


service.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = "Bearer your-token";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("API 请求错误:", error);
    return Promise.reject(error);
  }
);

export default service;
