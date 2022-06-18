import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../server/prismaInstance";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { id } = req.query;
   const { isComplete, title } = req.body;
   try {
      if (req.method === "GET") {
         const todo = await prisma.todo.findFirst({
            where: {
               id: Number(id as string),
            },
         });
         return res.status(200).json({ todo });
      }

      if (req.method === "DELETE") {
         const todo = await prisma.todo.delete({
            where: {
               id: Number(id as string),
            },
         });
         return res.status(200).json({ message: "Todo deleted", todo });
      }

      if (req.method === "PUT") {
         const todo = await prisma.todo.update({
            data: {
               isComplete,
               title,
            },
            where: {
               id: Number(id as string),
            },
         });
         if (todo) {
            return res.status(200).json({ todo });
         }
      }
   } catch (err) {
      console.log(err);
      return res.status(500);
   } finally {
      await prisma.$disconnect();
   }
}
