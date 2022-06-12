import { NextApiRequest, NextApiResponse } from "next";
import prisma from "./prismaInstance";
import argon from "argon2";
import { signAccToken, signRefToken } from "./jwtService";
import cookie from "cookie";
import RefTokenService from "./services/RefTokenService";
import revalidateCookie from "../utils/revalidateCookie";

export const register = async (req: NextApiRequest, res: NextApiResponse) => {};
