import { Types } from "mongoose";

interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  picture?: string;
  password?: string;
  phone?: string;
  address?: string;
  auths: IAuthProvider[];
  role: Role;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  rides?: Types.ObjectId[];
}

export enum VehicleType {
  CAR = "SEDAN",
  SUV = "SUV",
  HATCHBACK = "HATCHBACK",
  MICROBUS = "MICROBUS",
  MOTORCYCLE = "MOTORCYCLE",
}

export enum Status {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface IRide {
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId;
  pickupLocation?: string;
  destinationLocation?: string;
  status: Status;
  fare?: number;
  vehicleType: VehicleType;
  timestamps: {
    requestedAt?: 
    acceptedAt?: 
        pickedUpAt?: 
    completedAt?: 
    cancelledAt?: 
  };
  cancellationReason?: string

  // distance: string; // dynamic optional
  // duration: string; // dynamic optional
  // paymentMethod: string;
  // paymentStatus: string;
}

const rideSchema = new Schema<IRide>(
  {
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User" },

    pickupLocation: {
      type: String,
        required: [true, "Pickup address is required"],
    },
    destinationLocation: {
       type: String,
        required: [true, "Pickup address is required"],
    },

    status: {
      type: String,
      enum: [
       
      ],
      default: "requested",
    },

    fare: { type: Number },
    cancellationReason: { type: String },

    timestamps: {
      
    },
    Status:
    VehicleType:
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



export const Ride = model<IRide>("Ride", rideSchema);