// ride.controller.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { RideService } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";

const requestRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideData = req.body;
    const user = req.user as JwtPayload;
    const result = await RideService.requestRide(rideData, user.userId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Your ride request was successful",
      data: result,
    });
  }
);

const getAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const decodedToken = req.user as JwtPayload;
    const result = await RideService.getAllRides(decodedToken.userId, query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Ride has been retrieve successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const RideController = {
  requestRide,
  getAllRides,
};
