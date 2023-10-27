import { Request, Response } from "express";
import prisma from "../database/prismadb";
import { ZodError, z } from "zod";

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const query = req.query;
  console.log(query);

  try {
    const emailValidation = z.object({
      email: z.string().min(1),
    });

    const email = emailValidation.parse(query).email;

    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error);
    }
    console.log(error);
  }
};
