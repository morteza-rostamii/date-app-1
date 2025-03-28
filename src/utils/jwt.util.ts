import { JWT_EXPIRES_IN, JWT_SECRET } from "@/configs/config";
import { TJwtPayload } from "@/types/TUser";
import jwt from "jsonwebtoken";

// sign a token
const signToken = (payload: TJwtPayload) => {
  // @ts-expect-error error
  return jwt.sign(
    // payload
    payload,
    // secret
    JWT_SECRET as string,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

// verify a token
const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET as string) as TJwtPayload;
};

export { signToken, verifyToken };
