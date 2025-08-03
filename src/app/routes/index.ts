import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { DriverRoute } from "../modules/driver/driver.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/driver",
    route: DriverRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
