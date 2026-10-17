
import {useState, useEffect, useCallback} from 'react';
import Config from 'react-native-config';

const GOOGLE_API_KEY = Config.GOOGLE_MAPS_API_KEY;

const AUTOCOMPLETE_URL =
  'https://places.googleapis.com/v1/places:autocomplete';

const PLACE_DETAILS_URL =
  'https://places.googleapis.com/v1/places';

export interface GooglePlaceSuggestion {
  placeId: string;
  placeName: string;
  description: string;
}

export interface GooglePlaceDetails {
  placeId: string;
  placeName: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

interface UseGooglePlacesSearchProps {
  debounceMs?: number;
  country?: string;
}

export const useGooglePlacesSearch = ({
  debounceMs = 500,
  country = 'IN',
}: UseGooglePlacesSearchProps = {}) => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<
    GooglePlaceSuggestion[]
  >([]);
  const [selectedPlace, setSelectedPlace] =
    useState<GooglePlaceDetails | null>(null);

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search places
  const searchPlaces = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        setSuggestions([]);
        setError(null);
        return;
      }

      if (!GOOGLE_API_KEY) {
        setError('Google Maps API key is missing');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(AUTOCOMPLETE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_API_KEY,
            'X-Goog-FieldMask':
              'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
          },
          body: JSON.stringify({
            input: text,
            includedRegionCodes: [country],
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Google Places API error: ${response.status}`,
          );
        }

        const data = await response.json();

        const results: GooglePlaceSuggestion[] =
          (data.suggestions || [])
            .filter((item: any) => item.placePrediction)
            .map((item: any) => {
              const place = item.placePrediction;

              return {
                placeId: place.placeId,
                placeName:
                  place.structuredFormat?.mainText?.text ||
                  place.text?.text ||
                  '',
                description: place.text?.text || '',
              };
            });

        setSuggestions(results);
      } catch (err: any) {
        setError(err.message || 'Unable to search places');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [country],
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchPlaces(searchText);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchText, debounceMs, searchPlaces]);

  // Get selected place latitude and longitude
  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<GooglePlaceDetails | null> => {
      if (!GOOGLE_API_KEY) {
        setError('Google Maps API key is missing');
        return null;
      }

      setDetailsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${PLACE_DETAILS_URL}/${placeId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': GOOGLE_API_KEY,
              'X-Goog-FieldMask':
                'id,displayName,location,formattedAddress',
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `Place details error: ${response.status}`,
          );
        }

        const data = await response.json();

        if (
          typeof data.location?.latitude !== 'number' ||
          typeof data.location?.longitude !== 'number'
        ) {
          throw new Error('Location coordinates not available');
        }

        const result: GooglePlaceDetails = {
          placeId: data.id || placeId,
          placeName: data.displayName?.text || '',
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          formattedAddress: data.formattedAddress || '',
        };

        setSelectedPlace(result);
        setSearchText(result.placeName);
        setSuggestions([]);

        return result;
      } catch (err: any) {
        setError(err.message || 'Unable to get place details');
        return null;
      } finally {
        setDetailsLoading(false);
      }
    },
    [],
  );

  // Select place
  const selectPlace = useCallback(
    async (place: GooglePlaceSuggestion) => {
      return getPlaceDetails(place.placeId);
    },
    [getPlaceDetails],
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchText('');
    setSuggestions([]);
    setSelectedPlace(null);
    setError(null);
  }, []);

  return {
    searchText,
    setSearchText,
    suggestions,
    selectedPlace,
    loading,
    detailsLoading,
    error,
    searchPlaces,
    selectPlace,
    getPlaceDetails,
    clearSearch,
  };
};
