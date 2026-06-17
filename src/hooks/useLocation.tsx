import { reverseGeocode } from '@api/mapbox/mapbox.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import MapboxGL from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN } from '@utils/constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
const HISTORY_KEY = 'LOCATION_HISTORY';

export const useLocation = () => {
  const [search, setSearch] = useState('');
  const [current, setCurrent] = useState<any>(null);
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

  /* ---------------- PERMISSION ---------------- */
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const init = async () => {
      const granted = await requestLocationPermission();
      if (granted) {
        MapboxGL.locationManager.start();
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    };

    init();
  }, []);

  /* ---------------- GET CURRENT LOCATION ---------------- */
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        try {
          if (!position) return;

          const { latitude, longitude } = position.coords;

          const res = await reverseGeocode(latitude, longitude);

          const place = res?.features?.[0];
          console.log({ place });
          if (place) {
            const formatted = {
              id: place?.properties?.mapbox_id,
              type: 'current',
              name: place?.text,
              fullAddress: place?.place_name,
              mapboxId: place?.properties?.mapbox_id,
              coordinates: {
                lat: latitude,
                lng: longitude,
              },
            };

            setCurrent(formatted);
          }
        } catch (e) {
          console.log('Geocode error', e);
        }
      },
      err => console.log('Fast error', err),
      {
        enableHighAccuracy: false, // 🔥 FAST
        timeout: 5000,
        maximumAge: 20000,
      },
    );
  };

  /* ---------------- LOAD HISTORY ---------------- */
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
          }&country=IN&access_token=${MAPBOX_ACCESS_TOKEN}`,
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
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?session_token=${
          sessionToken.current
        }&access_token=${MAPBOX_ACCESS_TOKEN}`,
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

        let final = {
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

        if (item?.type !== 'current') {
          const existing = recent.filter(
            (r: any) => r.mapboxId !== final.mapboxId,
          );

          const updated = [final, ...existing].slice(0, 10);

          await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
          setRecent(updated);
        }

        resetSession();
      } catch (e) {
        console.log('Select error', e);
      }
    },
    [recent],
  );

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
    getCurrentLocation,
  };
};
