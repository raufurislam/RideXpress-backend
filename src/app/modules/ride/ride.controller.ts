// ride.controller.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { RideService } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";

// const requestRide = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const rideData = req.body;
//     const user = req.user as JwtPayload;
//     const result = await RideService.requestRide(rideData, user.userId);

//     sendResponse(res, {
//       statusCode: httpStatus.CREATED,
//       success: true,
//       message: "Your ride request was successful",
//       data: result,
//     });
//   }
// );

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const rideData = req.body;

  const result = await RideService.requestRide(rideData, user.userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ride requested successfully",
    data: result,
  });
});

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

const updateRideStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rideStatus } = req.body;
    const { rideId } = req.params;
    const decodedToken = req.user as JwtPayload;
    const result = await RideService.updateRideStatus(
      decodedToken.userId,
      rideId,
      rideStatus
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Ride status has been updated to '${result?.status}' successfully`,
      data: result,
    });
  }
);

const cancelRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rideStatus } = req.body;
    const { rideId } = req.params;
    const decodedToken = req.user as JwtPayload;
    const result = await RideService.cancelRide(
      decodedToken.userId,
      rideId,
      rideStatus
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your ride has been cancelled successfully",
      data: result,
    });
  }
);

const rideHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await RideService.rideHistory(decodedToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride history retrieved successfully",
      data: result,
    });
  }
);

const viewEarningHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await RideService.viewEarningHistory(decodedToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Driver Earning History has been retrieve successfully",
      data: result,
    });
  }
);

const getRideById = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { rideId } = req.params;
  const result = await RideService.getRideById(decodedToken.userId, rideId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ride retrieved successfully",
    data: result,
  });
});

export const RideController = {
  requestRide,
  getAllRides,
  updateRideStatus,
  cancelRide,
  rideHistory,
  getRideById,
  viewEarningHistory,
};
