import { NextApiRequest, NextApiResponse } from "next";
import revalidateCookie from "../../utils/revalidateCookie";
import argon from "argon2";
import UserService from "../../server/services/UserService";
import { signAccToken, signRefToken } from "../../server/jwtService";
import RefTokenService from "../../server/services/RefTokenService";
import { refTokenCookieSetter } from "../../utils/cookieSetter";
import prisma from "../../server/prismaInstance";

export interface ILoginDTO {
  identity: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { identity, password } = req.body as ILoginDTO;
  try {
    await revalidateCookie(req);
    const user = identity.includes("@")
      ? await UserService.findByEmail(identity)
      : await UserService.findByUsername(identity);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isMatch = await argon.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).send("Password not match");
    }
    const accToken = await signAccToken(user.id.toString());
    const refToken = await signRefToken(user.email);
    const bearerAccToken = `Bearer ${accToken}`;
    const bearerRefToken = `Bearer ${refToken}`;

    await RefTokenService.save(bearerRefToken, user.id);

    const refTokenCookie = refTokenCookieSetter(bearerRefToken);

    const { password: userPassword, ...rest } = user;
    return res
      .status(200)
      .setHeader("Set-Cookie", refTokenCookie)
      .json({ user: rest, accessToken: bearerAccToken });
  } catch (err) {
    console.log(err);
    return res.status(500);
  } finally {
    await prisma.$disconnect();
  }
}
