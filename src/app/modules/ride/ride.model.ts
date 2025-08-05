// ride.model.ts
import { Schema, model } from "mongoose";
import { IRide, Status, VEHICLE_TYPE } from "./ride.interface";

const rideLocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  { _id: false }
);

const rideSchema = new Schema<IRide>(
  {
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User", default: null },

    pickupLocation: {
      type: rideLocationSchema,
      required: true,
    },
    destinationLocation: {
      type: rideLocationSchema,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.REQUESTED,
    },

    cancellationReason: { type: String },

    vehicleType: {
      type: String,
      enum: Object.values(VEHICLE_TYPE),
      required: true,
    },

    timestamps: {
      requestedAt: { type: Date },
      acceptedAt: { type: Date },
      rejectedAt: { type: Date },
      pickedUpAt: { type: Date },
      in_transit: { type: Date },
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
