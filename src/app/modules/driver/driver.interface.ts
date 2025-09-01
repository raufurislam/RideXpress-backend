// driver.interface.ts
import { Types } from "mongoose";
import { VEHICLE_TYPE } from "../ride/ride.interface";

export enum DRIVER_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPEND = "SUSPEND",
}

export enum AVAILABILITY {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
  ON_TRIP = "ON_TRIP",
}

export interface IDriver {
  userId: Types.ObjectId;
  vehicleType: VEHICLE_TYPE;
  vehicleModel: string;
  vehicleNumber: string;
  licenseNumber: string;
  status: DRIVER_STATUS;
  availability: AVAILABILITY;
  appliedAt: Date;
  approvedAt?: Date;
  earnings?: number;
}

export interface UpdateMyDriverProfile {
  vehicleType?: VEHICLE_TYPE;
  vehicleModel?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  availability?: AVAILABILITY;
}
