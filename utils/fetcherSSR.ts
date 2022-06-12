import axios, { AxiosResponse } from "axios";
import { IncomingMessage, ServerResponse } from "http";
import config from "../config";

const axiosSSR = axios.create({
   baseURL: config.BASE_URL,
   withCredentials: true,
});

export type QueryResponse<T> = [error: string | null, data: T | null];

async function refreshToken(req: IncomingMessage, res: ServerResponse) {
   const response = await axiosSSR.get("/api/users/refreshToken", {
      headers: {
         cookie: req.headers.cookie!,
      },
   });
   console.log("-----------response-------------: ", response);

   // const cookies = response.headers["set-cookie"] as unknown;
   // const myCookie = cookies as string;
   // req.headers.cookie = myCookie;
   // res.setHeader("Set-cookie", cookies as string);
}

const handleRequest = async <T>(
   req: IncomingMessage,
   res: ServerResponse,
   request: () => Promise<AxiosResponse<T, any>>
) => {
   try {
      return request();
   } catch (err: any) {
      console.log("in err : ", err);

      if (err.response.status === 401) {
         await refreshToken(req, res);
         return request();
      }
      throw new Error("Error occured");
   }
};

export default async function fetcherSSR<T>(
   req: IncomingMessage,
   res: ServerResponse,
   url: string
) {
   try {
      const request = async () =>
         await axiosSSR.get<T>(url, {
            headers: { cookie: req.headers.cookie ?? "" },
         });
      console.log("this line below execute");

      const { data } = await handleRequest<T>(req, res, request);
      return data;
   } catch (err: any) {
      console.log("err config : ", err.config);
      if (err.response.status === 401) {
         try {
            await refreshToken(req, res);
         } catch (err: any) {
            console.log(err.response);
         }
      }
   }
}
