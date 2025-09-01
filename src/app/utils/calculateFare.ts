// utils/calculateFare.ts
import { VEHICLE_TYPE } from "../modules/ride/ride.interface";

interface FareOptions {
  distanceInKm: number;
  vehicleType: VEHICLE_TYPE;
}

export const calculateFare = ({
  distanceInKm,
  vehicleType,
}: FareOptions): number => {
  let baseFare = 0;
  let ratePerKm = 0;

  switch (vehicleType) {
    case VEHICLE_TYPE.CAR:
      baseFare = 50;
      ratePerKm = 30;
      break;
    case VEHICLE_TYPE.BIKE:
      baseFare = 30;
      ratePerKm = 15;
      break;
    default:
      baseFare = 50;
      ratePerKm = 30;
  }

  return Math.round(baseFare + ratePerKm * distanceInKm);
};
