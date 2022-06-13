import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import config from "../config";
import { accTokenCookieSetter, refTokenCookieSetter } from "./cookieSetter";

const axiosSSR = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: true,
});

const fetchSSR = (
  req: IncomingMessage & { cookies: NextApiRequestCookies },
  res: ServerResponse,
  url: string,
  refToken: string,
  accToken: string
) => {
  const initAxiosSSR = () => {
    axiosSSR.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        config.headers!["Content-Type"] = "application/json";
        config.headers!.Authorization = accToken;
        return config;
      },
      (error) => {
        console.log("err status : ", error.response.status);
        Promise.reject(error);
      }
    );
    axiosSSR.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: any) => {
        if (error.response.status === 401) {
          let prevRequest = error.config;
          console.log("==================current refToken value : ", req.cookies.refToken);

          return axiosSSR
            .get("/api/users/refreshToken", {
              headers: {
                cookie: refToken,
              },
            })
            .then(async (response) => {
              console.log("================== ref token result of axios interceptor : ", response.data);
              const { accToken, refToken } = response.data;
              const refTokenCookie = refTokenCookieSetter(refToken);
              const accTokenCookie = accTokenCookieSetter(accToken);
              prevRequest.headers.authorization = accToken;
              prevRequest.headers.cookie = refToken;
              res.setHeader("Set-Cookie", [refTokenCookie, accTokenCookie]);
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
    return axiosSSR;
  };
  return initAxiosSSR().get(url);
};

export default fetchSSR;
