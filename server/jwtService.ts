import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import { IAccTokenPayload, IRefTokenPayload } from "../types";

export const signAccToken = async (userId: string): Promise<string> => {
   return new Promise((resolve, reject) => {
      jwt.sign(
         { userId },
         process.env.ACC_SECRET_TOKEN!,
         {
            expiresIn: "20s",
         },
         (err, payload) => {
            if (err) {
               reject(err.message);
            }
            resolve(payload as string);
         }
      );
   });
};

export const verifyAccToken = async (
   token: string,
   res: NextApiResponse
): Promise<IAccTokenPayload> => {
   return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.ACC_SECRET_TOKEN!, { maxAge: "20s" }, (err, payload) => {
         if (err) {
            console.log(err.message);
            if (err.message === "jwt expired") {
               return res.status(401).send("token expired");
            } else {
               reject(err);
            }
         }
         resolve(payload as IAccTokenPayload);
      });
   });
};

export const signRefToken = async (email: string): Promise<string> => {
   return new Promise((resolve, reject) => {
      jwt.sign({ email }, process.env.REF_SECRET_TOKEN!, { expiresIn: "1y" }, (err, payload) => {
         if (err) {
            reject(err.message);
         }
         resolve(payload as string);
      });
   });
};

export const verifyRefToken = async (token: string): Promise<IRefTokenPayload> => {
   return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REF_SECRET_TOKEN!, { maxAge: "1y" }, (err, payload) => {
         if (err) {
            reject(err.message);
         }
         resolve(payload as IRefTokenPayload);
      });
   });
};
