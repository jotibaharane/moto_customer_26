import RBSheet from '@components/BottomUpModal';
import CustomButton from '@components/Button';
import { InputOutline } from '@components/Input';
import SearchField from '@components/SearchField';
import { COLORS, s, vs } from '@theme/index';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  useGetAddressLabelsQuery,
  useGetLocationByLatLngQuery,
  useGetSavedLocationQuery,
  useGetSearchLocationQuery,
} from '@api/api';

import { LoadLocation } from '@api/type';
import { useDebounce } from '@hooks/useDebounce';
import { RootState } from '@store/rootReducer';
import { setPickup } from '@store/slices/Booking/bookingSlice';

import {
  IconBookmarkFilled,
  IconCurrentLocation,
  IconMapPinFilled,
  IconPencil,
} from '@tabler/icons-react-native';

import { useFormik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useDispatch, useSelector } from 'react-redux';

import { styles } from './pickupModal.style';

interface Props {
  open?: boolean;
  onOpen?: (open: boolean) => void;
}

const SEARCH_DEBOUNCE_MS = 500;
const MIN_SEARCH_LENGTH = 2;

const PickupModal: React.FC<Props> = ({ onOpen, open }) => {
  const { pickup } = useSelector((state: RootState) => state?.booking);
  const { currentLocation } = useSelector((state: RootState) => state?.auth);

  const dispatch = useDispatch();

  const refScrollable = useRef<any>(null);

  const [search, setSearch] = useState('');
  const [isCustomBookmark, setIsCustomBookmark] = useState(false);
  const [openGoogleAddress, setOpenGoogleAddress] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* FORM                                                                       */
  /* -------------------------------------------------------------------------- */

  const formik = useFormik<LoadLocation>({
    enableReinitialize: true,

    initialValues: pickup || {
      plotBuilding: '',
      streetArea: '',
      contactMobile: '',
      tag: '',
      latitude: 0,
      longitude: 0,
      fullAddress: '',
    },

    onSubmit: async values => {
      dispatch(setPickup({ pickup: values }));
      onOpen?.(false);
    },
  });

  /* -------------------------------------------------------------------------- */
  /* DEBOUNCED SEARCH                                                           */
  /* -------------------------------------------------------------------------- */

  /**
   * Raw search entered by the user.
   *
   * Example:
   *
   * User types:
   * M
   * Mu
   * Mum
   * Mumb
   * Mumbai
   *
   * Only the final value after 500ms is sent to the API.
   */
  const normalizedSearch = useMemo(() => {
    return search.trim();
  }, [search]);

  const debouncedSearch = useDebounce(normalizedSearch, SEARCH_DEBOUNCE_MS);

  /**
   * Only search when:
   * - user entered at least 2 characters
   * - current location is available
   */
  const canSearch =
    debouncedSearch.length >= MIN_SEARCH_LENGTH &&
    currentLocation?.lat != null &&
    currentLocation?.lng != null;

  const {
    data: locationData,
    isFetching: isSearching,
    isLoading: isSearchLoading,
  } = useGetSearchLocationQuery(
    {
      search: debouncedSearch,
      latitude: currentLocation?.lat ?? 0,
      longitude: currentLocation?.lng ?? 0,
    },
    {
      skip: !canSearch,
    },
  );

  /* -------------------------------------------------------------------------- */
  /* CURRENT LOCATION                                                           */
  /* -------------------------------------------------------------------------- */

  const { data: currentLocationData, refetch: refetchCurrentLocation } =
    useGetLocationByLatLngQuery({
      latitude: currentLocation?.lat ?? 0,
      longitude: currentLocation?.lng ?? 0,
    });

  /* -------------------------------------------------------------------------- */
  /* SAVED LOCATIONS / ADDRESS TAGS                                             */
  /* -------------------------------------------------------------------------- */

  const { data: savedLocationData, refetch: refetchSavedLocations } =
    useGetSavedLocationQuery();

  const { data: addressTag, refetch: refetchTags } = useGetAddressLabelsQuery();

  /* -------------------------------------------------------------------------- */
  /* MODAL OPEN / CLOSE                                                         */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (open) {
      refScrollable?.current?.open();

      refetchSavedLocations();
      refetchCurrentLocation();
      refetchTags();
    } else {
      refScrollable?.current?.close();
    }
  }, [open, refetchSavedLocations, refetchCurrentLocation, refetchTags]);

  /* -------------------------------------------------------------------------- */
  /* SEARCH HANDLER                                                             */
  /* -------------------------------------------------------------------------- */

  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearch('');
  }, []);

  /* -------------------------------------------------------------------------- */
  /* SELECT CURRENT LOCATION                                                    */
  /* -------------------------------------------------------------------------- */

  const handleSelectCurrentLocation = useCallback(() => {
    const location = currentLocationData?.data;

    if (!location) {
      return;
    }

    formik.setFieldValue('name', location.name);
    formik.setFieldValue('fullAddress', location.fullAddress);
    formik.setFieldValue('latitude', location.latitude);
    formik.setFieldValue('longitude', location.longitude);

    setSearch('');
    setOpenGoogleAddress(false);
  }, [currentLocationData, formik]);

  /* -------------------------------------------------------------------------- */
  /* SELECT SAVED LOCATION                                                      */
  /* -------------------------------------------------------------------------- */

  const handleSelectSavedLocation = useCallback(
    (item: any) => {
      formik.setValues({
        name: item?.PlaceName ?? '',
        fullAddress: item?.FullAddress ?? '',
        latitude: item?.Latitude ?? 0,
        longitude: item?.Longitude ?? 0,
        plotBuilding: item?.PlotBuilding ?? '',
        streetArea: item?.StreetArea ?? '',
        contactMobile: item?.ContactMobile ?? '',
        tag: item?.Tag ?? '',
      });

      setSearch('');
      setOpenGoogleAddress(false);
    },
    [formik],
  );

  /* -------------------------------------------------------------------------- */
  /* SELECT SEARCH RESULT                                                       */
  /* -------------------------------------------------------------------------- */

  const handleSelectSearchLocation = useCallback(
    (item: any) => {
      formik.setFieldValue('name', item?.name ?? '');
      formik.setFieldValue('fullAddress', item?.fullAddress ?? '');
      formik.setFieldValue('latitude', item?.latitude ?? 0);
      formik.setFieldValue('longitude', item?.longitude ?? 0);

      setSearch('');
      setOpenGoogleAddress(false);
    },
    [formik],
  );

  /* -------------------------------------------------------------------------- */
  /* SELECT ADDRESS TAG                                                         */
  /* -------------------------------------------------------------------------- */

  const handleSelectTag = useCallback(
    (tag: string) => {
      formik.setFieldValue('tag', tag);
      setIsCustomBookmark(false);
    },
    [formik],
  );

  /* -------------------------------------------------------------------------- */
  /* ENABLE CUSTOM TAG                                                          */
  /* -------------------------------------------------------------------------- */

  const handleAddCustomBookmark = useCallback(() => {
    formik.setFieldValue('tag', '');
    setIsCustomBookmark(true);
  }, [formik]);

  /* -------------------------------------------------------------------------- */
  /* DISABLE CUSTOM TAG                                                         */
  /* -------------------------------------------------------------------------- */

  const handleRemoveCustomBookmark = useCallback(() => {
    setIsCustomBookmark(false);
    formik.setFieldValue('tag', '');
  }, [formik]);

  /* -------------------------------------------------------------------------- */
  /* SEARCH RESULTS                                                             */
  /* -------------------------------------------------------------------------- */

  const searchResults = useMemo(() => {
    if (!canSearch) {
      return [];
    }

    return locationData?.data ?? [];
  }, [canSearch, locationData]);

  /* -------------------------------------------------------------------------- */
  /* SAVED LOCATIONS                                                            */
  /* -------------------------------------------------------------------------- */

  const savedLocations = useMemo(() => {
    if (normalizedSearch.length > 0) {
      return [];
    }

    return savedLocationData?.data ?? [];
  }, [normalizedSearch, savedLocationData]);

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <RBSheet
      ref={refScrollable}
      height={700}
      draggable
      customModalProps={{
        animationType: 'slide',
        statusBarTranslucent: true,
      }}
      customStyles={{
        container: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
        draggableIcon: {
          width: 80,
        },
      }}
      onOpen={() => onOpen?.(true)}
      onClose={() => onOpen?.(false)}
    >
      {!formik?.values?.fullAddress || openGoogleAddress ? (
        /* -------------------------------------------------------------------- */
        /* SEARCH SCREEN                                                        */
        /* -------------------------------------------------------------------- */

        <View style={styles.gridContainer}>
          <SearchField
            iconType="location"
            placeholder="Pick up Address"
            value={search}
            onChangeText={handleSearchChange}
            iconColor="#4CAF50"
            containerStyle={{
              borderWidth: 1,
              marginBottom: vs(16),
            }}
          />

          {/* --------------------------------------------------------------- */}
          {/* SEARCHING INDICATOR                                             */}
          {/* --------------------------------------------------------------- */}

          {normalizedSearch.length >= MIN_SEARCH_LENGTH &&
            (isSearching || isSearchLoading) && (
              <View
                style={{
                  paddingVertical: vs(12),
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator size="small" color={COLORS.primary[500]} />
              </View>
            )}

          <View style={{ height: 10 }} />

          {/* --------------------------------------------------------------- */}
          {/* CURRENT LOCATION                                                */}
          {/* --------------------------------------------------------------- */}

          {normalizedSearch.length === 0 && currentLocationData?.data && (
            <Pressable
              onPress={handleSelectCurrentLocation}
              style={styles.currentLoactionButton}
            >
              <Text style={styles.listLabel}>Current Location</Text>

              <View style={styles.listContainer}>
                <IconCurrentLocation size={20} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>
                    {currentLocationData?.data?.name}
                  </Text>

                  <Text style={styles.subtitle}>
                    {currentLocationData?.data?.fullAddress}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

          {/* --------------------------------------------------------------- */}
          {/* SAVED LOCATIONS                                                 */}
          {/* --------------------------------------------------------------- */}

          {savedLocations.length > 0 && (
            <FlatList
              data={savedLocations}
              keyExtractor={(item, index) =>
                item?.mapboxId || item?.PlaceName || index.toString()
              }
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSelectSavedLocation(item)}>
                  <View style={styles.bookmarkListContiner}>
                    <Text style={styles.listLabel}>{item?.Tag}</Text>

                    <View
                      style={{
                        flexDirection: 'row',
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{item?.PlaceName}</Text>

                        <Text style={styles.subtitle}>{item?.FullAddress}</Text>
                      </View>

                      <IconBookmarkFilled
                        size={20}
                        fill={COLORS.primary[500]}
                      />
                    </View>
                  </View>
                </Pressable>
              )}
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingBottom: vs(100),
              }}
              keyboardShouldPersistTaps="handled"
            />
          )}

          {/* --------------------------------------------------------------- */}
          {/* SEARCH RESULTS                                                  */}
          {/* --------------------------------------------------------------- */}

          {normalizedSearch.length >= MIN_SEARCH_LENGTH &&
            !isSearching &&
            searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) =>
                  item?.mapboxId || index.toString()
                }
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelectSearchLocation(item)}
                    style={styles.listItem}
                  >
                    <IconMapPinFilled size={20} />

                    <View style={{ flex: 1 }}>
                      <Text style={styles.title}>{item?.name}</Text>

                      <Text style={styles.subtitle}>{item?.fullAddress}</Text>
                    </View>
                  </Pressable>
                )}
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingBottom: vs(100),
                }}
                keyboardShouldPersistTaps="handled"
              />
            )}

          {/* --------------------------------------------------------------- */}
          {/* NO RESULTS                                                      */}
          {/* --------------------------------------------------------------- */}

          {canSearch &&
            !isSearching &&
            !isSearchLoading &&
            searchResults.length === 0 && (
              <View
                style={{
                  paddingVertical: vs(30),
                  alignItems: 'center',
                }}
              >
                <Text style={styles.subtitle}>No locations found</Text>
              </View>
            )}

          {/* --------------------------------------------------------------- */}
          {/* MINIMUM CHARACTERS                                              */}
          {/* --------------------------------------------------------------- */}

          {normalizedSearch.length === 1 && (
            <View
              style={{
                paddingVertical: vs(20),
                alignItems: 'center',
              }}
            >
              <Text style={styles.subtitle}>
                Type at least 2 characters to search
              </Text>
            </View>
          )}
        </View>
      ) : (
        /* ------------------------------------------------------------------ */
        /* SELECTED LOCATION SCREEN                                           */
        /* ------------------------------------------------------------------ */

        <View style={styles.gridContainer}>
          <View style={styles.headerRow}>
            <IconMapPinFilled size={32} fill="#4CAF50" />

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {formik?.values?.name || 'No location'}
              </Text>

              <Text style={styles.subtitle}>
                {formik?.values?.fullAddress || 'No address'}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                setOpenGoogleAddress(true);
                setSearch('');
              }}
            >
              <IconPencil size={24} />
            </Pressable>
          </View>

          <KeyboardAwareScrollView scrollEnabled>
            <View
              style={{
                marginTop: vs(32),
                gap: s(24),
              }}
            >
              <InputOutline
                placeholder="Plot / unit / Building"
                value={formik.values.plotBuilding}
                onChangeText={formik.handleChange('plotBuilding')}
              />

              <InputOutline
                placeholder="Street / Area / Sector / Village"
                value={formik.values.streetArea}
                onChangeText={formik.handleChange('streetArea')}
              />

              <InputOutline
                placeholder="Alternative Phone Number"
                value={formik.values.contactMobile}
                onChangeText={formik.handleChange('contactMobile')}
                keyboardType="phone-pad"
                characterCount={10}
              />

              <Text style={styles.sectionTitle}>Save Address As</Text>

              {/* ------------------------------------------------------------ */}
              {/* BOOKMARKS                                                     */}
              {/* ------------------------------------------------------------ */}

              <View style={styles.bookmarkContainer}>
                {addressTag?.data?.map((item: any, index: number) => {
                  const isSelected = formik?.values?.tag === item?.Tag;

                  return (
                    <Pressable
                      key={`${item?.Tag}-${index}`}
                      onPress={() => handleSelectTag(item?.Tag)}
                      style={[
                        styles.gridButtonContainer,
                        {
                          borderColor: isSelected
                            ? COLORS.primary[500]
                            : '#ccc',

                          backgroundColor: isSelected ? '#E8F5E9' : 'white',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.gridLabel,
                          {
                            color: isSelected ? COLORS.primary[500] : '#333',

                            width: '100%',
                            textAlign: 'center',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {item?.Tag}
                      </Text>
                    </Pressable>
                  );
                })}

                {/* ---------------------------------------------------------- */}
                {/* CUSTOM BOOKMARK                                             */}
                {/* ---------------------------------------------------------- */}

                {!isCustomBookmark ? (
                  <Pressable
                    onPress={handleAddCustomBookmark}
                    style={[
                      styles.gridButtonContainer,
                      {
                        borderColor: '#ccc',
                        backgroundColor: 'white',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.gridLabel,
                        {
                          color: '#333',
                          width: '100%',
                          textAlign: 'center',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      + Add New
                    </Text>
                  </Pressable>
                ) : (
                  <View style={styles.customeBookmarkFieldContiner}>
                    <TextInput
                      placeholder="Enter custom label (e.g. Shop, Office 2)"
                      value={formik?.values?.tag}
                      onChangeText={text => {
                        formik.setFieldValue('tag', text);
                      }}
                      style={styles.bookmarkField}
                    />

                    <Pressable onPress={handleRemoveCustomBookmark}>
                      <Text style={styles.closeButton}>✕</Text>
                    </Pressable>
                  </View>
                )}
              </View>

              {/* ------------------------------------------------------------ */}
              {/* CONFIRM                                                       */}
              {/* ------------------------------------------------------------ */}

              <CustomButton
                title="Confirm Pickup Address"
                variant="filled"
                style={{
                  alignSelf: 'center',
                  paddingHorizontal: s(24),
                }}
                onPress={formik.handleSubmit}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      )}
    </RBSheet>
  );
};

export default memo(PickupModal);
