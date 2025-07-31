// driver.interface.ts
export type DriverStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IDriver {
  userId: string; // User _id ref
  vehicleType: string;
  vehicleModel: string;
  vehicleNumber: string;
  licenseNumber: string;
  status: DriverStatus;
  appliedAt: Date;
  approvedAt?: Date;
  earning: string;
}
