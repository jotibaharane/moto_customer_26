import RBSheet from '@components/BottomUpModal';
import CustomButton from '@components/Button';
import { InputOutline } from '@components/Input';
import SearchField from '@components/SearchField';
import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { Edit, MapPin, Timer } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useLocation } from '@hooks/useLocation';
import { RootState } from '@store/rootReducer';
import { setBookingDetails } from '@store/slices/Booking/bookingSlice';
import { setDestination } from '@store/slices/map/mapSlice';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  open?: boolean;
  onOpen?: (open: boolean) => void;
  setModalVisible?: (open: boolean) => void;
}

const DropModal: React.FC<Props> = ({ onOpen, open, setModalVisible }) => {
  const refScrollable = useRef<any>(null);
  const dispatch = useDispatch();

  const booking = useSelector((state: RootState) => state.booking.booking);
  const savedDrop: any = booking?.delivery;

  /* 🔥 LOCATION HOOK */
  const {
    search,
    setSearch,
    results,
    recent,
    selected,
    setSelected,
    handleSelect,
    clearHistory,
  } = useLocation();

  /* 🔥 FORM */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: savedDrop?.id || '',
      consigneeName: savedDrop?.consigneeName || '',
      contactNumber: savedDrop?.contactNumber || '',
      plotOrBuilding: savedDrop?.plotOrBuilding || '',
      streetArea: savedDrop?.streetArea || '',
      googleAddress: savedDrop?.googleAddress || '',
      city: savedDrop?.city || '',
      district: savedDrop?.district || '',
      taluka: savedDrop?.taluka || '',
      state: savedDrop?.state || '',
      pincode: savedDrop?.pincode || '',
    },
    onSubmit: values => {
      const finalData = {
        ...selected,
        ...values,
      };

      /* ✅ SAVE REDUX */
      dispatch(
        setBookingDetails({
          ...booking,
          delivery: finalData,
        }),
      );
      dispatch(setDestination(finalData?.coordinates));
      // setModalVisible?.(true);
      onOpen?.(false);
    },
  });

  /* ---------------- MODAL ---------------- */
  useEffect(() => {
    if (open) refScrollable?.current?.open();
    else refScrollable?.current?.close();
  }, [open]);

  useEffect(() => {
    if (open) {
      setSearch('');
    }
  }, [open]);
  const dataToShow = search ? results : recent;

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
              placeholder="Delivery Address"
              value={search}
              onChangeText={setSearch}
              iconColor="#FF0A0A"
              containerStyle={{ borderWidth: 1 }}
            />

            {!search && recent.length > 0 && (
              <Text
                onPress={clearHistory}
                style={{ color: COLORS.primary[500], marginTop: hp(10) }}
              >
                Clear History
              </Text>
            )}

            <FlatList
              data={dataToShow}
              keyExtractor={(item, index) => item?.mapboxId || index.toString()}
              renderItem={({ item }) => (
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
              )}
            />
          </View>
        ) : (
          /* 📍 SELECTED SCREEN */
          <View style={styles.gridContainer}>
            <View style={styles.headerRow}>
              <MapPin size={32} fill={'#FF0A0A'} />

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{selected?.name}</Text>
                <Text style={styles.subtitle}>{selected?.googleAddress}</Text>
              </View>

              <Pressable onPress={() => setSelected(null)}>
                <Edit size={24} />
              </Pressable>
            </View>

            {/* FORM */}
            <View style={{ marginTop: hp(32), gap: hp(24) }}>
              <InputOutline
                placeholder="Plot / unit / Building"
                value={formik.values.plotOrBuilding}
                onChangeText={formik.handleChange('plotOrBuilding')}
              />

              <InputOutline
                placeholder="Street / Area"
                value={formik.values.streetArea}
                onChangeText={formik.handleChange('streetArea')}
              />

              <InputOutline
                placeholder="Receiver Name"
                value={formik.values.consigneeName}
                onChangeText={formik.handleChange('consigneeName')}
              />

              <InputOutline
                placeholder="Receiver Phone Number"
                value={formik.values.contactNumber}
                onChangeText={formik.handleChange('contactNumber')}
                keyboardType="phone-pad"
                characterCount={10}
              />

              <CustomButton
                title="Confirm Delivery Address"
                onPress={formik.handleSubmit}
                style={{ marginTop: hp(24) }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </RBSheet>
  );
};

export default DropModal;

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
});
