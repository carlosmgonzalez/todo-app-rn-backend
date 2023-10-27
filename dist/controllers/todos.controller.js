"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedTodoWith = exports.toggleCompleted = exports.shareTodo = exports.deleteTodo = exports.createTodo = exports.getTodosByUserId = exports.getTodoById = void 0;
const prismadb_1 = __importDefault(require("../database/prismadb"));
const zod_1 = require("zod");
const getTodoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const todo = yield prismadb_1.default.todos.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        return res.status(200).json(todo);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getTodoById = getTodoById;
const getTodosByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getTodos = yield prismadb_1.default.todos.findMany({
            where: {
                OR: [
                    { user_id: parseInt(id) },
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
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json(error.message);
        }
        console.log(error);
    }
});
exports.getTodosByUserId = getTodosByUserId;
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const createTodoValidation = zod_1.z.object({
        title: zod_1.z.string().min(1),
        user_id: zod_1.z.number().min(1),
    });
    try {
        const { title, user_id } = createTodoValidation.parse(body);
        const newTodo = yield prismadb_1.default.todos.create({
            data: {
                title,
                user_id,
            },
        });
        return res.status(200).json(newTodo);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json(error.message);
        }
        console.log(error);
    }
});
exports.createTodo = createTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params;
    const idValidate = zod_1.z.object({
        id: zod_1.z.string().min(1),
    });
    try {
        const { id } = idValidate.parse(params);
        const deleteTodo = yield prismadb_1.default.todos.delete({
            where: {
                id: parseInt(id),
            },
        });
        return res.status(200).json(deleteTodo);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json(error.message);
        }
        console.log(error);
    }
});
exports.deleteTodo = deleteTodo;
const shareTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const sharedTodoValidate = zod_1.z.object({
        todo_id: zod_1.z.string().min(1),
        user_id: zod_1.z.string().min(1),
        shared_with_id: zod_1.z.string().min(1),
    });
    try {
        const { todo_id, user_id, shared_with_id } = sharedTodoValidate.parse(body);
        const sharedTodo = yield prismadb_1.default.shared_todos.create({
            data: {
                todo_id: parseInt(todo_id),
                user_id: parseInt(user_id),
                shared_with_id: parseInt(shared_with_id),
            },
        });
        return res.status(200).json(sharedTodo);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json(error.message);
        }
        console.log(error);
    }
});
exports.shareTodo = shareTodo;
const toggleCompleted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params;
    const idValidate = zod_1.z.object({
        id: zod_1.z.string().min(1),
    });
    try {
        const { id } = idValidate.parse(params);
        const todo = yield prismadb_1.default.todos.findFirst({
            where: {
                id: parseInt(id),
            },
        });
        const isCompleted = todo === null || todo === void 0 ? void 0 : todo.completed;
        const completedTodo = yield prismadb_1.default.todos.update({
            where: {
                id: parseInt(id),
            },
            data: {
                completed: !isCompleted,
            },
        });
        return res.status(200).json(completedTodo);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json(error.message);
        }
        console.log(error);
    }
});
exports.toggleCompleted = toggleCompleted;
const sharedTodoWith = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params;
    const idValidate = zod_1.z.object({
        id: zod_1.z.string().min(1),
    });
    try {
        const { id } = idValidate.parse(params);
        const response = yield prismadb_1.default.todos.findUnique({
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
                shareWith = yield prismadb_1.default.users.findUnique({
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
            shared_with: shareWith === null || shareWith === void 0 ? void 0 : shareWith.name,
        };
        res.status(200).json(data);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json(error.message);
        }
        console.log(error);
    }
});
exports.sharedTodoWith = sharedTodoWith;
