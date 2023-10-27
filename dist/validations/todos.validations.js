"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createTodoValidation = zod_1.z.object({
    title: zod_1.z.string().min(1),
    user_id: zod_1.z.number().min(1),
});
