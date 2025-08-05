// ride.service.ts

import { Types } from "mongoose";
import { calculateFare } from "../../utils/calculateFare";
import { IRide, Status } from "./ride.interface";
import { Ride } from "./ride.model";
import { calculateDistanceInKm } from "../../utils/calculateDistanceInKm";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ACTIVE_RIDE_STATUSES } from "./rideStatus";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { rideSearchableFields } from "./ride.constant";

const requestRide = async (payload: Partial<IRide>, userId: string) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // 🚨 Check if rider already has an active ride
  const activeRide = await Ride.findOne({
    riderId: userId,
    status: { $in: ACTIVE_RIDE_STATUSES },
  });

  if (activeRide) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have an active ride. Please complete it first."
    );
  }

  const { pickupLocation, destinationLocation, vehicleType } = payload;

  if (!pickupLocation || !destinationLocation || !vehicleType) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing required ride fields");
  }

  // ✅ Calculate distance and fare
  const [pickupLng, pickupLat] = pickupLocation.coordinates;
  const [destLng, destLat] = destinationLocation.coordinates;

  const distance = calculateDistanceInKm(
    pickupLat,
    pickupLng,
    destLat,
    destLng
  );
  const fare = calculateFare(distance);

  // ✅ Create ride
  const ride = await Ride.create({
    riderId: new Types.ObjectId(userId),
    pickupLocation,
    destinationLocation,
    distance,
    vehicleType,
    fare,
    status: Status.REQUESTED,
    timestamps: {
      requestedAt: new Date(),
    },
  });

  return ride;
};

const getAllRides = async (userId: string, query: Record<string, string>) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const queryBuilder = new QueryBuilder(Ride.find(), query);

  const ridesQuery = queryBuilder
    .search(rideSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    ridesQuery.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

export const RideService = {
  requestRide,
  getAllRides,
};
