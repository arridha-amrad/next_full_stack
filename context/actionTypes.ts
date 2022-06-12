import { User } from "@prisma/client";

const SET_USER = "SET_USER";
const UNSET_USER = "UNSET_USER";

export type ActionTypes =
   | { type: typeof SET_USER; payload: User }
   | { type: typeof UNSET_USER };
