import { Todo } from "@prisma/client";
import { IUser } from "../types";

export const SET_USER = "SET_USER";
export const SET_TOKEN = "SET_TOKEN";
export const LOGOUT = "LOGOUT";
export const SET_TODOS = "SET_TODOS";
export const ADD_TODO = "ADD_TODO";

export type ActionTypes =
   | { type: typeof SET_TODOS; payload: Todo[] }
   | { type: typeof ADD_TODO; payload: Todo }
   | { type: typeof SET_USER; payload: IUser }
   | { type: typeof SET_TOKEN; payload: string }
   | { type: typeof LOGOUT };

export interface IState {
   user: IUser | null;
   token: string;
   todos: Todo[];
}

export type Dispatch = (action: ActionTypes) => void;
