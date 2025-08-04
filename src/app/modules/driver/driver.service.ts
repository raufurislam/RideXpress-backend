// driver.service.ts
import { JwtPayload } from "jsonwebtoken";
import { IUser, Role } from "../user/user.interface";
import AppError from "../../errorHelpers/AppError";
import { Driver } from "./driver.model";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { Availability, DRIVER_STATUS } from "./driver.interface";
import { QueryBuilder } from "./../../utils/QueryBuilder";
import { driverSearchableFields } from "./driver.constant";
import mongoose from "mongoose";

const applyForDriver = async (
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role !== Role.RIDER) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to apply for driver"
    );
  }

  const isUserExist = await User.findById(decodedToken.userId);

  // checking is user exist or not
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // checking authorized user or not
  if (isUserExist._id.toString() !== decodedToken.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You're not authorized to perform this action"
    );
  }

  // checking address provided or not
  if (!isUserExist.address) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please update your address before applying as a driver."
    );
  }

  // checking user already submit a driver application
  const isApplicationExist = await Driver.findOne({
    driver: decodedToken.userId,
  });
  if (isApplicationExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already submitted a driver application"
    );
  }

  // checking user already are in driver role
  if (isUserExist.role === Role.DRIVER) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already registered as driver"
    );
  }

  // create new driver application
  const driver = await Driver.create({
    ...payload,
    userId: decodedToken.userId,
    status: DRIVER_STATUS.PENDING,
    availability: Availability.OFFLINE,
    appliedAt: new Date(),
  });

  return driver;
};

const getAllDriverApplication = async (
  userId: string,
  query: Record<string, string>
) => {
  const isUserExist = User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const queryBuilder = new QueryBuilder(Driver.find(), query);

  const driverApplication = await queryBuilder
    .search(driverSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    driverApplication.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const updateDriver = async (driverId: string, driverStatus: DRIVER_STATUS) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const driver = await Driver.findById(driverId).session(session);
    if (!driver) {
      throw new AppError(httpStatus.NOT_FOUND, "Driver application not found");
    }

    if (driver.status === driverStatus) {
      throw new AppError(httpStatus.BAD_REQUEST, `Already ${driverStatus}`);
    }

    driver.status = driverStatus;

    if (driverStatus === DRIVER_STATUS.APPROVED) {
      driver.approvedAt = new Date();

      // ✅ Update the user's role to DRIVER
      await User.findByIdAndUpdate(
        driver.userId,
        { role: Role.DRIVER },
        { session }
      );
    }

    await driver.save({ session });

    await session.commitTransaction();
    session.endSession();

    return driver;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const DriverService = {
  applyForDriver,
  getAllDriverApplication,
  updateDriver,
};
