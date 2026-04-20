import RBSheet from '@components/BottomUpModal';
import CustomButton from '@components/Button';
import { InputOutline } from '@components/Input';
import SearchField from '@components/SearchField';
import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { Bookmark, Edit, Locate, MapPin, Timer } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useLocation } from '@hooks/useLocation';

import { useGetBookmarksQuery, usePostBookmarkMutation } from '@api/Mutations';
import { RootState } from '@store/rootReducer';
import { setBookingDetails } from '@store/slices/Booking/bookingSlice';
import { setPickup } from '@store/slices/map/mapSlice';
import { bookmarkData } from '@utils/constants';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  open?: boolean;
  onOpen?: (open: boolean) => void;
}

const PickupModal: React.FC<Props> = ({ onOpen, open }) => {
  const refScrollable = useRef<any>(null);
  const dispatch = useDispatch();
  const customer = useSelector((state: RootState) => state.auth);
  const [bookmarkAddress] = usePostBookmarkMutation();
  const { data: bookmarksData, refetch } = useGetBookmarksQuery({
    CustomerID: customer?.CustomerID!,
  });

  /* ---------------- REDUX ---------------- */

  const booking = useSelector((state: RootState) => state.booking.booking);
  const savedPickup: any = booking?.pickup;

  /* ---------------- LOCATION HOOK ---------------- */
  const {
    search,
    setSearch,
    results,
    recent,
    selected,
    setSelected,
    handleSelect,
    clearHistory,
    current,
  } = useLocation();
  const [isCustomBookmark, setIsCustomBookmark] = useState(false);
  const [customBookmark, setCustomBookmark] = useState(
    savedPickup?.bookmark || '',
  );
  /* ---------------- BOOKMARK STATE ---------------- */
  const [selectedBookmark, setSelectedBookmark] = useState(
    savedPickup?.bookmark || '',
  );

  /* ---------------- FORM ---------------- */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      plot: savedPickup?.plot || '',
      street: savedPickup?.street || '',
      phone: savedPickup?.phone || '',
      bookmark: savedPickup?.bookmark || '',
    },
    onSubmit: async values => {
      const finalBookmark = isCustomBookmark
        ? customBookmark
        : selectedBookmark;
      const finalData = {
        ...selected,
        ...values,
        bookmark: finalBookmark,
      };

      /* ✅ SAVE REDUX */
      dispatch(
        setBookingDetails({
          ...booking,
          pickup: finalData,
        }),
      );

      /* ✅ SAVE LAT LNG */
      if (finalData?.coordinates) {
        dispatch(setPickup(finalData.coordinates));
      }

      /* ✅ CALL BOOKMARK API */
      if (selectedBookmark && selectedBookmark !== ' +Add New') {
        try {
          await bookmarkAddress({
            CustomerID: customer?.CustomerID || '',

            PickupAddress: finalData.googleAddress || '',
            AddressType: selectedBookmark,

            PickupCity: finalData.city || '',
            PickupState: finalData.state || '',
            PickupPincode: finalData.pincode || '',
            PickupDistrict: finalData.district || '',
            PickupTaluka: finalData.taluka || '',

            PickupLat: finalData.coordinates?.lat || '',
            PickupLng: finalData.coordinates?.lng || '',

            PickupPlotBuilding: values.plot || '',
            PickupStreetArea: values.street || '',

            SenderContactNo: values.phone || '',
            SenderName: '',
          });
          refetch();
          setCustomBookmark('');
          setSelectedBookmark('');
        } catch (e) {
          console.log('Bookmark error', e);
        }
      }

      onOpen?.(false);
    },
  });

  /* ---------------- MODAL OPEN CLOSE ---------------- */
  useEffect(() => {
    if (open) {
      refScrollable?.current?.open();
    } else {
      refScrollable?.current?.close();
    }
  }, [open]);

  /* ---------------- RESTORE DATA ---------------- */
  useEffect(() => {
    if (savedPickup && !selected) {
      setSelected(savedPickup);
    }

    if (savedPickup?.bookmark) {
      setSelectedBookmark(savedPickup.bookmark);
    }
  }, [savedPickup]);

  const formattedBookmarks = Array.isArray(bookmarksData?.data)
    ? bookmarksData?.data?.map((item: any) => ({
        type: 'bookmark',
        id: item.PickupID.toString(),
        bookmark: item.AddressType,
        title: item.PickupCity,
        subtitle: item.PickupAddress,
        original: item,
      }))
    : [];
  console.log({ current });
  const currentLocationItem = current ? [current] : [];

  /* ---------------- DATA ---------------- */
  const dataToShow = search
    ? [...currentLocationItem, ...results]
    : [...currentLocationItem, ...formattedBookmarks, ...recent];
  console.log({ selected });
  return (
    <RBSheet
      ref={refScrollable}
      height={hp(700)}
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
      <ScrollView keyboardShouldPersistTaps="handled">
        {!selected ? (
          /* 🔍 SEARCH SCREEN */
          <View style={styles.gridContainer}>
            <SearchField
              iconType="location"
              placeholder="Pick up Address"
              value={search}
              onChangeText={setSearch}
              iconColor="#4CAF50"
              containerStyle={{ borderWidth: 1 }}
            />

            {/* {!search && recent.length > 0 && (
              <Text
                onPress={clearHistory}
                style={{ color: COLORS.primary[500], marginTop: hp(10) }}
              >
                Clear History
              </Text>
            )} */}
            <View style={{ height: hp(10) }} />
            <FlatList
              data={dataToShow}
              keyExtractor={(item, index) => item?.mapboxId || index.toString()}
              renderItem={({ item }) => {
                if (item.type === 'current') {
                  return (
                    <Pressable
                      onPress={() => handleSelect(item)}
                      style={{
                        borderBottomWidth: 1,
                        marginBottom: hp(16),
                        paddingBottom: hp(7),
                        alignItems: 'flex-start',
                        gap: wp(10),
                        flexDirection: 'column',
                      }}
                    >
                      <Text style={styles.listLabel}>Current Location</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: wp(16),
                        }}
                      >
                        <Locate size={20} />

                        <View style={{ flex: 1 }}>
                          <Text style={styles.title}>
                            {item.name || item.city}
                          </Text>
                          <Text style={styles.subtitle}>
                            {item.fullAddress || item.googleAddress}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                }
                /* ✅ BOOKMARK ITEM (NEW) */
                if (item.type === 'bookmark') {
                  return (
                    <Pressable
                      onPress={() => {
                        const b = item.original;

                        const selectedData = {
                          mapboxId: b.PickupID.toString(),
                          name: b.PickupCity,
                          fullAddress: b.PickupAddress,
                          googleAddress: b.PickupAddress,
                          city: b.PickupCity,
                          pincode: b.PickupPincode,
                          district: b.PickupDistrict,
                          taluka: b.PickupTaluka,
                          coordinates: {
                            lat: b.PickupLat,
                            lng: b.PickupLng,
                          },
                          bookmark: b.AddressType,
                          contactNumber: b.senderContactNo,
                        };

                        /* ✅ SET SELECTED */
                        setSelected(selectedData);

                        /* ✅ AUTO FILL FORM */
                        setSelectedBookmark(b.AddressType);
                        formik.setValues({
                          ...formik.values,
                          phone: b.senderContactNo || '',
                          bookmark: b.AddressType,
                        });
                      }}
                    >
                      <View
                        style={{
                          borderBottomWidth: 1,
                          marginBottom: hp(16),
                          paddingBottom: hp(7),
                          gap: hp(8),
                        }}
                      >
                        <Text style={styles.listLabel}>{item.bookmark}</Text>

                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>
                          </View>

                          <Bookmark size={20} fill={COLORS.primary[500]} />
                        </View>
                      </View>
                    </Pressable>
                  );
                }

                /* ✅ KEEP YOUR EXISTING CODE SAME */
                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    style={styles.listItem}
                  >
                    {search ? <MapPin size={20} /> : <Timer size={20} />}

                    <View style={{ flex: 1 }}>
                      <Text style={styles.title}>{item.name || item.city}</Text>
                      <Text style={styles.subtitle}>
                        {item.fullAddress || item.googleAddress}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>
        ) : (
          /* 📍 SELECTED SCREEN */
          <View style={styles.gridContainer}>
            <View style={styles.headerRow}>
              <MapPin size={32} fill={'#4CAF50'} />

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>
                  {selected?.name || selected?.city || 'No location'}
                </Text>
                <Text style={styles.subtitle}>
                  {selected?.googleAddress || 'No address'}
                </Text>
              </View>

              <Pressable onPress={() => setSelected(null)}>
                <Edit size={24} />
              </Pressable>
            </View>

            {/* FORM */}
            <View style={{ marginTop: hp(32), gap: hp(24) }}>
              <InputOutline
                placeholder="Plot / unit / Building"
                value={formik.values.plot}
                onChangeText={formik.handleChange('plot')}
              />

              <InputOutline
                placeholder="Street / Area / Sector / Village"
                value={formik.values.street}
                onChangeText={formik.handleChange('street')}
              />

              <InputOutline
                placeholder="Alternative Phone Number"
                value={formik.values.phone}
                onChangeText={formik.handleChange('phone')}
                keyboardType="phone-pad"
                characterCount={10}
              />

              <Text style={styles.sectionTitle}>Save Address As</Text>

              {/* ✅ BOOKMARK UI */}
              <View style={styles.bookmarkContainer}>
                {bookmarkData.map((item, index) => {
                  const isSelected =
                    selectedBookmark === item.bookmark && !isCustomBookmark;
                  if (isCustomBookmark && item.bookmark.trim() === '+Add New') {
                    return;
                  }
                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        if (item.bookmark.trim() === '+Add New') {
                          setIsCustomBookmark(true);
                          setSelectedBookmark('');
                        } else {
                          setIsCustomBookmark(false);
                          setSelectedBookmark(item.bookmark);
                          formik.setFieldValue('bookmark', item.bookmark);
                        }
                      }}
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
                      >
                        {item.bookmark}
                      </Text>
                    </Pressable>
                  );
                })}
                {isCustomBookmark && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      marginTop: hp(12),
                      width: wp(150),
                    }}
                  >
                    <TextInput
                      placeholder="Enter custom label (e.g. Shop, Office 2)"
                      value={customBookmark}
                      onChangeText={text => {
                        setCustomBookmark(text);
                        setSelectedBookmark(text);
                        formik.setFieldValue('bookmark', text);
                      }}
                      style={{
                        flex: 1,
                        height: 40,
                      }}
                    />

                    <Pressable
                      onPress={() => {
                        setIsCustomBookmark(false);
                        setCustomBookmark('');
                        setSelectedBookmark('');
                        formik.setFieldValue('bookmark', '');
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          color: COLORS.gray[500],
                          paddingHorizontal: 8,
                        }}
                      >
                        ✕
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>

              <CustomButton
                title="Confirm Pickup Address"
                variant="filled"
                style={{ marginTop: hp(24) }}
                onPress={formik.handleSubmit}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </RBSheet>
  );
};

export default PickupModal;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    padding: fp(16),
    marginBottom: 20,
  },
  listItem: {
    borderBottomWidth: 1,
    marginBottom: hp(16),
    paddingBottom: hp(7),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(16),
  },
  title: {
    fontSize: fp(14),
    fontFamily: FONT_FAMILIES.regular,
  },
  subtitle: {
    fontSize: fp(14),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(19),
  },
  sectionTitle: {
    fontSize: fp(16),
    fontFamily: FONT_FAMILIES.medium,
  },
  bookmarkContainer: {
    flexDirection: 'row',
    gap: wp(12),
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridButtonContainer: {
    flexBasis: '25%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  gridLabel: {
    fontSize: 14,
    color: '#333',
    padding: 8,
  },
  listLabel: {
    fontSize: fp(14),
    fontFamily: FONT_FAMILIES.medium,
    color: COLORS.primary[500],
  },
});
