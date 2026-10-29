
import RBSheet from '@components/BottomUpModal';
import CustomButton from '@components/Button';
import {InputOutline} from '@components/Input';
import SearchField from '@components/SearchField';

import {COLORS, s, vs} from '@theme/index';
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
} from '@api/api';

import {LoadLocation} from '@api/type';
import {useGooglePlacesSearch} from './../../../../features/maps/useGooglePlacesSearch';
import {RootState} from '@store/rootReducer';
import {setPickup} from '@store/slices/Booking/bookingSlice';

import {
  IconBookmarkFilled,
  IconCurrentLocation,
  IconMapPinFilled,
  IconPencil,
} from '@tabler/icons-react-native';

import {useFormik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {useDispatch, useSelector} from 'react-redux';

import {styles} from './pickupModal.style';

interface Props {
  open?: boolean;
  onOpen?: (open: boolean) => void;
}

const MIN_SEARCH_LENGTH = 2;

const PickupModal: React.FC<Props> = ({onOpen, open}) => {
  const {pickup} = useSelector(
    (state: RootState) => state?.booking,
  );

  const {currentLocation} = useSelector(
    (state: RootState) => state?.auth,
  );

  const dispatch = useDispatch();

  const refScrollable = useRef<any>(null);

  const [isCustomBookmark, setIsCustomBookmark] = useState(false);
  const [openGoogleAddress, setOpenGoogleAddress] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* GOOGLE PLACES SEARCH                                                       */
  /* -------------------------------------------------------------------------- */

  const {
    searchText,
    setSearchText,
    suggestions,
    loading: isSearching,
    detailsLoading,
    error: searchError,
    selectPlace,
    clearSearch,
  } = useGooglePlacesSearch({
    debounceMs: 500,
    country: 'IN',
  });

  const normalizedSearch = useMemo(
    () => searchText.trim(),
    [searchText],
  );

  const canSearch = normalizedSearch.length >= MIN_SEARCH_LENGTH;

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
      dispatch(setPickup({pickup: values}));
      onOpen?.(false);
    },
  });

  /* -------------------------------------------------------------------------- */
  /* CURRENT LOCATION                                                           */
  /* -------------------------------------------------------------------------- */

  const {
    data: currentLocationData,
    // refetch: refetchCurrentLocation,
  } = useGetLocationByLatLngQuery(
    {
      latitude: currentLocation?.lat ?? 0,
      longitude: currentLocation?.lng ?? 0,
    },
    {
      skip:
        !open ||
        currentLocation?.lat == null ||
        currentLocation?.lng == null,
    },
  );

  /* -------------------------------------------------------------------------- */
  /* SAVED LOCATIONS / ADDRESS TAGS                                             */
  /* -------------------------------------------------------------------------- */

  const {
    data: savedLocationData,
    refetch: refetchSavedLocations,
  } = useGetSavedLocationQuery();

  const {data: addressTag, refetch: refetchTags} =
    useGetAddressLabelsQuery();

  /* -------------------------------------------------------------------------- */
  /* MODAL OPEN / CLOSE                                                         */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (open) {
      refScrollable.current?.open();

      refetchSavedLocations();
      // refetchCurrentLocation();
      refetchTags();
    } else {
      refScrollable.current?.close();
    }
  }, [
    open,
    refetchSavedLocations,
    // refetchCurrentLocation,
    refetchTags,
  ]);

  /* -------------------------------------------------------------------------- */
  /* SEARCH HANDLERS                                                            */
  /* -------------------------------------------------------------------------- */

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchText(text);
    },
    [setSearchText],
  );

  const handleClearSearch = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  /* -------------------------------------------------------------------------- */
  /* RESET ADDRESS FIELDS                                                       */
  /* -------------------------------------------------------------------------- */

  const resetAddressFields = useCallback(() => {
    setIsCustomBookmark(false);
    setSearchText('');
    setOpenGoogleAddress(false);
  }, [setSearchText]);

  /* -------------------------------------------------------------------------- */
  /* SELECT CURRENT LOCATION                                                    */
  /* -------------------------------------------------------------------------- */

  const handleSelectCurrentLocation = useCallback(() => {
    const location = currentLocationData?.data;

    if (!location) {
      return;
    }

    formik.setValues({
      mapboxId: location.mapboxId ?? '',
      name: location.name ?? '',
      fullAddress: location.fullAddress ?? '',
      latitude: location.latitude ?? 0,
      longitude: location.longitude ?? 0,
      plotBuilding: '',
      streetArea: '',
      contactMobile: '',
      tag: '',
    });

    resetAddressFields();
  }, [currentLocationData, formik, resetAddressFields]);

  /* -------------------------------------------------------------------------- */
  /* SELECT SAVED LOCATION                                                      */
  /* -------------------------------------------------------------------------- */

  const handleSelectSavedLocation = useCallback(
    (item: any) => {
      formik.setValues({
        mapboxId: item?.MapboxId ?? '',
        name: item?.PlaceName ?? '',
        fullAddress: item?.FullAddress ?? '',
        latitude: item?.Latitude ?? 0,
        longitude: item?.Longitude ?? 0,
        plotBuilding: item?.PlotBuilding ?? '',
        streetArea: item?.StreetArea ?? '',
        contactMobile: item?.ContactMobile ?? '',
        tag: item?.Tag ?? '',
      });

      resetAddressFields();
    },
    [formik, resetAddressFields],
  );

  /* -------------------------------------------------------------------------- */
  /* SELECT GOOGLE PLACES RESULT                                                */
  /* -------------------------------------------------------------------------- */

  const handleSelectSearchLocation = useCallback(
    async (item: any) => {
      try {
        const place = await selectPlace(item);

        if (!place) {
          return;
        }

        formik.setValues({
          // Temporary backward-compatible mapping.
          // This is a Google Place ID, not a Mapbox ID.
          mapboxId: place.placeId,

          name: place.placeName,

          fullAddress: place.formattedAddress,

          latitude: place.latitude,

          longitude: place.longitude,

          plotBuilding: '',
          streetArea: '',
          contactMobile: '',
          tag: '',
        });

        resetAddressFields();
      } catch (error) {
        console.log('Google Place selection error:', error);
      }
    },
    [selectPlace, formik, resetAddressFields],
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

const isMobileValid = /^[0-9]{10}$/.test(
  formik.values.contactMobile || '',
);

  /* -------------------------------------------------------------------------- */
  /* CUSTOM TAG HANDLERS                                                        */
  /* -------------------------------------------------------------------------- */

  const handleAddCustomBookmark = useCallback(() => {
    formik.setFieldValue('tag', '');
    setIsCustomBookmark(true);
  }, [formik]);

  const handleRemoveCustomBookmark = useCallback(() => {
    setIsCustomBookmark(false);
    formik.setFieldValue('tag', '');
  }, [formik]);

  /* -------------------------------------------------------------------------- */
  /* GOOGLE SEARCH RESULTS                                                      */
  /* -------------------------------------------------------------------------- */

  const searchResults = useMemo(() => {
    if (!canSearch) {
      return [];
    }

    return suggestions;
  }, [canSearch, suggestions]);

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
      {!formik.values.fullAddress || openGoogleAddress ? (
        <View style={styles.gridContainer}>
          {/* SEARCH INPUT */}

          <SearchField
            iconType="location"
            placeholder="Pick up Address"
            value={searchText}
            onChangeText={handleSearchChange}
            numberOfLines={2}
            iconColor="#4CAF50"
            containerStyle={{
              borderWidth: 1,
              marginBottom: vs(16),
            }}
          />

          {/* SEARCH LOADING */}

          {(isSearching || detailsLoading) && canSearch && (
            <View
              style={{
                paddingVertical: vs(12),
                alignItems: 'center',
              }}
            >
              <ActivityIndicator
                size="small"
                color={COLORS.primary[500]}
              />
            </View>
          )}

          {/* SEARCH ERROR */}

          {!!searchError && (
            <Text
              style={{
                color: 'red',
                marginBottom: vs(10),
              }}
            >
              {searchError}
            </Text>
          )}

          <View style={{height: 10}} />

          {/* CURRENT LOCATION */}

          {normalizedSearch.length === 0 &&
            currentLocationData?.data && (
              <Pressable
                onPress={handleSelectCurrentLocation}
                style={styles.currentLoactionButton}
              >
                <Text style={styles.listLabel}>
                  Current Location
                </Text>

                <View style={styles.listContainer}>
                  <IconCurrentLocation size={20} />

                  <View style={{flex: 1}}>
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

          {/* SAVED LOCATIONS */}

          {savedLocations.length > 0 && (
            <FlatList
              data={savedLocations}
              keyExtractor={(item, index) =>
                item?.mapboxId ||
                item?.PlaceName ||
                index.toString()
              }
              renderItem={({item}) => (
                <Pressable
                  onPress={() => handleSelectSavedLocation(item)}
                >
                  <View style={styles.bookmarkListContiner}>
                    <Text style={styles.listLabel}>
                      {item?.Tag}
                    </Text>

                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.title}>
                          {item?.PlaceName}
                        </Text>

                        <Text style={styles.subtitle}>
                          {item?.FullAddress}
                        </Text>
                      </View>

                      <IconBookmarkFilled
                        size={20}
                        fill={COLORS.primary[500]}
                      />
                    </View>
                  </View>
                </Pressable>
              )}
              style={{flex: 1}}
              contentContainerStyle={{
                paddingBottom: vs(100),
              }}
              keyboardShouldPersistTaps="handled"
            />
          )}

          {/* GOOGLE PLACES SEARCH RESULTS */}

          {canSearch &&
            !isSearching &&
            searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                keyExtractor={item => item.placeId}
                renderItem={({item}) => (
                  <Pressable
                    disabled={detailsLoading}
                    onPress={() => handleSelectSearchLocation(item)}
                    style={styles.listItem}
                  >
                    <IconMapPinFilled size={20} />

                    <View style={{flex: 1}}>
                      <Text style={styles.title}>
                        {item.placeName}
                      </Text>

                      <Text style={styles.subtitle}>
                        {item.description}
                      </Text>
                    </View>
                  </Pressable>
                )}
                style={{flex: 1}}
                contentContainerStyle={{
                  paddingBottom: vs(100),
                }}
                keyboardShouldPersistTaps="handled"
              />
            )}

          {/* NO RESULTS */}

          {canSearch &&
            !isSearching &&
            !detailsLoading &&
            searchResults.length === 0 &&
            !searchError && (
              <View
                style={{
                  paddingVertical: vs(30),
                  alignItems: 'center',
                }}
              >
                <Text style={styles.subtitle}>
                  No locations found
                </Text>
              </View>
            )}

          {/* MINIMUM CHARACTERS */}

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
        /* SELECTED LOCATION SCREEN */

        <View style={styles.gridContainer}>
          <View style={styles.headerRow}>
            <IconMapPinFilled
              size={32}
              fill="#4CAF50"
            />

            <View style={{flex: 1}}>
              <Text style={styles.title}>
                {formik.values.name || 'No location'}
              </Text>

              <Text style={styles.subtitle}>
                {formik.values.fullAddress || 'No address'}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                setOpenGoogleAddress(true);
                setSearchText('');
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

              {/* <InputOutline
                placeholder="Alternative Phone Number"
                value={formik.values.contactMobile}
                onChangeText={formik.handleChange('contactMobile')}
                keyboardType="phone-pad"
                characterCount={10}
              /> */}
<InputOutline
  placeholder="Alternative Phone Number"
  value={formik.values.contactMobile}
  onChangeText={text =>
    formik.setFieldValue(
      'contactMobile',
      text.replace(/\D/g, '').slice(0, 10),
    )
  }
  keyboardType="phone-pad"
  characterCount={10}
  borderColor={isMobileValid ? '#4CAF50' : '#FF0000'}
/>
              <Text style={styles.sectionTitle}>
                Save Address As
              </Text>

              {/* ADDRESS TAGS */}

              <View style={styles.bookmarkContainer}>
                {addressTag?.data?.map(
                  (item: any, index: number) => {
                    const isSelected =
                      formik.values.tag === item?.Tag;

                    return (
                      <Pressable
                        key={`${item?.Tag}-${index}`}
                        onPress={() =>
                          handleSelectTag(item?.Tag)
                        }
                        style={[
                          styles.gridButtonContainer,
                          {
                            borderColor: isSelected
                              ? COLORS.primary[500]
                              : '#ccc',
                            backgroundColor: isSelected
                              ? '#E8F5E9'
                              : 'white',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.gridLabel,
                            {
                              color: isSelected
                                ? COLORS.primary[500]
                                : '#333',
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
                  },
                )}

                {/* CUSTOM BOOKMARK */}

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
                  <View
                    style={styles.customeBookmarkFieldContiner}
                  >
                    <TextInput
                      placeholder="Enter custom label (e.g. Shop, Office 2)"
                      value={formik.values.tag}
                      onChangeText={text =>
                        formik.setFieldValue('tag', text)
                      }
                      style={styles.bookmarkField}
                    />

                    <Pressable
                      onPress={handleRemoveCustomBookmark}
                    >
                      <Text style={styles.closeButton}>
                        ✕
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>

              {/* CONFIRM PICKUP */}

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
