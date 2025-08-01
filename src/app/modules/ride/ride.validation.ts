// ride.validation.ts
import { z } from "zod";
import { Status, VEHICLE_TYPE } from "./ride.interface";

export const rideZodSchema = z.object({
  riderId: z.string({ required_error: "Rider ID is required" }),
  driverId: z.string().optional(),
  pickupLocation: z.string({ required_error: "Pickup location is required" }),
  destinationLocation: z.string({
    required_error: "Destination location is required",
  }),

  status: z.nativeEnum(Status).optional(),
  fare: z.number().optional(),
  cancellationReason: z.string().optional(),

  vehicleType: z.nativeEnum(VEHICLE_TYPE, {
    required_error: "Vehicle type is required",
  }),

  timestamps: z
    .object({
      requestedAt: z.string().datetime().optional(),
      acceptedAt: z.string().datetime().optional(),
      pickedUpAt: z.string().datetime().optional(),
      completedAt: z.string().datetime().optional(),
      cancelledAt: z.string().datetime().optional(),
    })
    .optional(),
});
