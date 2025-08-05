// ride.route.ts
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideController } from "./ride.controller";

const router = Router();

router.post("/", checkAuth(Role.RIDER), RideController.requestRide);

export const RideRoute = router;
