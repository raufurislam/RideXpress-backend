// rideStatus.ts
import { RideStatus } from "./ride.interface";

export const ACTIVE_RIDE_STATUSES = [
  RideStatus.REQUESTED,
  RideStatus.ACCEPTED,
  RideStatus.PICKED_UP,
  RideStatus.IN_TRANSIT,
];

export const rideStatusFlow: Record<RideStatus, RideStatus[]> = {
  [RideStatus.REQUESTED]: [RideStatus.ACCEPTED, RideStatus.REJECTED],
  [RideStatus.ACCEPTED]: [RideStatus.PICKED_UP],
  [RideStatus.PICKED_UP]: [RideStatus.IN_TRANSIT],
  [RideStatus.IN_TRANSIT]: [RideStatus.COMPLETED],
  [RideStatus.COMPLETED]: [],
  [RideStatus.REJECTED]: [],
  [RideStatus.CANCELLED]: [],
};

export const getFullRideStatusFlow = (): string => {
  const flow: string[] = [];
  let current: RideStatus | undefined = RideStatus.REQUESTED;

  const visited = new Set<string>();

  while (current && !visited.has(current)) {
    flow.push(current);
    visited.add(current);
    current = rideStatusFlow[current]?.[0]; // Only follow the primary path
  }

  return flow.join(" → ");
};
