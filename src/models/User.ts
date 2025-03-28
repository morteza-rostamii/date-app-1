import { Schema, model } from "mongoose";

interface IUser {
  username: string;
  email: string;
  password: string;
  // age?: number; // Optional field

  // role: user or admin use an enum
  role: String;
  isVerified: boolean;
  verificationToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    // email verification
    isVerified: {
      type: Boolean,
      default: false,
    },
    // token for email verification
    verificationToken: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // age: {
    //   type: Number,
    //   min: 13, // Minimum age for a dating app
    // },
  },
  { timestamps: true } //createdAt and updatedAt
);

const User = model<IUser>("User", userSchema);
export default User;
