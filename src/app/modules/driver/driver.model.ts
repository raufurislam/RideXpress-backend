// driver.model.ts
import { Schema, model } from "mongoose";
import { IDriver, AVAILABILITY, DRIVER_STATUS } from "./driver.interface";
import { VEHICLE_TYPE } from "../ride/ride.interface";

const driverSchema = new Schema<IDriver>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: Object.values(VEHICLE_TYPE),
      required: true,
    },
    vehicleModel: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(DRIVER_STATUS),
      default: DRIVER_STATUS.PENDING,
    },
    availability: {
      type: String,
      enum: Object.values(AVAILABILITY),
      default: AVAILABILITY.UNAVAILABLE,
    },
    appliedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Driver = model<IDriver>("Driver", driverSchema);
