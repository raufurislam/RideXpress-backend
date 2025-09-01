// driver.route.ts
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  driverApplicationZodSchema,
  updateAvailabilityZodSchema,
  updateDriverApplicationZodSchema,
  updateMyDriverProfileZodSchema,
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
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, ...Object.values(Role)),
  DriverController.getAllDriverApplication
);

router.patch(
  "/driver-application/status/:driverId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDriverApplicationZodSchema),
  DriverController.updateDriver
);

router.patch(
  "/update-availability",
  checkAuth(Role.DRIVER),
  validateRequest(updateAvailabilityZodSchema),
  DriverController.updateAvailability
);

router.get(
  "/my-profile",
  checkAuth(Role.DRIVER),
  DriverController.getMyDriverProfile
);

router.patch(
  "/update-my-profile",
  checkAuth(Role.DRIVER),
  validateRequest(updateMyDriverProfileZodSchema),
  DriverController.updateMyDriverProfile
);

export const DriverRoute = router;
