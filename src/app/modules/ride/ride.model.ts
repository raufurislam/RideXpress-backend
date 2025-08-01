// ride.model.ts
import { Schema, model } from "mongoose";
import { IRide, Status, VEHICLE_TYPE } from "./ride.interface";

const rideSchema = new Schema<IRide>(
  {
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User" },

    pickupLocation: {
      type: String,
      required: [true, "Pickup location is required"],
    },
    destinationLocation: {
      type: String,
      required: [true, "Destination location is required"],
    },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.REQUESTED,
    },

    fare: { type: Number },
    cancellationReason: { type: String },

    vehicleType: {
      type: String,
      enum: Object.values(VEHICLE_TYPE),
      required: true,
    },

    timestamps: {
      requestedAt: { type: Date },
      acceptedAt: { type: Date },
      pickedUpAt: { type: Date },
      completedAt: { type: Date },
      cancelledAt: { type: Date },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Ride = model<IRide>("Ride", rideSchema);
