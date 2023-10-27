"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const router = (0, express_1.Router)();
router.get("/:id", users_controller_1.getUserById);
router.get("", users_controller_1.getUserByEmail);
exports.default = router;
