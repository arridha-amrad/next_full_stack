import { RefToken } from "@prisma/client";
import prisma from "../prismaInstance";
import { IService } from "./IService";

const db = prisma;

class RefTokenService implements IService<RefToken> {
   findAll(): Promise<RefToken[]> {
      throw new Error("Method not implemented.");
   }
   save(token: string, userId: number): Promise<RefToken> {
      return db.refToken.create({
         data: {
            value: token,
            userId: userId,
         },
      });
   }
   findByToken(token: string): Promise<RefToken | null> {
      return db.refToken.findFirst({
         where: {
            value: token,
         },
      });
   }
   findById(id: number): Promise<RefToken | null> {
      return db.refToken.findFirst({
         where: {
            id,
         },
      });
   }
   deleteById(id: number): Promise<RefToken> {
      return db.refToken.delete({
         where: {
            id,
         },
      });
   }
   update(data: Partial<RefToken>, id: number): Promise<RefToken> {
      return db.refToken.update({
         data,
         where: {
            id,
         },
      });
   }
}

export default new RefTokenService();
