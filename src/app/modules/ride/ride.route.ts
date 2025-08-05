// ride.route.ts
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideController } from "./ride.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema } from "./ride.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.RIDER),
  validateRequest(createRideZodSchema),
  RideController.requestRide
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  RideController.getAllRides
);

router.patch(
  "/rideStatus/:rideId",
  checkAuth(Role.DRIVER),
  RideController.updateRideStatus
);

export const RideRoute = router;
