import { useEffect, useRef, useState } from 'react';
import Config from 'react-native-config';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DistanceResult {
  distanceKm: number;
  durationMin: number;
  durationText: string;
}

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${Math.round(minutes)} min`;

  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  return `${hrs} hr ${mins} min`;
};

export const useDistance = (pickup?: Coordinates, drop?: Coordinates) => {
  const [data, setData] = useState<DistanceResult | null>(null);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<any>(null);
  const requestIdRef = useRef(0);

  /* ✅ FIXED VALIDATION */
  const isValid = (loc?: Coordinates) =>
    loc &&
    typeof loc.lat === 'number' &&
    typeof loc.lng === 'number' &&
    loc.lat !== 0 &&
    loc.lng !== 0;

  const getDistance = async () => {
    if (!isValid(pickup) || !isValid(drop)) {
      setData(null);
      return;
    }

    const currentRequestId = ++requestIdRef.current;

    try {
      setLoading(true);
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup?.lng},${pickup?.lat};${drop?.lng},${drop?.lat}?access_token=${Config.MAPBOX_ACCESS_TOKEN}&overview=false`;

      const res = await fetch(url);
      const json = await res.json();

      if (currentRequestId !== requestIdRef.current) return;

      const route = json.routes?.[0];
      if (!route) {
        setData(null);
        return;
      }

      const distanceKm = route.distance / 1000;
      const durationMin = route.duration / 60;

      setData({
        distanceKm: Number(distanceKm.toFixed(2)),
        durationMin: Number(durationMin.toFixed(0)),
        durationText: formatDuration(durationMin),
      });
    } catch (error) {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 DEBOUNCE */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      getDistance();
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pickup?.lat, pickup?.lng, drop?.lat, drop?.lng]);

  return {
    distance: data,
    loading,
    refetch: getDistance,
  };
};
