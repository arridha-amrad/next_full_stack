import cookie from "cookie";

export const refTokenCookieSetter = (bearerRefToken: string, isClear = false) =>
  cookie.serialize("refToken", bearerRefToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: isClear ? -1 : 60 * 60 * 24 * 30,
    sameSite: "strict",
    path: "/",
  });

export const accTokenCookieSetter = (bearerAccToken: string) =>
  cookie.serialize("accToken", bearerAccToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    sameSite: "strict",
    path: "/",
  });
