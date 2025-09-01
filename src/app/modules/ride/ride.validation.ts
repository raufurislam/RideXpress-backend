// ride.validation.ts
import { z } from "zod";
import { VEHICLE_TYPE } from "./ride.interface";

const coordinatesSchema = z
  .tuple([z.number(), z.number()]) // [lat, lng]
  .refine(
    ([lat, lng]) => lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180,
    {
      message: "Invalid coordinates",
    }
  );

const rideLocationSchema = z.object({
  type: z.literal("Point"),
  coordinates: coordinatesSchema,
  name: z.string().min(1, "Location name is required"),
});

export const createRideZodSchema = z.object({
  pickupLocation: rideLocationSchema,
  destinationLocation: rideLocationSchema,
  vehicleType: z.enum(Object.values(VEHICLE_TYPE) as [string]),
});
