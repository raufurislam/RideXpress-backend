import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { StatsService } from "./stats.service";
import { sendResponse } from "../../utils/sendResponse";

const getPublicHomepageStats = catchAsync(
  async (req: Request, res: Response) => {
    const stats = await StatsService.getPublicHomepageStats();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Public homepage stats fetched successfully",
      data: stats,
    });
  }
);

const getRideStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getRideStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ride stats fetched successfully",
    data: stats,
  });
});

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getUserStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User stats fetched successfully",
    data: stats,
  });
});

const getDriverStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getDriverStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Driver stats fetched successfully",
    data: stats,
  });
});

const getRevenueStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getRevenueStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Revenue stats fetched successfully",
    data: stats,
  });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getDashboardStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard stats fetched successfully",
    data: stats,
  });
});

export const StatsController = {
  getPublicHomepageStats,
  getRideStats,
  getUserStats,
  getDriverStats,
  getRevenueStats,
  getDashboardStats,
};
