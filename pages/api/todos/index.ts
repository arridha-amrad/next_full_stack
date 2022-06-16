import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../server/prismaInstance";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      console.log("============ fetching todos....");

      const todos = await prisma.todo.findMany();
      return res.status(200).json({ todos });
    }
    const newTodo = await prisma.todo.create({
      data: {
        title: req.body.title,
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
