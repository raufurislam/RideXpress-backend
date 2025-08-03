/* eslint-disable @typescript-eslint/no-unused-vars */
// driver.controller.ts
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import StatusCodes from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { DriverService } from "./driver.service";

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

export const DriverController = {
  applyForDriver,
};
