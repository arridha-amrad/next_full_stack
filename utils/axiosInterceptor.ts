import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import config from "../config";

const baseURL = config.BASE_URL;

let token = "";
let refToken = "";

export const getToken = () => token;
export const setToken = (newToken: string) => (token = newToken);

export const getRefToken = () => refToken;
export const setRefToken = (newToken: string) => (refToken = newToken);

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
         console.log("prev request of ax interceptor : ", prevRequest);

         return axiosInstance
            .get<{ token: string }>("/api/users/refreshToken", {
               headers: {
                  cookie: getRefToken(),
               },
            })
            .then((response) => {
               console.log(
                  "================== ref token result of axios interceptor : ",
                  response.data
               );
               prevRequest.headers.cookie = response.data.token;

               // prevRequest.headers["Authorization"] = data.token;
               return axios(prevRequest);
            })
            .catch((err) => {
               console.log("err from interceptor : ", err.response.data);
               // if (err.response.status === 500) {
               //    const pathname = window.location.pathname;
               //    window.location.href = `/login?e=You need to login to perform this action&next=${pathname}`;
               // }
               return Promise.reject(err);
            });
      }
      return Promise.reject(error);
   }
);

export default axiosInstance;
