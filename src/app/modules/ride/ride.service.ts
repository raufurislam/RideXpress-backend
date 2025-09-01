// ride.service.ts
import { Types } from "mongoose";
import { calculateFare } from "../../utils/calculateFare";
import {
  IRide,
  IRideLocation,
  RideStatus,
  VEHICLE_TYPE,
} from "./ride.interface";
import { Ride } from "./ride.model";
import { calculateDistanceInKm } from "../../utils/calculateDistanceInKm";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import {
  ACTIVE_RIDE_STATUSES,
  getFullRideStatusFlow,
  rideStatusFlow,
} from "./rideStatus";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { rideSearchableFields } from "./ride.constant";
import { AVAILABILITY, DRIVER_STATUS } from "../driver/driver.interface";
import { Driver } from "../driver/driver.model";
import { cancelledRideToday } from "../../utils/cancelledRideToday";

const requestRide = async (payload: Partial<IRide>, userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  // ⛔ Block if rider already has an active ride
  const existingRide = await Ride.findOne({
    riderId: userId,
    status: { $in: ACTIVE_RIDE_STATUSES },
  });

  if (existingRide) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You already have an active ride (${existingRide.status}). Please complete or cancel it before requesting a new one.`
    );
  }

  const { pickupLocation, destinationLocation, vehicleType } = payload;

  if (!pickupLocation?.coordinates || !pickupLocation?.name)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Pickup location required with name"
    );

  if (!destinationLocation?.coordinates || !destinationLocation?.name)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Destination location required with name"
    );

  if (!vehicleType)
    throw new AppError(httpStatus.BAD_REQUEST, "Vehicle type required");

  // Normalize and validate vehicle type from request
  const normalizedVehicleType = String(vehicleType).toUpperCase();
  if (
    !Object.values(VEHICLE_TYPE).includes(normalizedVehicleType as VEHICLE_TYPE)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid vehicle type '${vehicleType}'. Allowed: ${Object.values(
        VEHICLE_TYPE
      ).join(", ")}`
    );
  }

  // Correct GeoJSON order [lng, lat]
  const pickup: IRideLocation = {
    type: "Point",
    coordinates: [pickupLocation.coordinates[1], pickupLocation.coordinates[0]],
    name: pickupLocation.name,
  };

  const destination: IRideLocation = {
    type: "Point",
    coordinates: [
      destinationLocation.coordinates[1],
      destinationLocation.coordinates[0],
    ],
    name: destinationLocation.name,
  };

  const distance = calculateDistanceInKm(
    pickup.coordinates[1],
    pickup.coordinates[0],
    destination.coordinates[1],
    destination.coordinates[0]
  );

  const fare = calculateFare({
    distanceInKm: distance,
    vehicleType: normalizedVehicleType as VEHICLE_TYPE,
  });

  const ride = new Ride({
    riderId: new Types.ObjectId(userId),
    pickupLocation: pickup,
    destinationLocation: destination,
    distance,
    fare,
    vehicleType: normalizedVehicleType,
    status: RideStatus.REQUESTED,
    timestamps: { requestedAt: new Date() },
  });

  await ride.save();
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

