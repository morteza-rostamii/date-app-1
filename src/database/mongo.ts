import { MONGO_URI } from "@/configs/config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDB;
