import express from "express";
import cors from "cors";
import todosRoute from "./routes/todos.route.js";
import usersRoute from "./routes/users.route.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

// const __dirname = dirname(fileURLToPath(import.meta.url));

class Server {
  private app;
  private PORT;
  private path;

  constructor() {
    this.app = express();
    this.PORT = "3000";
    this.path = {
      todo: "/api/todos",
      user: "/api/user",
    };

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    // this.app.use(express.static())
  }

  routes() {
    this.app.get("/api", (req, res) => {
      // res.send("hola");
      res.status(200).json({ msg: "hola" });
    });

    this.app.use(this.path.todo, todosRoute);
    this.app.use(this.path.user, usersRoute);
  }

  listen() {
    this.app.listen(this.PORT, () => console.log("Lisen on port:", this.PORT));
  }
}

export default Server;
