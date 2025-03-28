import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5001;
export const BASE_API = process.env.BASE_API || "/api/v1";
export const NODE_ENV = process.env.NODE_ENV || "development";

export const MONGO_URI = process.env.MONGO_URI || "";

// jwt
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const REDIS_URI = process.env.REDIS_URI || "";
