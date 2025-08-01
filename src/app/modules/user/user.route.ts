// user.route.ts
import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);

export const UserRoutes = router;
