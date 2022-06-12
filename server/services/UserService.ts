import { User } from "@prisma/client";
import { IUser } from "../../context/IContext";
import { IRegisterDTO } from "../../pages/api/register";
import prisma from "../prismaInstance";
import { IService } from "./IService";

const db = prisma;

class UserService implements IService<User> {
   findByEmail(email: string): Promise<User | null> {
      return db.user.findFirst({
         where: {
            email,
         },
      });
   }
   findByUsername(username: string): Promise<User | null> {
      return db.user.findFirst({
         where: {
            username,
         },
      });
   }
   findAll(): Promise<User[]> {
      return db.user.findMany();
   }
   save(data: IRegisterDTO): Promise<User> {
      return db.user.create({
         data: {
            ...data,
            avatarURL: "default.png",
         },
      });
   }
   findById(id: number): Promise<User | null> {
      return db.user.findFirst({
         where: {
            id,
         },
      });
   }
   deleteById(id: number): Promise<User> {
      throw new Error("Method not implemented.");
   }
   update(data: Partial<User>, id: number): Promise<User> {
      throw new Error("Method not implemented.");
   }
}

export default new UserService();
