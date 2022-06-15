import { NextApiRequest } from "next";
import RefTokenService from "../server/services/RefTokenService";

const revalidateCookie = async (req: NextApiRequest) => {
  const cookieRefToken = req.cookies.refToken;

  if (cookieRefToken) {
    const existingRefToken = await RefTokenService.findByToken(cookieRefToken);
    console.log("existingRefToken : ", existingRefToken);

    if (existingRefToken) {
      await RefTokenService.deleteById(existingRefToken.id);
    }
  }
};

export default revalidateCookie;
