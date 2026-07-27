import RBSheet from '@components/BottomUpModal';
import CustomButton from '@components/Button';
import { InputOutline } from '@components/Input';
import SearchField from '@components/SearchField';
import { COLORS, s, vs } from '@theme/index';
import React, { memo, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

import {
  useGetAddressLabelsQuery,
  useGetSavedLocationQuery,
  useGetSearchLocationQuery,
} from '@api/query';
import { LoadLocation } from '@api/type';
import { useCurrentLocation } from '@hooks/useCurrentLocation';
import { RootState } from '@store/rootReducer';
import { setPickup } from '@store/slices/Booking/bookingSlice';
import {
  IconBookmarkFilled,
  IconClockHour4,
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

const PickupModal: React.FC<Props> = ({ onOpen, open }) => {
  const { pickup } = useSelector((state: RootState) => state?.booking);
  const dispatch = useDispatch();
  /* ---------------- FORM ---------------- */
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
  const { location, currentLocationData } = useCurrentLocation();

  const refScrollable = useRef<any>(null);
  const [search, setSearch] = useState('');
  const { data: locationData } = useGetSearchLocationQuery({
    search: search,
    latitude: location?.lat,
    longitude: location?.lng,
  });

  const { data: savedLocationData, refetch } = useGetSavedLocationQuery();
  const { data: addressTag, refetch: refetchTags } = useGetAddressLabelsQuery();
  const [isCustomBookmark, setIsCustomBookmark] = useState(false);
  const [openGoogleAddress, setOpenGoogleAddress] = useState(false);
  /* ---------------- MODAL OPEN CLOSE ---------------- */
  useEffect(() => {
    if (open) {
      refScrollable?.current?.open();
      refetch();
      refetchTags();
    } else {
      refScrollable?.current?.close();
    }
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
        draggableIcon: {
          width: 80,
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
            placeholder="Pick up Address"
            value={search}
            onChangeText={setSearch}
            iconColor="#4CAF50"
            containerStyle={{
              borderWidth: 1,
              marginBottom: vs(16),
            }}
          />

          <View style={{ height: 10 }} />
          {currentLocationData?.data && (
            <FlatList
              data={
                currentLocationData?.data ? [currentLocationData?.data] : []
              }
              keyExtractor={(item, index) => item?.mapboxId || index.toString()}
              renderItem={({ item }) => {
                return (
                  <Pressable
                    onPress={() => {
                      formik?.setFieldValue('name', item.name);
                      formik?.setFieldValue('fullAddress', item.fullAddress);
                      formik?.setFieldValue('latitude', item.latitude);
                      formik?.setFieldValue('longitude', item.longitude);

                      setOpenGoogleAddress(false);
                    }}
                    style={styles.currentLoactionButton}
                  >
                    <Text style={styles.listLabel}>Current Location</Text>
                    <View style={styles.listContainer}>
                      <IconCurrentLocation size={20} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text style={styles.subtitle}>{item.fullAddress}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              }}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: vs(100) }}
            />
          )}
          {savedLocationData?.data?.length > 0 &&
            locationData?.data?.length === 0 && (
              <FlatList
                data={savedLocationData?.data || []}
                keyExtractor={(item, index) =>
                  item?.mapboxId || index.toString()
                }
                renderItem={({ item }) => {
                  return (
                    <Pressable
                      onPress={() => {
                        formik?.setValues({
                          name: item?.PlaceName,
                          fullAddress: item?.FullAddress,
                          latitude: item?.Latitude,
                          longitude: item?.Longitude,
                          plotBuilding: item?.PlotBuilding,
                          streetArea: item?.StreetArea,
                          contactMobile: item?.ContactMobile,
                          tag: item?.Tag,
                        });
                        setOpenGoogleAddress(false);
                      }}
                    >
                      <View style={styles.bookmarkListContiner}>
                        <Text style={styles.listLabel}>{item.Tag}</Text>

                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{item.PlaceName}</Text>
                            <Text style={styles.subtitle}>
                              {item.FullAddress}
                            </Text>
                          </View>
                          <IconBookmarkFilled
                            size={20}
                            fill={COLORS.primary[500]}
                          />
                        </View>
                      </View>
                    </Pressable>
                  );
                }}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: vs(100) }}
              />
            )}
          {locationData?.data?.length > 0 && (
            <FlatList
              data={locationData?.data || []}
              keyExtractor={(item, index) => item?.mapboxId || index.toString()}
              renderItem={({ item }) => {
                return (
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
                    {search ? (
                      <IconMapPinFilled size={20} />
                    ) : (
                      <IconClockHour4 size={20} />
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.title}>{item.name}</Text>
                      <Text style={styles.subtitle}>{item.fullAddress}</Text>
                    </View>
                  </Pressable>
                );
              }}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: vs(100) }}
            />
          )}
        </View>
      ) : (
        /* 📍 SELECTED SCREEN */
        <View style={styles.gridContainer}>
          <View style={styles.headerRow}>
            <IconMapPinFilled size={32} fill={'#4CAF50'} />

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {formik?.values?.name || 'No location'}
              </Text>
              <Text style={styles.subtitle}>
                {formik?.values?.fullAddress || 'No address'}
              </Text>
            </View>

            <Pressable onPress={() => setOpenGoogleAddress(true)}>
              <IconPencil size={24} />
            </Pressable>
          </View>

          {/* FORM */}
          <KeyboardAwareScrollView scrollEnabled>
            <View style={{ marginTop: vs(32), gap: s(24) }}>
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

              {/* ✅ BOOKMARK UI */}
              <View style={styles.bookmarkContainer}>
                {addressTag?.data?.map((item: any, index: number) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() => formik.setFieldValue('tag', item?.Tag)}
                      style={[
                        styles.gridButtonContainer,
                        {
                          borderColor:
                            formik?.values?.tag === item?.Tag
                              ? COLORS.primary[500]
                              : '#ccc',
                          backgroundColor:
                            formik?.values?.tag === item?.Tag
                              ? '#E8F5E9'
                              : 'white',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.gridLabel,
                          {
                            color:
                              formik?.values?.tag === item?.Tag
                                ? COLORS.primary[500]
                                : '#333',
                            width: '100%',
                            textAlign: 'center',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {item.Tag}
                      </Text>
                    </Pressable>
                  );
                })}

                {!isCustomBookmark ? (
                  <Pressable
                    onPress={() => {
                      formik.setFieldValue('tag', '');
                      setIsCustomBookmark(true);
                    }}
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

                    <Pressable
                      onPress={() => {
                        setIsCustomBookmark(false);
                        formik.setFieldValue('tag', '');
                      }}
                    >
                      <Text style={styles.closeButton}>✕</Text>
                    </Pressable>
                  </View>
                )}
              </View>

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
