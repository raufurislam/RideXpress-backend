// user.interface.ts
import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCK",
  SUSPENDED = "SUSPENDED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  picture?: string;
  password?: string;
  phone?: string;
  address?: string;
  auths: IAuthProvider[];
  role: Role;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  rides?: Types.ObjectId[];
}
