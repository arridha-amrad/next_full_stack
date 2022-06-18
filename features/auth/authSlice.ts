import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { IUser } from "../../types";

export interface IAuthState {
   token: string | null;
}

const initialState: IAuthState = {
   token: null,
};

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      setToken: (state, action) => {
         const { accessToken } = action.payload;
         state.token = accessToken;
      },
      logout: (state) => {
         state.token = null;
      },
   },
});

export const { logout, setToken } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
