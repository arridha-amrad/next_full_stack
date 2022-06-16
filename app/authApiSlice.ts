import { BaseQueryApi } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUser } from "../context/IContext";
import { logout, setToken } from "../features/authSlice";
import { ILoginDTO } from "../pages/api/login";
import { IRegisterDTO } from "../pages/api/register";
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

const baseQueryWithReauth = async (
  args: any,
  api: BaseQueryApi,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);
  const error = result?.error as any;
  if (error?.originalStatus === 401) {
    const refreshResult = (await baseQuery(
      "users/refreshToken",
      api,
      extraOptions
    )) as any;
    if (refreshResult?.data) {
      api.dispatch(
        setToken({
          accessToken: refreshResult.data.accToken,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

interface ILoginResponse {
  user: IUser;
  accessToken: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["User"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUser: builder.query<IUser, void>({
      query: () => "users/me",
      transformResponse: (response: { user: IUser }, meta, arg) =>
        response.user,
      providesTags: () => ["User"],
    }),
    login: builder.mutation<ILoginResponse, ILoginDTO>({
      query: (credentials: ILoginDTO) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<string, void>({
      query: () => "/users/logout",
    }),
    register: builder.mutation<ILoginResponse, IRegisterDTO>({
      query: (credentials: IRegisterDTO) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} = userApi;
