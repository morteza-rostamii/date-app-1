export enum Role {
  USER = "user",
  ADMIN = "admin",
}
export type TRole = keyof typeof Role;

export type TJwtPayload = { id: String; role: String; email: String };
