import z from "zod";

// driver.validation.ts
export const driverZodSchema = z.object({
  userId: z.string({ required_error: "User ID is required" }),
  vehicleType: z.string({ required_error: "Vehicle type is required" }),
  vehicleModel: z.string({ required_error: "Vehicle model is required" }),
  licenseNumber: z.string({ required_error: "License number is required" }),
  vehicleNumber: z.string({ required_error: "Vehicle number is required" }),
});
