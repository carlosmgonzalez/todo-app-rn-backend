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
exports.getUserByEmail = exports.getUserById = void 0;
const prismadb_1 = __importDefault(require("../database/prismadb"));
const zod_1 = require("zod");
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prismadb_1.default.users.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        return res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getUserById = getUserById;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    console.log(query);
    try {
        const emailValidation = zod_1.z.object({
            email: zod_1.z.string().min(1),
        });
        const email = emailValidation.parse(query).email;
        const user = yield prismadb_1.default.users.findUnique({
            where: {
                email: email,
            },
        });
        return res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json(error);
        }
        console.log(error);
    }
});
exports.getUserByEmail = getUserByEmail;
