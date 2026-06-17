import RBSheet from '@components/BottomUpModal';
import CustomButton from '@components/Button';
import { InputOutline } from '@components/Input';
import SearchField from '@components/SearchField';
import { COLORS, FONT_FAMILIES, ms, s, vs} from '@theme/index';
import { Edit, MapPin, Timer } from 'lucide-react-native';
import React, { memo, useEffect, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useLocation } from '@hooks/useLocation';
import { RootState } from '@store/rootReducer';
import { setBookingDetails } from '@store/slices/Booking/bookingSlice';
import { useFormik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
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
              style={{ color: COLORS.primary[500], marginTop: 10 }}
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
          <KeyboardAwareScrollView scrollEnabled>
            <View style={{ marginTop: 32, gap: 24 }}>
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

              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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

/* ---------------- STYLES ---------------- */
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
    paddingBottom: vs(7),

    gap: s(16),
  },

  title: {
    fontSize: ms(14), // Figma size same
    fontFamily: FONT_FAMILIES.regular,
  },

  subtitle: {
    fontSize: ms(14), // Figma size same
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[500],
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(19),
  },
});
