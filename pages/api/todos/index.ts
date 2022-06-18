import { NextApiRequest, NextApiResponse } from "next";
import { verifyAccToken } from "../../../server/jwtService";
import prisma from "../../../server/prismaInstance";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   try {
      const accToken = req.headers.authorization;
      if (!accToken) {
         return res.status(401);
      }
      const { userId } = await verifyAccToken(accToken.split("Bearer ")[1], res);
      if (req.method === "GET") {
         console.log("fetching todos ....");
         const todos = await prisma.todo.findMany({
            where: {
               userId: parseInt(userId),
            },
         });
         return res.status(200).json({ todos });
      }
      const newTodo = await prisma.todo.create({
         data: {
            title: req.body.title,
            userId: parseInt(userId),
         },
      });
      return res.status(201).json({ todo: newTodo });
   } catch (err) {
      console.log(err);
      return res.status(500);
   } finally {
      await prisma.$disconnect();
   }
}
