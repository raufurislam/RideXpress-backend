// ride.service.ts

import { Types } from "mongoose";
import { calculateFare } from "../../utils/calculateFare";
import { IRide, Status } from "./ride.interface";
import { Ride } from "./ride.model";
import { calculateDistanceInKm } from "../../utils/calculateDistanceInKm";

const requestRide = async (payload: Partial<IRide>, userId: string) => {
  const { pickupLocation, destinationLocation, vehicleType } = payload;

  if (!pickupLocation || !destinationLocation || !vehicleType) {
    throw new Error("Missing required ride fields");
  }

  const [pickupLng, pickupLat] = pickupLocation.coordinates;
  const [destLng, destLat] = destinationLocation.coordinates;

  const distance = calculateDistanceInKm(
    pickupLat,
    pickupLng,
    destLat,
    destLng
  );
  const fare = calculateFare(distance);

  const ride = await Ride.create({
    riderId: new Types.ObjectId(userId),
    pickupLocation,
    destinationLocation,
    vehicleType,
    fare,
    status: Status.REQUESTED,
    timestamps: {
      requestedAt: new Date(),
    },
  });

  return ride;
};

export const RideService = {
  requestRide,
};
