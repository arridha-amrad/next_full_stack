import { NextApiRequest } from "next";

const cookieGetter = (req: NextApiRequest) => {
   const cookies = req.headers.cookie;
   const cookieArr = cookies?.split("; ") ?? [];
   const cookieObj: any = {};
   for (let i = 0; i < cookieArr?.length; i++) {
      const key = cookieArr[i].split("=")[0];
      const value = cookieArr[i].split("=")[1];
      cookieObj[key] = value;
   }
   const refToken = (cookieObj["refToken"] as string) ?? false;
   const accToken = (cookieObj["accToken"] as string) ?? false;

   return { refToken, accToken };
};

export default cookieGetter;
