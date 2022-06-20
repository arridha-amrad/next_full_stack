import axios from "axios";
import { getToken, setToken } from "./token";

const baseURL = "http://localhost:3000/api";

const axiosInstance = axios.create({
   baseURL,
   withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
   config.headers!["Content-Type"] = "application/json";
   config.headers!.authorization = getToken();
   return config;
});
axiosInstance.interceptors.response.use(
   (response) => response,
   async (error) => {
      if (error.response.status === 401) {
         const prevRequest = error.config;
         return axiosInstance
            .get("/users/refreshToken")
            .then(({ data }) => {
               setToken(data.accToken);
               prevRequest.headers.authorization = data.accToken;
               return axios(prevRequest);
            })
            .catch((err) => {
               console.log("err from interceptor : ", err.response.data);
               const pathname = window.location.pathname;
               window.location.href = `/login?e=You need to login to perform this action&next=${pathname}`;

               return Promise.reject(err);
            });
      }
      return Promise.reject(error);
   }
);
export default axiosInstance;
