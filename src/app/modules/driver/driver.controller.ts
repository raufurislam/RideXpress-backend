/* eslint-disable @typescript-eslint/no-unused-vars */
// driver.controller.ts
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import StatusCodes from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { DriverService } from "./driver.service";
import { UpdateMyDriverProfile } from "./driver.interface";

const applyForDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.user as JwtPayload;
    const result = await DriverService.applyForDriver(req.body, decoded);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Your application was successfully sent",
      data: result,
    });
  }
);

const updateDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { driverId } = req.params;
    const { driverStatus } = req.body; // ✅ FIX: use driverStatus not status

    const result = await DriverService.updateDriver(driverId, driverStatus);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Driver status updated to ${driverStatus}`,
      data: result,
    });
  }
);

const updateAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const { availability } = req.body;

    const result = await DriverService.updateAvailability(user, availability);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Driver availability updated successfully",
      data: result,
    });
  }
);

const getMyDriverProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;

    const result = await DriverService.getMyDriverProfile(user);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Driver profile fetched successfully",
      data: result,
    });
  }
);

const updateMyDriverProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const payload = req.body as UpdateMyDriverProfile;

    const result = await DriverService.updateMyDriverProfile(user, payload);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Driver profile updated successfully",
      data: result,
    });
  }
);

const getAllDriverApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const query = req.query as Record<string, string>;

    const result = await DriverService.getAllDriverApplication(user.userId, query);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Driver applications fetched successfully",
      data: result,
    });
  }
);

const getDriverRideHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const query = req.query as Record<string, string>;

    const result = await DriverService.getDriverRideHistory(user, query);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Driver ride history fetched successfully",
      data: result,
    });
  }
);

export const DriverController = {
  applyForDriver,
  getAllDriverApplication,
  updateDriver,
  updateAvailability,
  getMyDriverProfile,
  updateMyDriverProfile,
  getDriverRideHistory,
};
