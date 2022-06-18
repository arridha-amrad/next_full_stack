import { User } from "@prisma/client";
import { IncomingMessage } from "http";

export interface IAlert {
   type: "success" | "danger";
   message: string;
}

export interface IAccTokenPayload {
   userId: string;
}

export interface IRefTokenPayload {
   email: string;
}

export type IUser = Omit<User, "password">;
