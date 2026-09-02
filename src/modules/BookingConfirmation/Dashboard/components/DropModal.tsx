import RBSheet from '@components/BottomUpModal';
import CustomButton from '@components/Button';
import { InputOutline } from '@components/Input';
import SearchField from '@components/SearchField';
import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';
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
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useGetSearchLocationQuery } from '@api/api';
import { LoadLocation } from '@api/type';
import { useDebounce } from '@hooks/useDebounce';
import { RootState } from '@store/rootReducer';
import { setDelivery } from '@store/slices/Booking/bookingSlice';

import {
  IconClockHour4,
  IconMapPinFilled,
  IconPencil,
} from '@tabler/icons-react-native';

import { useFormik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  open?: boolean;
  onOpen?: (open: boolean) => void;
  setModalVisible?: (open: boolean) => void;
}

/* -------------------------------------------------------------------------- */
/* CONFIG                                                                     */
/* -------------------------------------------------------------------------- */

const SEARCH_DEBOUNCE_DELAY = 500;
const MIN_SEARCH_LENGTH = 2;

const DropModal: React.FC<Props> = ({ onOpen, open }) => {
  const dispatch = useDispatch();

  const { currentLocation } = useSelector((state: RootState) => state.auth);

  const { delivery } = useSelector((state: RootState) => state.booking);

  const refScrollable = useRef<any>(null);

  /* ------------------------------------------------------------------------ */
  /* STATE                                                                    */
  /* ------------------------------------------------------------------------ */

  const [search, setSearch] = useState('');
  const [openGoogleAddress, setOpenGoogleAddress] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* FORM                                                                     */
  /* ------------------------------------------------------------------------ */

  const formik = useFormik<LoadLocation>({
    enableReinitialize: true,

    initialValues: delivery || {
      fullAddress: '',
      latitude: 0,
      longitude: 0,
      plotBuilding: '',
      streetArea: '',
      contactName: '',
      contactMobile: '',
    },

    onSubmit: values => {
      dispatch(
        setDelivery({
          delivery: values,
        }),
      );

      onOpen?.(false);
    },
  });

  /* ------------------------------------------------------------------------ */
  /* SEARCH                                                                    */
  /* ------------------------------------------------------------------------ */

  /**
   * Normalize the search text before debounce.
   *
   * Example:
   *
   * "  Mumbai  " -> "Mumbai"
   */
  const normalizedSearch = useMemo(() => search.trim(), [search]);

  /**
   * Debounce API search.
   *
   * API will NOT be called for every keystroke.
   *
   * User:
   *
   * M
   * Mu
   * Mum
   * Mumb
   * Mumba
   * Mumbai
   *
   * API request:
   *
   * Mumbai -> after 500ms
   */
  const debouncedSearch = useDebounce(normalizedSearch, SEARCH_DEBOUNCE_DELAY);

  /**
   * Only allow API search when:
   *
   * 1. Search has minimum 2 characters
   * 2. Latitude exists
   * 3. Longitude exists
   */
  const canSearch =
    debouncedSearch.length >= MIN_SEARCH_LENGTH &&
    currentLocation?.lat != null &&
    currentLocation?.lng != null;

  const {
    data: locationData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
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

  /* ------------------------------------------------------------------------ */
  /* SEARCH RESULTS                                                            */
  /* ------------------------------------------------------------------------ */

  const searchResults = useMemo(() => {
    if (!canSearch) {
      return [];
    }

    return locationData?.data ?? [];
  }, [canSearch, locationData]);

  const isSearching = canSearch && (isSearchLoading || isSearchFetching);

  /* ------------------------------------------------------------------------ */
  /* SEARCH INPUT HANDLER                                                      */
  /* ------------------------------------------------------------------------ */

  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* SELECT SEARCH RESULT                                                      */
  /* ------------------------------------------------------------------------ */

  const handleSelectLocation = useCallback(
    (item: any) => {
      formik.setFieldValue('mapboxId', item?.mapboxId ?? '');

      formik.setFieldValue('name', item?.name ?? '');

      formik.setFieldValue('fullAddress', item?.fullAddress ?? '');

      formik.setFieldValue('latitude', item?.latitude ?? 0);

      formik.setFieldValue('longitude', item?.longitude ?? 0);

      /**
       * Clear search after selecting location.
       *
       * This also prevents another unnecessary
       * API request after selecting the location.
       */
      setSearch('');

      setOpenGoogleAddress(false);
    },
    [formik],
  );

  /* ------------------------------------------------------------------------ */
  /* OPEN EDIT ADDRESS                                                        */
  /* ------------------------------------------------------------------------ */

  const handleEditAddress = useCallback(() => {
    setSearch('');
    setOpenGoogleAddress(true);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* MODAL                                                                     */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (open) {
      refScrollable?.current?.open();
    } else {
      refScrollable?.current?.close();

      /**
       * Reset search when modal closes.
       */
      setSearch('');
    }
  }, [open]);

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                    */
  /* ------------------------------------------------------------------------ */

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
      }}
      onOpen={() => onOpen?.(true)}
      onClose={() => onOpen?.(false)}
    >
      {!formik?.values?.fullAddress || openGoogleAddress ? (
        /* ================================================================== */
        /* SEARCH SCREEN                                                       */
        /* ================================================================== */

        <View style={styles.gridContainer}>
          <SearchField
            iconType="location"
            placeholder="Delivery Address"
            value={search}
            onChangeText={handleSearchChange}
            iconColor="#FF0A0A"
            containerStyle={{
              borderWidth: 1,
            }}
          />

          {/* ================================================================ */}
          {/* SEARCHING                                                        */}
          {/* ================================================================ */}

          {isSearching && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FF0A0A" />

              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {/* ================================================================ */}
          {/* MINIMUM SEARCH MESSAGE                                           */}
          {/* ================================================================ */}

          {normalizedSearch.length === 1 && !isSearching && (
            <View style={styles.messageContainer}>
              <Text style={styles.subtitle}>
                Type at least 2 characters to search
              </Text>
            </View>
          )}

          {/* ================================================================ */}
          {/* SEARCH RESULTS                                                    */}
          {/* ================================================================ */}

          <FlatList
            data={searchResults}
            keyExtractor={(item, index) =>
              item?.mapboxId ?? `location-${index}`
            }
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectLocation(item)}
                style={styles.listItem}
              >
                <IconMapPinFilled size={20} />

                <View style={styles.locationContent}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item?.name}
                  </Text>

                  <Text style={styles.subtitle} numberOfLines={2}>
                    {item?.fullAddress}
                  </Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              canSearch && !isSearching ? (
                <View style={styles.messageContainer}>
                  <IconClockHour4 size={22} />

                  <Text style={styles.subtitle}>No locations found</Text>
                </View>
              ) : null
            }
            contentContainerStyle={{
              paddingBottom: vs(100),
              flexGrow: searchResults.length === 0 ? 1 : 0,
            }}
          />
        </View>
      ) : (
        /* ================================================================== */
        /* SELECTED ADDRESS SCREEN                                             */
        /* ================================================================== */

        <View style={styles.gridContainer}>
          {/* ================================================================ */}
          {/* SELECTED LOCATION                                                */}
          {/* ================================================================ */}

          <View style={styles.headerRow}>
            <IconMapPinFilled size={32} fill="#FF0A0A" />

            <View style={styles.locationContent}>
              <Text style={styles.title} numberOfLines={2}>
                {formik.values.name || 'Selected Location'}
              </Text>

              <Text style={styles.subtitle} numberOfLines={3}>
                {formik.values.fullAddress}
              </Text>
            </View>

            <Pressable onPress={handleEditAddress} hitSlop={10}>
              <IconPencil size={24} />
            </Pressable>
          </View>

          {/* ================================================================ */}
          {/* DELIVERY FORM                                                    */}
          {/* ================================================================ */}

          <KeyboardAwareScrollView
            scrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <InputOutline
                placeholder="Plot / unit / Building"
                value={formik.values.plotBuilding}
                onChangeText={formik.handleChange('plotBuilding')}
              />

              <InputOutline
                placeholder="Street / Area"
                value={formik.values.streetArea}
                onChangeText={formik.handleChange('streetArea')}
              />

              <InputOutline
                placeholder="Receiver Name"
                value={formik.values.contactName}
                onChangeText={formik.handleChange('contactName')}
              />

              <InputOutline
                placeholder="Receiver Phone Number"
                value={formik.values.contactMobile}
                onChangeText={formik.handleChange('contactMobile')}
                keyboardType="phone-pad"
                characterCount={10}
              />

              <View style={styles.buttonContainer}>
                <CustomButton
                  title="Confirm Delivery Address"
                  onPress={formik.handleSubmit}
                  style={{
                    alignSelf: 'center',
                    paddingHorizontal: 24,
                  }}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      )}
    </RBSheet>
  );
};

