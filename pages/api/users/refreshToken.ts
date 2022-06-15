import { NextApiRequest, NextApiResponse } from "next";
import {
  signAccToken,
  signRefToken,
  verifyRefToken,
} from "../../../server/jwtService";
import prisma from "../../../server/prismaInstance";
import RefTokenService from "../../../server/services/RefTokenService";
import UserService from "../../../server/services/UserService";
import { refTokenCookieSetter } from "../../../utils/cookieSetter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const refToken = req.cookies.refToken as string | undefined;
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

    const bearerAccToken = `Bearer ${newAccToken}`;
    const bearerRefToken = `Bearer ${newRefToken}`;

    const updatedRefToken = await RefTokenService.update(
      {
        value: bearerRefToken,
      },
      storedRefToken.id
    );

    const refTokenCookie = refTokenCookieSetter(updatedRefToken.value);

    return res.status(201).setHeader("Set-Cookie", [refTokenCookie]).json({
      accToken: bearerAccToken,
      message: "toke renewed",
    });
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
}
