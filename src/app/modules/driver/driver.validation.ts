// driver.validation.ts
import z from "zod";
import { AVAILABILITY, DRIVER_STATUS } from "./driver.interface";

export const driverApplicationZodSchema = z.object({
  vehicleType: z.string({ required_error: "Vehicle type is required" }),
  vehicleModel: z.string({ required_error: "Vehicle model is required" }),
  licenseNumber: z.string({ required_error: "License number is required" }),
  vehicleNumber: z.string({ required_error: "Vehicle number is required" }),
});

export const updateDriverApplicationZodSchema = z.object({
  driverStatus: z.nativeEnum(DRIVER_STATUS, {
    required_error: "Driver status is required",
    invalid_type_error: "Invalid driver status",
  }),
});

export const updateAvailabilityZodSchema = z.object({
  availability: z.nativeEnum(AVAILABILITY, {
    required_error: "Availability status is required",
    invalid_type_error: "Invalid availability value",
  }),
});
