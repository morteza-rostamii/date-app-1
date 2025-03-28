import { TJwtPayload } from "@/types/TUser";
import { Response } from "express";
import { signToken } from "./jwt.util";
import { NODE_ENV } from "@/configs/config";

const setTokenCookie = (res: Response, payload: TJwtPayload) => {
  const token = signToken(payload);

  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side JS access
    secure: NODE_ENV === "production", // Use secure in production
    // sameSite: 'strict', // CSRF protection
    // maxAge: 1000 * 60 * 60 // 1 hour in milliseconds
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

  return token;
};

export default setTokenCookie;
