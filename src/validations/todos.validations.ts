import { z } from "zod";

const createTodoValidation = z.object({
  title: z.string().min(1),
  user_id: z.number().min(1),
});

type createTodoType = z.infer<typeof createTodoValidation>;
