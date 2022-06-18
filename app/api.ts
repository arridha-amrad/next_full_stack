import { BaseQueryApi } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setToken } from "../features/auth/authSlice";
import { RootState } from "./store";

const baseQuery = fetchBaseQuery({
   baseUrl: "http://localhost:3000/api/",
   credentials: "include",
   prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
         headers.set("authorization", token);
      }
      return headers;
   },
});

const baseQueryWithReauth = async (args: any, api: BaseQueryApi, extraOptions: any) => {
   let result = await baseQuery(args, api, extraOptions);
   const error = result?.error as any;
   if (error?.originalStatus === 401) {
      const refreshResult = (await baseQuery("users/refreshToken", api, extraOptions)) as any;
      if (refreshResult?.data) {
         api.dispatch(
            setToken({
               accessToken: refreshResult.data.accToken,
            })
         );
         result = await baseQuery(args, api, extraOptions);
      } else {
         api.dispatch(logout());
         window.location.href = "/login";
      }
   }
   return result;
};

export const api = createApi({
   reducerPath: "api",
   tagTypes: ["User", "Todos", "Todo"],
   baseQuery: baseQueryWithReauth,
   endpoints: (builder) => ({}),
});
