// utils/calculateFare.ts
export const calculateFare = (distanceInKm: number): number => {
  const baseFare = 50;
  const ratePerKm = 30;
  const totalFare = baseFare + ratePerKm * distanceInKm;

  return Math.round(totalFare);
};
