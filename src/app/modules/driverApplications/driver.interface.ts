import { VEHICLE_TYPE } from "../ride/ride.interface";

// driver.interface.ts
export enum DRIVER_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IDriver {
  userId: string; // User _id ref
  vehicleType: VEHICLE_TYPE;
  vehicleModel: string;
  vehicleNumber: string;
  licenseNumber: string;
  status: DRIVER_STATUS;
  appliedAt: Date;
  approvedAt?: Date;
}
