// driver.route.ts
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { driverApplicationZodSchema } from "./driver.validation";
import { DriverController } from "./driver.controller";

const router = Router();

router.post(
  "/apply-driver",
  checkAuth(Role.RIDER),
  validateRequest(driverApplicationZodSchema),
  DriverController.applyForDriver
);

export const DriverRoute = router;
