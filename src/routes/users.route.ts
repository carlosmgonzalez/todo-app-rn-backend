import { Router } from "express";
import { getTodoById, getTodosByUserId } from "../controllers/todos.controller";
import { getUserByEmail, getUserById } from "../controllers/users.controller";

const router = Router();

router.get("/:id", getUserById);
router.get("", getUserByEmail);

export default router;
