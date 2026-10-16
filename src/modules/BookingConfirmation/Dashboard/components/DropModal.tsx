
import RBSheet from '@components/BottomUpModal';
import CustomButton from '@components/Button';
import {InputOutline} from '@components/Input';
import SearchField from '@components/SearchField';

import {COLORS, FONT_FAMILIES, ms, s, vs} from '@theme/index';

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

import {LoadLocation} from '@api/type';

import {useGooglePlacesSearch} from '../../../../features/maps/useGooglePlacesSearch';

import {RootState} from '@store/rootReducer';
import {setDelivery} from '@store/slices/Booking/bookingSlice';

import {
  IconClockHour4,
  IconMapPinFilled,
  IconPencil,
} from '@tabler/icons-react-native';

import {useFormik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

import {useDispatch, useSelector} from 'react-redux';

interface Props {
  open?: boolean;
  onOpen?: (open: boolean) => void;
  setModalVisible?: (open: boolean) => void;
}

/* -------------------------------------------------------------------------- */
/* CONFIG                                                                     */
/* -------------------------------------------------------------------------- */

const MIN_SEARCH_LENGTH = 2;

const DropModal: React.FC<Props> = ({onOpen, open}) => {
  const dispatch = useDispatch();

  const {delivery} = useSelector(
    (state: RootState) => state.booking,
  );

  const refScrollable = useRef<any>(null);

  /* ------------------------------------------------------------------------ */
  /* GOOGLE PLACES SEARCH                                                     */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* STATE                                                                    */
  /* ------------------------------------------------------------------------ */

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
  /* SEARCH RESULTS                                                           */
  /* ------------------------------------------------------------------------ */

  const searchResults = useMemo(() => {
    if (!canSearch) {
      return [];
    }

    return suggestions;
  }, [canSearch, suggestions]);

  /* ------------------------------------------------------------------------ */
  /* SEARCH INPUT HANDLER                                                     */
  /* ------------------------------------------------------------------------ */

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchText(text);
    },
    [setSearchText],
  );

  /* ------------------------------------------------------------------------ */
  /* RESET SEARCH                                                             */
  /* ------------------------------------------------------------------------ */

  const handleClearSearch = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  /* ------------------------------------------------------------------------ */
  /* SELECT GOOGLE PLACE                                                      */
  /* ------------------------------------------------------------------------ */

  const handleSelectLocation = useCallback(
    async (item: (typeof suggestions)[number]) => {
      try {
        const place = await selectPlace(item);

        if (!place) {
          return;
        }

        formik.setValues({
          // Google Place ID stored temporarily in the old field.
          mapboxId: place.placeId,

          name: place.placeName,

          fullAddress: place.formattedAddress,

          latitude: place.latitude,

          longitude: place.longitude,

          plotBuilding: '',
          streetArea: '',
          contactName: '',
          contactMobile: '',
        });

        setSearchText('');
        setOpenGoogleAddress(false);
      } catch (error) {
        console.log('Google Places selection error:', error);
      }
    },
    [selectPlace, formik, setSearchText],
  );

  /* ------------------------------------------------------------------------ */
  /* EDIT ADDRESS                                                             */
  /* ------------------------------------------------------------------------ */

  const handleEditAddress = useCallback(() => {
    clearSearch();
    setOpenGoogleAddress(true);
  }, [clearSearch]);

  /* ------------------------------------------------------------------------ */
  /* MODAL OPEN / CLOSE                                                       */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (open) {
      refScrollable.current?.open();
    } else {
      refScrollable.current?.close();
      clearSearch();
      setOpenGoogleAddress(false);
    }
  }, [open, clearSearch]);

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
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
      {!formik.values.fullAddress || openGoogleAddress ? (
        /* ================================================================== */
        /* SEARCH SCREEN                                                       */
        /* ================================================================== */

        <View style={styles.gridContainer}>
          <SearchField
            iconType="location"
            placeholder="Delivery Address"
            value={searchText}
            onChangeText={handleSearchChange}
            iconColor="#FF0A0A"
            containerStyle={{
              borderWidth: 1,
            }}
          />

          {/* SEARCH LOADING */}

          {(isSearching || detailsLoading) && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FF0A0A" />

              <Text style={styles.loadingText}>
                {detailsLoading ? 'Getting location...' : 'Searching...'}
              </Text>
            </View>
          )}

          {/* GOOGLE API ERROR */}

          {!!searchError && (
            <View style={styles.messageContainer}>
              <Text style={styles.errorText}>{searchError}</Text>
            </View>
          )}

          {/* MINIMUM SEARCH MESSAGE */}

          {normalizedSearch.length === 1 && (
            <View style={styles.messageContainer}>
              <Text style={styles.subtitle}>
                Type at least 2 characters to search
              </Text>
            </View>
          )}

          {/* GOOGLE PLACES RESULTS */}

          <FlatList
            data={searchResults}
            keyExtractor={item => item.placeId}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <Pressable
                disabled={detailsLoading}
                onPress={() => handleSelectLocation(item)}
                style={styles.listItem}
              >
                <IconMapPinFilled size={20} />

                <View style={styles.locationContent}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.placeName}
                  </Text>

                  <Text style={styles.subtitle} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              canSearch &&
              !isSearching &&
              !detailsLoading &&
              !searchError ? (
                <View style={styles.messageContainer}>
                  <IconClockHour4 size={22} />

                  <Text style={styles.subtitle}>
                    No locations found
                  </Text>
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
          {/* SELECTED LOCATION */}

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

          {/* DELIVERY FORM */}

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

              {/* CONFIRM DELIVERY */}

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

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(19),
  },

  formContainer: {
    marginTop: vs(32),
    gap: vs(24),
  },

  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

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

  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    paddingVertical: vs(30),
  },

  errorText: {
    fontSize: ms(13),
    color: '#FF0A0A',
    fontFamily: FONT_FAMILIES.regular,
    textAlign: 'center',
  },
});
