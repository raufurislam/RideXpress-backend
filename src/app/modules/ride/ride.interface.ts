import { Types } from "mongoose";

export enum VEHICLE_TYPE {
  CAR = "CAR",
  BIKE = "BIKE",
}

export enum RideStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface IRideLocation {
  type: "Point";
  coordinates: [number, number]; // GeoJSON: [lng, lat]
  name: string;
}

export interface IRideTimestamps {
  requestedAt?: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  in_transit?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  rejectedAt?: Date;
}

export interface IRide {
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId | null;

  pickupLocation: IRideLocation;
  destinationLocation: IRideLocation;

  fare: number;
  distance: number;
  status: RideStatus;
  vehicleType: VEHICLE_TYPE;
  timestamps: IRideTimestamps;
  cancellationReason?: string;
}