export default memo(DropModal);

/* ========================================================================= */
/* STYLES                                                                    */
/* ========================================================================= */

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    padding: s(16),
    marginBottom: vs(20),
  },

  /* ----------------------------------------------------------------------- */
  /* LIST                                                                     */
  /* ----------------------------------------------------------------------- */

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: vs(16),
    paddingBottom: vs(12),
    gap: s(16),
  },

  locationContent: {
    flex: 1,
  },

  title: {
    fontSize: ms(14),
    fontFamily: FONT_FAMILIES.regular,
  },

  subtitle: {
    fontSize: ms(14),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
  },

  /* ----------------------------------------------------------------------- */
  /* HEADER                                                                   */
  /* ----------------------------------------------------------------------- */

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(19),
  },

  /* ----------------------------------------------------------------------- */
  /* FORM                                                                     */
  /* ----------------------------------------------------------------------- */

  formContainer: {
    marginTop: vs(32),
    gap: vs(24),
  },

  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ----------------------------------------------------------------------- */
  /* LOADING                                                                  */
  /* ----------------------------------------------------------------------- */

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    paddingVertical: vs(12),
  },

  loadingText: {
    fontSize: ms(13),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
  },

  /* ----------------------------------------------------------------------- */
  /* EMPTY / MESSAGE                                                          */
  /* ----------------------------------------------------------------------- */

  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    paddingVertical: vs(30),
  },
});
