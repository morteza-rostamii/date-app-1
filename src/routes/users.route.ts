import { UsersController } from "@/controllers/users.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import express from "express";
const router = express.Router();

const usersController = new UsersController();

router.get("/", authMiddleware, usersController.gets);

// router.post("/", usersController.create);

router.post("/signup", usersController.signup);

router.post("/login", usersController.login);

router.get("/verify/:token", usersController.verify);

router.post("/logout", usersController.logout);

export default router;
