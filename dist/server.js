"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const todos_route_js_1 = __importDefault(require("./routes/todos.route.js"));
const users_route_js_1 = __importDefault(require("./routes/users.route.js"));
// const __dirname = dirname(fileURLToPath(import.meta.url));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.PORT = "3000";
        this.path = {
            todo: "/api/todos",
            user: "/api/user",
        };
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        // this.app.use(express.static())
    }
    routes() {
        this.app.get("/api", (req, res) => {
            // res.send("hola");
            res.status(200).json({ msg: "hola" });
        });
        this.app.use(this.path.todo, todos_route_js_1.default);
        this.app.use(this.path.user, users_route_js_1.default);
    }
    listen() {
        this.app.listen(this.PORT, () => console.log("Lisen on port:", this.PORT));
    }
}
exports.default = Server;