const updateRideStatus = async (
  userId: string,
  rideId: string,
  newStatus: RideStatus
) => {
  const session = await Ride.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
    }

    const driver = await Driver.findOne({ userId });
    if (!driver) {
      throw new AppError(httpStatus.BAD_REQUEST, "Driver profile not found");
    }

    // Reject based on driver status
    if (
      [
        DRIVER_STATUS.PENDING,
        DRIVER_STATUS.REJECTED,
        DRIVER_STATUS.SUSPEND,
      ].includes(driver.status)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Your driver status is '${driver.status}', you cannot update rides`
      );
    }

    if (driver.availability === AVAILABILITY.UNAVAILABLE) {
      throw new AppError(httpStatus.BAD_REQUEST, "You are currently offline");
    }

    // ✅ Vehicle type check
    if (driver.vehicleType !== ride.vehicleType) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Vehicle type mismatch. You are registered with '${driver.vehicleType}', but this ride requires '${ride.vehicleType}'.`
      );
    }

    // ✅ Prevent driver from accepting multiple active rides
    if (newStatus === RideStatus.ACCEPTED) {
      const alreadyActiveRide = await Ride.findOne({
        driverId: userId,
        status: { $in: ACTIVE_RIDE_STATUSES },
      });

      if (alreadyActiveRide) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You already have an active ride"
        );
      }
    }

    if (newStatus === RideStatus.CANCELLED) {
      throw new AppError(httpStatus.BAD_REQUEST, "Drivers cannot cancel rides");
    }

    if (ride.status === RideStatus.CANCELLED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Ride has already been cancelled"
      );
    }

    // ⛔ Prevent invalid transitions
    const allowedNextStatuses = rideStatusFlow[ride.status];
    // if (!allowedNextStatuses.includes(newStatus)) {
    //   throw new AppError(
    //     httpStatus.BAD_REQUEST,
    //     `Invalid ride status transition from '${ride.status}' to '${newStatus}'`
    //   );
    // }

    if (!allowedNextStatuses.includes(newStatus)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid ride status transition from '${ride.status}' to '${newStatus}'.\n` +
          `Ride status must follow this flow:\n${getFullRideStatusFlow()}`
      );
    }

    // ⛔ Only assigned driver can update ride after acceptance
    if (
      ride.driverId &&
      ride.driverId.toString() !== userId &&
      [
        RideStatus.ACCEPTED,
        RideStatus.PICKED_UP,
        RideStatus.IN_TRANSIT,
      ].includes(ride.status)
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not assigned to this ride"
      );
    }

    // Timestamp mapping
    const now = new Date();
    const timestampFieldMap: Record<RideStatus, keyof IRide["timestamps"]> = {
      [RideStatus.ACCEPTED]: "acceptedAt",
      [RideStatus.REJECTED]: "rejectedAt",
      [RideStatus.PICKED_UP]: "pickedUpAt",
      [RideStatus.IN_TRANSIT]: "in_transit",
      [RideStatus.COMPLETED]: "completedAt",
      [RideStatus.CANCELLED]: "cancelledAt",
      [RideStatus.REQUESTED]: "requestedAt", // unlikely to be set here
    };

    const updateData: Partial<IRide> = {
      status: newStatus,
      timestamps: {
        ...ride.timestamps,
        [timestampFieldMap[newStatus]]: now,
      },
    };

    // ✅ Assign driver on first accept
    if (!ride.driverId && newStatus === RideStatus.ACCEPTED) {
      updateData.driverId = new Types.ObjectId(userId);
    }

    // ✅ Add fare to earnings on completion
    if (newStatus === RideStatus.COMPLETED && ride.fare && driver) {
      await Driver.updateOne(
        { userId },
        { $inc: { earnings: ride.fare } },
        { session }
      );
    }

    const updatedRide = await Ride.findByIdAndUpdate(rideId, updateData, {
      new: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return updatedRide;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelRide = async (
  userId: string,
  rideId: string,
  cancelStatus: RideStatus
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (ride.riderId.toString() !== userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to cancel this ride"
    );
  }

  if (
    [
      RideStatus.ACCEPTED,
      RideStatus.COMPLETED,
      RideStatus.PICKED_UP,
      RideStatus.REJECTED,
      RideStatus.IN_TRANSIT,
    ].includes(ride.status)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot cancel ride because its status is '${ride.status}'`
    );
  }

  if (ride.status === RideStatus.CANCELLED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Ride is already cancelled");
  }

  const todaysCancelledCount = await cancelledRideToday(userId);
  if (todaysCancelledCount >= 3) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot cancel more than 3 rides per day"
    );
  }

  // ✅ Apply cancellation
  ride.status = cancelStatus;
  ride.timestamps.cancelledAt = new Date();
  await ride.save();

  return ride;
};

const rideHistory = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Fetch all rides for the rider across all statuses
  const rides = await Ride.find({
    riderId: userId,
  }).sort({ "timestamps.requestedAt": -1 });

  return rides;
};

const getRideById = async (userId: string, rideId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (ride.riderId.toString() !== userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to view this ride"
    );
  }

  return ride;
};

const viewEarningHistory = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const driver = await Driver.findOne({ userId });
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  const completedRides = await Ride.find({
    driverId: userId,
    status: RideStatus.COMPLETED,
  }).sort({ "timestamps.completedAt": -1 }); // Most recent first

  const totalEarnings = completedRides.reduce(
    (acc, ride) => acc + (ride.fare || 0),
    0
  );

  return {
    totalRides: completedRides.length,
    totalEarnings,
    rides: completedRides,
  };
};

export const RideService = {
  requestRide,
  getAllRides,
  updateRideStatus,
  cancelRide,
  rideHistory,
  getRideById,
  viewEarningHistory,
};
