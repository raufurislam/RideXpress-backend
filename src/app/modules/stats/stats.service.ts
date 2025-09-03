/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ride } from "../ride/ride.model";
import { User } from "../user/user.model";
import { Driver } from "../driver/driver.model";
import { Role, IsActive } from "../user/user.interface";
import { RideStatus, VEHICLE_TYPE } from "../ride/ride.interface";
import { DRIVER_STATUS, AVAILABILITY } from "../driver/driver.interface";

const now = new Date();
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const currentYear = new Date(now.getFullYear(), 0, 1);

// Public, non-sensitive homepage stats (safe to expose without auth)
const getPublicHomepageStats = async () => {
  const [
    totalCompletedRides,
    totalApprovedDrivers,
    totalRiders,
    coverageLocationsCount,
    topPickupLocations,
  ] = await Promise.all([
    Ride.countDocuments({ status: RideStatus.COMPLETED }),
    Driver.countDocuments({ status: DRIVER_STATUS.APPROVED }),
    User.countDocuments({ role: Role.RIDER }),
    Ride.distinct("pickupLocation.name").then((names) => names.length),
    Ride.aggregate([
      { $group: { _id: "$pickupLocation.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
  ]);

  return {
    totalCompletedRides,
    totalApprovedDrivers,
    totalRiders,
    coverageLocationsCount,
    vehicleTypesOffered: Object.values(VEHICLE_TYPE),
    topPickupLocations,
  };
};

// Dashboard Stats - Overview of all key metrics
const getDashboardStats = async () => {
  const [
    totalUsers,
    totalRides,
    totalDrivers,
    totalRevenue,
    activeRides,
    completedRidesToday,
    newUsersThisWeek,
    newDriversThisWeek,
  ] = await Promise.all([
    User.countDocuments(),
    Ride.countDocuments(),
    Driver.countDocuments(),
    Ride.aggregate([
      { $match: { status: RideStatus.COMPLETED } },
      { $group: { _id: null, total: { $sum: "$fare" } } },
    ]).then((result) => result[0]?.total || 0),
    Ride.countDocuments({
      status: {
        $in: [RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT],
      },
    }),
    Ride.countDocuments({
      status: RideStatus.COMPLETED,
      "timestamps.completedAt": {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      },
    }),
    User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Driver.countDocuments({ appliedAt: { $gte: sevenDaysAgo } }),
  ]);

  return {
    overview: {
      totalUsers,
      totalRides,
      totalDrivers,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      activeRides,
      completedRidesToday,
      newUsersThisWeek,
      newDriversThisWeek,
    },
  };
};

// User Statistics
const getUserStats = async () => {
  const [
    totalUsers,
    totalRiders,
    totalDrivers,
    totalAdmins,
    activeUsers,
    blockedUsers,
    suspendedUsers,
    newUsersLast7Days,
    newUsersLast30Days,
    usersByRole,
    usersByStatus,
    verifiedUsers,
    unverifiedUsers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: Role.RIDER }),
    User.countDocuments({ role: Role.DRIVER }),
    User.countDocuments({ role: { $in: [Role.ADMIN, Role.SUPER_ADMIN] } }),
    User.countDocuments({ isActive: IsActive.ACTIVE }),
    User.countDocuments({ isActive: IsActive.BLOCKED }),
    User.countDocuments({ isActive: IsActive.SUSPENDED }),
    User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    User.aggregate([
      { $group: { _id: "$isActive", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    User.countDocuments({ isVerified: true }),
    User.countDocuments({ isVerified: false }),
  ]);

  return {
    totalUsers,
    totalRiders,
    totalDrivers,
    totalAdmins,
    activeUsers,
    blockedUsers,
    suspendedUsers,
    newUsersLast7Days,
    newUsersLast30Days,
    usersByRole,
    usersByStatus,
    verifiedUsers,
    unverifiedUsers,
  };
};

// Driver Statistics
const getDriverStats = async () => {
  const [
    totalDrivers,
    approvedDrivers,
    pendingDrivers,
    rejectedDrivers,
    suspendedDrivers,
    availableDrivers,
    unavailableDrivers,
    onTripDrivers,
    driversByVehicleType,
    driversByStatus,
    driversByAvailability,
    totalEarnings,
    avgEarnings,
    newDriversLast7Days,
    newDriversLast30Days,
    topEarningDrivers,
  ] = await Promise.all([
    Driver.countDocuments(),
    Driver.countDocuments({ status: DRIVER_STATUS.APPROVED }),
    Driver.countDocuments({ status: DRIVER_STATUS.PENDING }),
    Driver.countDocuments({ status: DRIVER_STATUS.REJECTED }),
    Driver.countDocuments({ status: DRIVER_STATUS.SUSPEND }),
    Driver.countDocuments({ availability: AVAILABILITY.AVAILABLE }),
    Driver.countDocuments({ availability: AVAILABILITY.UNAVAILABLE }),
    Driver.countDocuments({ availability: AVAILABILITY.ON_TRIP }),
    Driver.aggregate([
      { $group: { _id: "$vehicleType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Driver.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Driver.aggregate([
      { $group: { _id: "$availability", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Driver.aggregate([
      { $group: { _id: null, total: { $sum: "$earnings" } } },
    ]).then((result) => result[0]?.total || 0),
    Driver.aggregate([
      { $group: { _id: null, avg: { $avg: "$earnings" } } },
    ]).then((result) => result[0]?.avg || 0),
    Driver.countDocuments({ appliedAt: { $gte: sevenDaysAgo } }),
    Driver.countDocuments({ appliedAt: { $gte: thirtyDaysAgo } }),
    Driver.aggregate([
      { $sort: { earnings: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          driverName: "$user.name",
          vehicleType: 1,
          vehicleModel: 1,
          earnings: 1,
          status: 1,
        },
      },
    ]),
  ]);

  return {
    totalDrivers,
    approvedDrivers,
    pendingDrivers,
    rejectedDrivers,
    suspendedDrivers,
    availableDrivers,
    unavailableDrivers,
    onTripDrivers,
    driversByVehicleType,
    driversByStatus,
    driversByAvailability,
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    avgEarnings: Math.round(avgEarnings * 100) / 100,
    newDriversLast7Days,
    newDriversLast30Days,
    topEarningDrivers,
  };
};

// Ride Statistics
const getRideStats = async () => {
  const [
    totalRides,
    ridesByStatus,
    ridesByVehicleType,
    totalDistance,
    avgDistance,
    totalFare,
    avgFare,
    ridesLast7Days,
    ridesLast30Days,
    ridesThisMonth,
    ridesThisYear,
    completedRides,
    cancelledRides,
    activeRides,
    ridesByHour,
    topPickupLocations,
    topDestinationLocations,
    avgRideDuration,
  ] = await Promise.all([
    Ride.countDocuments(),
    Ride.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Ride.aggregate([
      { $group: { _id: "$vehicleType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Ride.aggregate([
      { $group: { _id: null, total: { $sum: "$distance" } } },
    ]).then((result) => result[0]?.total || 0),
    Ride.aggregate([
      { $group: { _id: null, avg: { $avg: "$distance" } } },
    ]).then((result) => result[0]?.avg || 0),
    Ride.aggregate([{ $group: { _id: null, total: { $sum: "$fare" } } }]).then(
      (result) => result[0]?.total || 0
    ),
    Ride.aggregate([{ $group: { _id: null, avg: { $avg: "$fare" } } }]).then(
      (result) => result[0]?.avg || 0
    ),
    Ride.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Ride.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Ride.countDocuments({ createdAt: { $gte: currentMonth } }),
    Ride.countDocuments({ createdAt: { $gte: currentYear } }),
    Ride.countDocuments({ status: RideStatus.COMPLETED }),
    Ride.countDocuments({ status: RideStatus.CANCELLED }),
    Ride.countDocuments({
      status: {
        $in: [RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT],
      },
    }),
    Ride.aggregate([
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Ride.aggregate([
      {
        $group: {
          _id: "$pickupLocation.name",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Ride.aggregate([
      {
        $group: {
          _id: "$destinationLocation.name",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Ride.aggregate([
      { $match: { status: RideStatus.COMPLETED } },
      {
        $addFields: {
          duration: {
            $divide: [
              {
                $subtract: [
                  "$timestamps.completedAt",
                  "$timestamps.requestedAt",
                ],
              },
              1000 * 60, // Convert to minutes
            ],
          },
        },
      },
      { $group: { _id: null, avgDuration: { $avg: "$duration" } } },
    ]).then((result) => result[0]?.avgDuration || 0),
  ]);

  return {
    totalRides,
    ridesByStatus,
    ridesByVehicleType,
    totalDistance: Math.round(totalDistance * 100) / 100,
    avgDistance: Math.round(avgDistance * 100) / 100,
    totalFare: Math.round(totalFare * 100) / 100,
    avgFare: Math.round(avgFare * 100) / 100,
    ridesLast7Days,
    ridesLast30Days,
    ridesThisMonth,
    ridesThisYear,
    completedRides,
    cancelledRides,
    activeRides,
    ridesByHour,
    topPickupLocations,
    topDestinationLocations,
    avgRideDuration: Math.round(avgRideDuration * 100) / 100,
  };
};

// Revenue Statistics
const getRevenueStats = async () => {
  const [
    totalRevenue,
    revenueThisMonth,
    revenueThisYear,
    revenueLast7Days,
    revenueLast30Days,
    avgRevenuePerRide,
    revenueByVehicleType,
    revenueByStatus,
    revenueByHour,
    revenueByDay,
    topRevenueLocations,
    cancellationRevenueLoss,
    pendingRevenue,
  ] = await Promise.all([
    Ride.aggregate([
      { $match: { status: RideStatus.COMPLETED } },
      { $group: { _id: null, total: { $sum: "$fare" } } },
    ]).then((result) => result[0]?.total || 0),
    Ride.aggregate([
      {
        $match: {
          status: RideStatus.COMPLETED,
          "timestamps.completedAt": { $gte: currentMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$fare" } } },
    ]).then((result) => result[0]?.total || 0),
    Ride.aggregate([
      {
        $match: {
          status: RideStatus.COMPLETED,
          "timestamps.completedAt": { $gte: currentYear },
        },
      },
      { $group: { _id: null, total: { $sum: "$fare" } } },
    ]).then((result) => result[0]?.total || 0),
    Ride.aggregate([
      {
        $match: {
          status: RideStatus.COMPLETED,
          "timestamps.completedAt": { $gte: sevenDaysAgo },
        },
      },
      { $group: { _id: null, total: { $sum: "$fare" } } },
    ]).then((result) => result[0]?.total || 0),
    Ride.aggregate([
      {
        $match: {
          status: RideStatus.COMPLETED,
          "timestamps.completedAt": { $gte: thirtyDaysAgo },
        },
      },
      { $group: { _id: null, total: { $sum: "$fare" } } },
    ]).then((result) => result[0]?.total || 0),
    Ride.aggregate([
      { $match: { status: RideStatus.COMPLETED } },
      { $group: { _id: null, avg: { $avg: "$fare" } } },
    ]).then((result) => result[0]?.avg || 0),
    Ride.aggregate([
      { $match: { status: RideStatus.COMPLETED } },
      { $group: { _id: "$vehicleType", total: { $sum: "$fare" } } },
      { $sort: { total: -1 } },
    ]),
    Ride.aggregate([
      { $group: { _id: "$status", total: { $sum: "$fare" } } },
      { $sort: { total: -1 } },
    ]),
    Ride.aggregate([
      { $match: { status: RideStatus.COMPLETED } },
      {
        $group: {
          _id: { $hour: "$timestamps.completedAt" },
          total: { $sum: "$fare" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Ride.aggregate([
      { $match: { status: RideStatus.COMPLETED } },
      {
        $group: {
          _id: { $dayOfWeek: "$timestamps.completedAt" },
          total: { $sum: "$fare" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Ride.aggregate([
      { $match: { status: RideStatus.COMPLETED } },
      {
        $group: {
          _id: "$destinationLocation.name",
          total: { $sum: "$fare" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]),
    Ride.aggregate([
      { $match: { status: RideStatus.CANCELLED } },
      { $group: { _id: null, total: { $sum: "$fare" } } },
    ]).then((result) => result[0]?.total || 0),
    Ride.aggregate([
      {
        $match: {
          status: {
            $in: [
              RideStatus.ACCEPTED,
              RideStatus.PICKED_UP,
              RideStatus.IN_TRANSIT,
            ],
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$fare" } } },
    ]).then((result) => result[0]?.total || 0),
  ]);

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    revenueThisMonth: Math.round(revenueThisMonth * 100) / 100,
    revenueThisYear: Math.round(revenueThisYear * 100) / 100,
    revenueLast7Days: Math.round(revenueLast7Days * 100) / 100,
    revenueLast30Days: Math.round(revenueLast30Days * 100) / 100,
    avgRevenuePerRide: Math.round(avgRevenuePerRide * 100) / 100,
    revenueByVehicleType,
    revenueByStatus,
    revenueByHour,
    revenueByDay,
    topRevenueLocations,
    cancellationRevenueLoss: Math.round(cancellationRevenueLoss * 100) / 100,
    pendingRevenue: Math.round(pendingRevenue * 100) / 100,
  };
};

export const StatsService = {
  getDashboardStats,
  getRideStats,
  getUserStats,
  getDriverStats,
  getRevenueStats,
  getPublicHomepageStats,
};
