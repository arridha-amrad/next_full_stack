import { NextApiRequest, NextApiResponse } from "next";
import { verifyAccToken } from "../../../server/jwtService";
import prisma from "../../../server/prismaInstance";
import UserService from "../../../server/services/UserService";
import { IUser } from "../../../types";

export interface IMeResponse {
   user: IUser;
}

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse<IMeResponse | string>
) {
   const accToken = req.headers.authorization as string | undefined;
   console.log("accToken of me controller : ", accToken);

   try {
      if (!accToken) {
         return res.status(401).send("AccToken is required");
      }
      const { userId } = await verifyAccToken(accToken.split(" ")[1], res);
      const user = await UserService.findById(Number(userId));
      if (!user) {
         return res.status(404).send("User not found");
      }
      const { password, ...rest } = user;
      return res.status(200).json({ user: rest });
   } catch (err) {
      console.log(err);
      return res.status(500).send("Server Error");
   } finally {
      await prisma.$disconnect();
   }
}
