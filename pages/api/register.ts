import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../server/prismaInstance";
import revalidateCookie from "../../utils/revalidateCookie";
import argon from "argon2";
import { signAccToken, signRefToken } from "../../server/jwtService";
import RefTokenService from "../../server/services/RefTokenService";
import { accTokenCookieSetter, refTokenCookieSetter } from "../../utils/cookieSetter";

export interface IRegisterDTO {
   username: string;
   email: string;
   password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { username, email, password } = req.body;
   try {
      await revalidateCookie(req);
      const isEmailExists = await prisma.user.findFirst({ where: { email } });
      if (isEmailExists) {
         return res.status(400).send("Email already registered");
      }
      const isUsernameExists = await prisma.user.findFirst({
         where: { username },
      });
      if (isUsernameExists) {
         return res.status(400).send("Username already registered");
      }
      const hashedPassword = await argon.hash(password);
      const newUser = await prisma.user.create({
         data: {
            username,
            email,
            password: hashedPassword,
            avatarURL: "default.png",
         },
      });
      const accToken = await signAccToken(newUser.id.toString());
      const refToken = await signRefToken(newUser.email);
      const bearerAccToken = `Bearer ${accToken}`;
      const bearerRefToken = `Bearer ${refToken}`;

      await RefTokenService.save(bearerRefToken, newUser.id);

      const refTokenCookie = refTokenCookieSetter(bearerRefToken);
      const accTokenCookie = accTokenCookieSetter(bearerAccToken);

      const { password: userPassword, ...rest } = newUser;

      return res
         .status(201)
         .setHeader("Set-Cookie", [refTokenCookie, accTokenCookie])
         .json({ user: rest });
   } catch (err) {
      console.log(err);
      return res.status(500);
   } finally {
      await prisma.$disconnect();
   }
}
