import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import config from "../config";

const baseURL = config.BASE_URL;

let token = "";
let refToken = "";
let refTokenAfterRefresh = "";
let accTokenAfterRefresh = "";

export const getToken = () => token;
export const setToken = (newToken: string) => (token = newToken);

export const getRefToken = () => refToken;
export const setRefToken = (newToken: string) => (refToken = newToken);

export const setRefTokenAfterRefresh = (token: string) => (refTokenAfterRefresh = token);
export const getRefTokenAfterRefresh = () => refTokenAfterRefresh;

export const setAccTokenAfterRefresh = (token: string) => (accTokenAfterRefresh = token);
export const getAccTokenAfterRefresh = () => accTokenAfterRefresh;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers!["Content-Type"] = "application/json";
    config.headers!["Authorization"] = getToken();
    return config;
  },
  (error) => {
    console.log("err status : ", error.response.status);
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {
    if (error.response.status === 401) {
      let prevRequest = error.config;
      // console.log("prev request of ax interceptor : ", prevRequest);

      return axiosInstance
        .get("/api/users/refreshToken", {
          headers: {
            cookie: getRefToken(),
          },
        })
        .then((response) => {
          const { accToken, refToken } = response.data;
          prevRequest.headers.authorization = accToken;
          setRefTokenAfterRefresh(refToken);
          setAccTokenAfterRefresh(accToken);
          return axios(prevRequest);
        })
        .catch((err) => {
          console.log("err from interceptor : ", err.response.data);
          return Promise.reject(err);
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
