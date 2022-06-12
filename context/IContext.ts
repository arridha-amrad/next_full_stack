import { User } from "@prisma/client";
import { ActionTypes } from "./actionTypes";

export type IUser = Omit<User, "password">;

export type IDispatch = (action: ActionTypes) => void;

export interface IState {
   user: IUser | null;
}
