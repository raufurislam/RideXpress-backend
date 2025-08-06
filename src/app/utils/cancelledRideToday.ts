// utils/cancelledRideToday.ts
import { RideStatus } from "../modules/ride/ride.interface";
import { Ride } from "../modules/ride/ride.model";

export const cancelledRideToday = async (userId: string): Promise<number> => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const cancelledCount = await Ride.countDocuments({
    riderId: userId,
    status: RideStatus.CANCELLED,
    "timestamps.cancelledAt": { $gte: startOfDay, $lte: endOfDay },
  });

  return cancelledCount;
};
