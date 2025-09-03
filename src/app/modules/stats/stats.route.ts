import express from "express";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { StatsController } from "./stats.controller";

const router = express.Router();

// Public, unauthenticated homepage stats (safe aggregates only)
router.get("/public", StatsController.getPublicHomepageStats);

// Dashboard stats - overview of all key metrics
router.get(
  "/dashboard",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getDashboardStats
);

// Ride statistics
router.get(
  "/rides",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getRideStats
);

// User statistics
router.get(
  "/users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getUserStats
);

// Driver statistics
router.get(
  "/drivers",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getDriverStats
);

// Revenue statistics
router.get(
  "/revenue",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getRevenueStats
);

export const StatsRoutes = router;
