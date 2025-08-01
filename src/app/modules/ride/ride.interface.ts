// ride.interface.ts
import { Types } from "mongoose";

export enum VEHICLE_TYPE {
  CAR = "CAR",
  BIKE = "BIKE",
}

export enum Status {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface IRideTimestamps {
  requestedAt?: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}

export interface IRide {
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId;
  pickupLocation: string;
  destinationLocation: string;
  status: Status;
  fare?: number;
  vehicleType: VEHICLE_TYPE;
  timestamps: IRideTimestamps;
  cancellationReason?: string;
}
