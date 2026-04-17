import AsyncStorage from '@react-native-async-storage/async-storage';
import MapboxGL from '@rnmapbox/maps';
import { useCallback, useEffect, useRef, useState } from 'react';
import Config from 'react-native-config';

const HISTORY_KEY = 'LOCATION_HISTORY';

export const useLocation = () => {
  const [search, setSearch] = useState('');
  const [current, setCurrent] = useState<any>('');
  const [results, setResults] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const sessionToken = useRef(generateSessionToken());
  const initialSetRef = useRef(false);

  /* ---------------- SESSION ---------------- */
  function generateSessionToken() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  const resetSession = () => {
    sessionToken.current = generateSessionToken();
  };

  /* ---------------- INIT LOCATION ---------------- */
  useEffect(() => {
    MapboxGL.locationManager.start();
  }, []);

  /* ---------------- CURRENT LOCATION ---------------- */
  useEffect(() => {
    const loadCurrentLocation = async () => {
      try {
        const location = await MapboxGL.locationManager.getLastKnownLocation();

        if (!location || initialSetRef.current) return;

        const { latitude, longitude } = location.coords;

        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${Config.MAPBOX_ACCESS_TOKEN}`,
        );

        const data = await res.json();
        const place = data.features?.[0];

        if (place) {
          initialSetRef.current = true;
          setCurrent(place);
        }
      } catch (e) {
        console.log('Location error', e);
      }
    };

    loadCurrentLocation();
  }, []);

  /* ---------------- LOAD HISTORY (AsyncStorage) ---------------- */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await AsyncStorage.getItem(HISTORY_KEY);
        setRecent(data ? JSON.parse(data) : []);
      } catch (e) {
        console.log('Load history error', e);
        setRecent([]);
      }
    };

    loadHistory();
  }, []);

  /* ---------------- SEARCH ---------------- */
  useEffect(() => {
    if (!search || search.length < 3) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
            search,
          )}&limit=10&language=en&session_token=${
            sessionToken.current
          }&country=IN&access_token=${Config.MAPBOX_ACCESS_TOKEN}`,
        );

        const data = await res.json();
        const suggestions = data.suggestions || [];

        const formatted = suggestions.map((s: any) => ({
          id: s.mapbox_id,
          name: s.name,
          fullAddress: s.full_address || s.place_formatted,
          mapboxId: s.mapbox_id,
        }));

        setResults(formatted);
      } catch (e) {
        console.log('Search error', e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  /* ---------------- GET DETAILS ---------------- */
  const getPlaceDetails = async (mapboxId: string) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?session_token=${sessionToken.current}&access_token=${Config.MAPBOX_ACCESS_TOKEN}`,
      );

      const data = await res.json();
      const feature = data.features?.[0];
      const context = feature?.properties?.context || {};

      return {
        lat: feature?.geometry?.coordinates?.[1],
        lng: feature?.geometry?.coordinates?.[0],
        address: feature?.properties?.full_address,
        city:
          context?.place?.name ||
          context?.locality?.name ||
          context?.district?.name ||
          '',
        state: context?.region?.name || '',
        pincode: context?.postcode?.name || '',
      };
    } catch (e) {
      console.log('Details error', e);
      return null;
    }
  };

  /* ---------------- SELECT ---------------- */
  const handleSelect = useCallback(
    async (item: any) => {
      try {
        const details = await getPlaceDetails(item.mapboxId);

        const final = {
          ...item,
          googleAddress: details?.address,
          city: details?.city,
          state: details?.state,
          pincode: details?.pincode,
          coordinates: {
            lat: details?.lat,
            lng: details?.lng,
          },
        };

        setSelected(final);
        setSearch('');

        /* SAVE HISTORY (AsyncStorage) */
        const existing = recent.filter(
          (r: any) => r.mapboxId !== final.mapboxId,
        );

        const updated = [final, ...existing].slice(0, 10);

        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

        setRecent(updated);

        resetSession();
      } catch (e) {
        console.log('Select error', e);
      }
    },
    [recent],
  );

  /* ---------------- CLEAR HISTORY ---------------- */
  const clearHistory = async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
    setRecent([]);
  };

  return {
    search,
    setSearch,
    results,
    recent,
    selected,
    setSelected,
    handleSelect,
    clearHistory,
    loading,
    current,
  };
};
