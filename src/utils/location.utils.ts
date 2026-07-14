export interface Location {
    latitude: any;
    longitude: any;
} 

export const isValidLocation = (loc?: Location | null): boolean => {
  return (
    !!loc &&
    loc.latitude !== undefined &&
    loc.longitude !== undefined &&
    loc.latitude !== 0 &&
    loc.longitude !== 0
  );
};
