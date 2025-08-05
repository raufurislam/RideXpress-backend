// ride.validation.ts
import { z } from "zod";
import { VEHICLE_TYPE } from "./ride.interface";

const rideLocationSchema = z.object({
  type: z.literal("Point"),
  coordinates: z
    .tuple([z.number(), z.number()]) // [longitude, latitude]
    .refine(
      ([lon, lat]) => lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180,
      {
        message: "Invalid coordinates",
      }
    ),
});

export const createRideZodSchema = z.object({
  pickupLocation: rideLocationSchema,
  destinationLocation: rideLocationSchema,
  vehicleType: z.enum(Object.values(VEHICLE_TYPE) as [string]),
});
