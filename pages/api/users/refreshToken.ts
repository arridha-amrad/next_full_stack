import { NextApiRequest, NextApiResponse } from "next";
import { signAccToken, signRefToken, verifyRefToken } from "../../../server/jwtService";
import prisma from "../../../server/prismaInstance";
import RefTokenService from "../../../server/services/RefTokenService";
import UserService from "../../../server/services/UserService";
import cookieGetter from "../../../utils/cookieGetter";
import { accTokenCookieSetter, refTokenCookieSetter } from "../../../utils/cookieSetter";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("headers : ", req.headers);

  const refToken = req.headers.cookie as string | undefined;

  try {
    if (!refToken) {
      return res.status(403).send("Ref token not provided");
    }
    const storedRefToken = await RefTokenService.findByToken(refToken);
    if (!storedRefToken) {
      return res.status(404).send("Stored ref token not found");
    }
    const { email } = await verifyRefToken(refToken.split(" ")[1]);
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const newAccToken = await signAccToken(user.id.toString());
    const newRefToken = await signRefToken(user.email);

    console.log("new acc token : ", newAccToken);
    console.log("new ref token : ", newRefToken);

    const bearerAccToken = `Bearer ${newAccToken}`;
    const bearerRefToken = `Bearer ${newRefToken}`;

    const updatedRefToken = await RefTokenService.update(
      {
        value: bearerRefToken,
      },
      storedRefToken.id
    );

    console.log("========= is same : ", bearerRefToken === updatedRefToken.value);

    const refTokenCookie = refTokenCookieSetter(updatedRefToken.value);
    const accTokenCookie = accTokenCookieSetter(bearerAccToken);

    console.log("new accTokenCookie : ", accTokenCookie);

    return res
      .status(201)
      .setHeader("Set-Cookie", [refTokenCookie, accTokenCookie])
      .json({ accToken: bearerAccToken, refToken: updatedRefToken.value, message: "toke renewed" });
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
}
