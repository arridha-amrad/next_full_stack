import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../server/prismaInstance";
import { refTokenCookieSetter } from "../../../utils/cookieSetter";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   try {
      const { refToken } = req.cookies;
      const storedRefToken = await prisma.refToken.findFirst({
         where: {
            value: refToken,
         },
      });
      await prisma.refToken.delete({
         where: {
            id: storedRefToken?.id,
         },
      });
      const refTokenCookie = refTokenCookieSetter("", true);
      res.setHeader("Set-Cookie", refTokenCookie);
      return res.status(200).send("logout");
   } catch (err) {
      console.log(err);
      return res.status(500);
   }
}
