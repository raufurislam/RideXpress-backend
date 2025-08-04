// driver.interface.ts
import { Types } from "mongoose";
import { VEHICLE_TYPE } from "../ride/ride.interface";

export enum DRIVER_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPEND = "SUSPEND",
}

export enum Availability {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export interface IDriver {
  userId: Types.ObjectId;
  vehicleType: VEHICLE_TYPE;
  vehicleModel: string;
  vehicleNumber: string;
  licenseNumber: string;
  status: DRIVER_STATUS;
  availability: Availability;
  appliedAt: Date;
  approvedAt?: Date;
}
