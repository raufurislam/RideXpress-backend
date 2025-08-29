// // // ride.validation.ts
// // import { z } from "zod";
// // import { VEHICLE_TYPE } from "./ride.interface";

// // const rideLocationSchema = z.object({
// //   type: z.literal("Point"),
// //   coordinates: z
// //     .tuple([z.number(), z.number()]) // [latitude, longitude]
// //     .refine(
// //       // ([lon, lat]) => lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180,
// //       ([lat, lon]) => lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90,
// //       {
// //         message: "Invalid coordinates",
// //       }
// //     ),
// // });

// // export const createRideZodSchema = z.object({
// //   pickupLocation: rideLocationSchema,
// //   destinationLocation: rideLocationSchema,
// //   vehicleType: z.enum(Object.values(VEHICLE_TYPE) as [string]),
// // });

// // ride.validation.ts
// import { z } from "zod";
// import { VEHICLE_TYPE } from "./ride.interface";

// // Schema for coordinates
// const coordinatesSchema = z
//   .tuple([z.number(), z.number()]) // [lat, lon]
//   .refine(
//     ([lat, lon]) => lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90,
//     {
//       message: "Invalid coordinates",
//     }
//   );

// // Schema for location with both name & coordinates
// const rideLocationSchema = z.object({
//   type: z.literal("Point"),
//   coordinates: coordinatesSchema,
//   name: z.string().min(1, "Location name is required"), // <-- new field
// });

// // Final ride request schema
// export const createRideZodSchema = z.object({
//   pickupLocation: rideLocationSchema,
//   destinationLocation: rideLocationSchema,
//   vehicleType: z.enum(Object.values(VEHICLE_TYPE) as [string]),
// });

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
