export interface Location {
  lat?: number;
  lng?: number;
}

export const isValidLocation = (loc?: Location | null): boolean => {
  return (
    !!loc &&
    loc.lat !== undefined &&
    loc.lng !== undefined &&
    loc.lat !== 0 &&
    loc.lng !== 0
  );
};
