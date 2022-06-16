import { api } from "../../app/api";
import { IUser } from "../../context/IContext";
import { ILoginResponse } from "../../dto";
import { ILoginDTO } from "../../pages/api/login";
import { IRegisterDTO } from "../../pages/api/register";

export const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<IUser, void>({
      query: () => "users/me",
      transformResponse: (response: { user: IUser }, meta, arg) =>
        response.user,
      providesTags: () => ["User"],
    }),
    login: builder.mutation<ILoginResponse, ILoginDTO>({
      query: (credentials: ILoginDTO) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<string, void>({
      query: () => "/users/logout",
    }),
    register: builder.mutation<ILoginResponse, IRegisterDTO>({
      query: (credentials: IRegisterDTO) => ({
        url: "register",
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
} = authApiSlice;
