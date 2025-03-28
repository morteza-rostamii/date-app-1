"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
class UsersController {
    constructor() {
        console.log("UsersController constructor");
    }
    async gets(req, res, next) {
        try {
            console.log("get all users");
            return res.status(200).json({ message: "get all users" });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async get(req, res, next) {
        try {
            console.log("get user");
            return res.status(200).json({ message: "get user" });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.UsersController = UsersController;
