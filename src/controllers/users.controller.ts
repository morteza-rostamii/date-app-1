import User from "@/models/User";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import queueEmail from "@/utils/queue-email.util";
import { NODE_ENV } from "@/configs/config";
import { signToken } from "@/utils/jwt.util";
import setTokenCookie from "@/utils/set-token-cookie.util";

export class UsersController {
  constructor() {
    console.log("UsersController constructor");
  }

  public async gets(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const users = await User.find({});

      // jwt payload
      // console.log("--", req?.user);

      return res.status(200).json({
        message: "get all users",
        data: users,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // email verification token
      const verificationToken = crypto.randomBytes(20).toString("hex");

      // create a new user model
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: "user",
        isVerified: false,
        verificationToken,
      });

      const savedUser = await newUser.save();

      const verificationUrl = `http://localhost:5000/api/v1/users/verify/${verificationToken}`;

      console.log("verification url: ", verificationUrl);
      // send url to email
      const response = await queueEmail(
        email,
        "Verify your email",
        `Click on the link to verify your email: ${verificationUrl}`
      );

      return res.status(200).json({
        message: "user created, please check your email to verify your account",
        response,
        data: savedUser,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await User.findOne({ email });

      if (
        !user ||
        // check if user is verified
        !user.isVerified ||
        // check if password is correct
        !(await bcrypt.compare(password, user.password))
      ) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // token payload
      const payload = {
        id: user._id?.toString(),
        email: user.email,
        role: user.role,
      };

      // sign token and set cookie
      setTokenCookie(res, payload);

      return res
        .status(200)
        .json({ message: "logged in successfully", data: user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // just remove the http cookie
      res.clearCookie("jwt");
      return res.status(200).json({ message: "logged out successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // verify signup with email link
  public async verify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { token } = req.params;

      // check if token is valid
      const user = await User.findOne({ verificationToken: token });

      if (!user) {
        return res.status(400).json({ message: "Invalid token" });
      }

      // user is verified
      user.isVerified = true;
      user.verificationToken = "";
      await user.save();

      return res.status(200).json({ message: "email verified successfully" });
    } catch (err) {
      console.error(err);
      // email verification error
      return res
        .status(500)
        .json({ message: "Internal server error: email verification error" });
    }
  }

  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      return res.status(200).json({ message: "get user" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // create a user
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = new User({ username, email, password });
      const savedUser = await user.save();

      return res.status(200).json({ message: "create user", data: savedUser });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
