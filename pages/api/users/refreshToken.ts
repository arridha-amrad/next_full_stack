import { NextApiRequest, NextApiResponse } from "next";
import { signAccToken, signRefToken, verifyRefToken } from "../../../server/jwtService";
import prisma from "../../../server/prismaInstance";
import RefTokenService from "../../../server/services/RefTokenService";
import UserService from "../../../server/services/UserService";
import cookieGetter from "../../../utils/cookieGetter";
import { accTokenCookieSetter, refTokenCookieSetter } from "../../../utils/cookieSetter";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const refToken = req.headers.cookie;

   try {
      if (!refToken) {
         return res.status(403).send("Ref token not provided");
      }
      const { email } = await verifyRefToken(refToken.split(" ")[1]);
      console.log("reftoken contr : ", email);

      const user = await UserService.findByEmail(email);
      console.log("user refTo conr : ", user);

      if (!user) {
         return res.status(404).send("User not found");
      }

      const newAccToken = await signAccToken(user.id.toString());
      const newRefToken = await signRefToken(user.email);

      console.log("new acc token : ", newAccToken);
      console.log("new ref token : ", newRefToken);

      const bearerAccToken = `Bearer ${newAccToken}`;
      const bearerRefToken = `Bearer ${newRefToken}`;

      const storedRefToken = await RefTokenService.findByToken(refToken);

      if (!storedRefToken) {
         return res.status(404).send("Stored ref token not found");
      }

      await RefTokenService.update(
         {
            value: bearerRefToken,
         },
         storedRefToken.id
      );

      const refTokenCookie = refTokenCookieSetter(bearerRefToken);
      const accTokenCookie = accTokenCookieSetter(bearerAccToken);

      console.log("new accTokenCookie : ", accTokenCookie);

      return res
         .status(201)
         .setHeader("Set-Cookie", [refTokenCookie, accTokenCookie])
         .json({ token: bearerAccToken, message: "toke renewed" });
   } catch (err) {
      console.log(err);
   } finally {
      await prisma.$disconnect();
   }
}
