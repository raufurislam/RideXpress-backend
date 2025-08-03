// driver.model.ts

import { model, Schema } from "mongoose";
import { DRIVER_STATUS, IDriver } from "./driver.interface";

const driverSchema = new Schema<IDriver>(
  {
    userId: {
      // type: Schema.Types.ObjectId,
      // // ref: "User",
      // required: true,
      // unique: true,
    },
    vehicleType: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    status: {
      type: String,
      enum: DRIVER_STATUS,
      default: DRIVER_STATUS.PENDING,
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
