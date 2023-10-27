import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodosByUserId,
  shareTodo,
  sharedTodoWith,
  toggleCompleted,
} from "../controllers/todos.controller";

const router = Router();

router.get("/:id", getTodoById);
router.get("/user/:id", getTodosByUserId);
router.post("", createTodo);
router.delete("/:id", deleteTodo);
router.post("/share", shareTodo);
router.put("/:id", toggleCompleted);
router.get("/author-shared/:id", sharedTodoWith);

export default router;
