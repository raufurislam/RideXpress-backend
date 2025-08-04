// driver.validation.ts
import z from "zod";
import { DRIVER_STATUS } from "./driver.interface";

export const driverApplicationZodSchema = z.object({
  vehicleType: z.string({ required_error: "Vehicle type is required" }),
  vehicleModel: z.string({ required_error: "Vehicle model is required" }),
  licenseNumber: z.string({ required_error: "License number is required" }),
  vehicleNumber: z.string({ required_error: "Vehicle number is required" }),
});

// For updating driver status (admin action)
export const updateDriverApplicationZodSchema = z.object({
  driverStatus: z.nativeEnum(DRIVER_STATUS, {
    required_error: "Driver status is required",
    invalid_type_error: "Invalid driver status",
  }),
});
