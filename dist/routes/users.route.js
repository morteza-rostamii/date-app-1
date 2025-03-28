"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_controller_1 = require("@/controllers/users.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const usersController = new users_controller_1.UsersController();
router.get("/", usersController.gets);
exports.default = router;
