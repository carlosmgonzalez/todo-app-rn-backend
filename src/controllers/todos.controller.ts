import { Request, Response } from "express";
import prisma from "../database/prismadb";
import { ZodError, z } from "zod";

export const getTodoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const todo = await prisma.todos.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json(todo);
  } catch (error) {
    console.log(error);
  }
};

export const getTodosByUserId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const getTodos = await prisma.todos.findMany({
      where: {
        OR: [
          { user_id: parseInt(id) }, // Tareas del usuario con ID 1
          { shared_todos: { some: { shared_with_id: parseInt(id) } } }, // Tareas compartidas con el usuario con ID 1
        ],
      },
      select: {
        id: true,
        title: true,
        completed: true,
        shared_todos: {
          select: {
            shared_with_id: true,
          },
        },
      },
    });

    const todos = getTodos.map((task) => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      shared_with_id: task.shared_todos[0]
        ? task.shared_todos[0].shared_with_id
        : null,
    }));

    return res.status(200).json(todos);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error.message);
    }
    console.log(error);
  }
};

export const createTodo = async (req: Request, res: Response) => {
  const body = req.body;

  const createTodoValidation = z.object({
    title: z.string().min(1),
    user_id: z.number().min(1),
  });

  try {
    const { title, user_id } = createTodoValidation.parse(body);

    const newTodo = await prisma.todos.create({
      data: {
        title,
        user_id,
      },
    });

    return res.status(200).json(newTodo);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error.message);
    }
    console.log(error);
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const params = req.params;

  const idValidate = z.object({
    id: z.string().min(1),
  });

  try {
    const { id } = idValidate.parse(params);

    const deleteTodo = await prisma.todos.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json(deleteTodo);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error.message);
    }
    console.log(error);
  }
};

export const shareTodo = async (req: Request, res: Response) => {
  const body = req.body;

  const sharedTodoValidate = z.object({
    todo_id: z.string().min(1),
    user_id: z.string().min(1),
    shared_with_id: z.string().min(1),
  });

  try {
    const { todo_id, user_id, shared_with_id } = sharedTodoValidate.parse(body);

    const sharedTodo = await prisma.shared_todos.create({
      data: {
        todo_id: parseInt(todo_id),
        user_id: parseInt(user_id),
        shared_with_id: parseInt(shared_with_id),
      },
    });

    return res.status(200).json(sharedTodo);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error.message);
    }
    console.log(error);
  }
};

export const toggleCompleted = async (req: Request, res: Response) => {
  const params = req.params;

  const idValidate = z.object({
    id: z.string().min(1),
  });

  try {
    const { id } = idValidate.parse(params);

    const todo = await prisma.todos.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    const isCompleted = todo?.completed;

    const completedTodo = await prisma.todos.update({
      where: {
        id: parseInt(id),
      },
      data: {
        completed: !isCompleted,
      },
    });

    return res.status(200).json(completedTodo);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error.message);
    }
    console.log(error);
  }
};

export const sharedTodoWith = async (req: Request, res: Response) => {
  const params = req.params;

  const idValidate = z.object({
    id: z.string().min(1),
  });

  try {
    const { id } = idValidate.parse(params);

    const response = await prisma.todos.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        title: true,
        completed: true,
        users: true,
        shared_todos: {
          select: {
            shared_with_id: true,
          },
        },
      },
    });

    if (!response)
      return res.status(400).json({ msg: "No existe un todo con ese id" });

    let shareWith;

    if (response.shared_todos[0]) {
      const sharedWithId = response.shared_todos[0].shared_with_id;

      if (sharedWithId) {
        shareWith = await prisma.users.findUnique({
          where: {
            id: sharedWithId,
          },
        });
      }
    }

    const data = {
      title: response.title,
      completed: response.completed,
      author: response.users.name,
      shared_with: shareWith?.name,
    };

    res.status(200).json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error.message);
    }
    console.log(error);
  }
};
