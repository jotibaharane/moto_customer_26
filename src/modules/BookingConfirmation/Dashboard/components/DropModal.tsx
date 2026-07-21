import RBSheet from '@components/BottomUpModal';
import CustomButton from '@components/Button';
import { InputOutline } from '@components/Input';
import SearchField from '@components/SearchField';
import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';
import { Edit, MapPin, Timer } from 'lucide-react-native';
import React, { memo, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useGetSearchLocationQuery } from '@api/query';
import { LoadLocation } from '@api/type';
import { useCurrentLocation } from '@hooks/useCurrentLocation';
import { RootState } from '@store/rootReducer';
import { setDelivery } from '@store/slices/Booking/bookingSlice';
import { useFormik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  open?: boolean;
  onOpen?: (open: boolean) => void;
  setModalVisible?: (open: boolean) => void;
}

const DropModal: React.FC<Props> = ({ onOpen, open }) => {
  const { location } = useCurrentLocation();
  const refScrollable = useRef<any>(null);
  const [search, setSearch] = useState('');
  const { data: locationData } = useGetSearchLocationQuery({
    search: search,
    latitude: location?.lat,
    longitude: location?.lng,
  });
  const dispatch = useDispatch();
  const [openGoogleAddress, setOpenGoogleAddress] = useState(false);
  const { delivery } = useSelector((state: RootState) => state.booking);

  /* 🔥 FORM */
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
      dispatch(setDelivery({ delivery: values }));
      onOpen?.(false);
    },
  });

  /* ---------------- MODAL ---------------- */
  useEffect(() => {
    if (open) refScrollable?.current?.open();
    else refScrollable?.current?.close();
  }, [open]);

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

          <FlatList
            data={locationData?.data}
            keyExtractor={(item, index) => item?.mapboxId || index.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  formik?.setFieldValue('name', item.name);
                  formik?.setFieldValue('fullAddress', item.fullAddress);
                  formik?.setFieldValue('latitude', item.latitude);
                  formik?.setFieldValue('longitude', item.longitude);
                  setOpenGoogleAddress(false);
                }}
                style={styles.listItem}
              >
                {search ? <MapPin size={20} /> : <Timer size={20} />}

                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.subtitle}>{item.fullAddress}</Text>
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
              <Text style={styles.title}>{formik.values.name}</Text>
              <Text style={styles.subtitle}>{formik.values.fullAddress}</Text>
            </View>

            <Pressable onPress={() => setOpenGoogleAddress(true)}>
              <Edit size={24} />
            </Pressable>
          </View>

          {/* FORM */}
          <KeyboardAwareScrollView scrollEnabled>
            <View style={{ marginTop: 32, gap: 24 }}>
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
