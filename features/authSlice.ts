import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { IUser } from "../context/IContext";

export interface IAuthState {
  user: IUser | null;
  token: string | null;
}

const initialState: IAuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.user = user;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { logout, setCredentials, setToken } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
