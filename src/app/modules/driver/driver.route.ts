// driver.route.ts
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  driverApplicationZodSchema,
  updateDriverApplicationZodSchema,
} from "./driver.validation";
import { DriverController } from "./driver.controller";

const router = Router();

router.post(
  "/apply-driver",
  checkAuth(Role.RIDER),
  validateRequest(driverApplicationZodSchema),
  DriverController.applyForDriver
);

router.get(
  "/driver-application",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DriverController.getAllDriverApplication
);

router.patch(
  "/driver-application/:driverId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDriverApplicationZodSchema),
  DriverController.updateDriver
);

export const DriverRoute = router;
