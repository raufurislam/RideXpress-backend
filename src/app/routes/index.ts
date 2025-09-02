import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { DriverRoute } from "../modules/driver/driver.route";
import { RideRoute } from "../modules/ride/ride.route";
import { StatsRoutes } from "../modules/stats/stats.route";

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
    path: "/ride",
    route: RideRoute,
  },
  {
    path: "/driver",
    route: DriverRoute,
  },
  {
    path: "/stats",
    route: StatsRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
