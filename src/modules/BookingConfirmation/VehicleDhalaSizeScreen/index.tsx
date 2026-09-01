/* ========================================================================== */
/* VehicleDhalaSizeScreen.tsx                                                 */
/* ========================================================================== */

import CustomButton from '@components/Button';
import { goBack } from '@navigation/NavigationService';
import React, { useMemo } from 'react';
import { FlatList, Image, Text, View } from 'react-native';

import { vs } from '@theme/New';
import { styles } from './vehicleDhalaSize.style';

const API_BASE_URL = 'https://stag.motohelpindia.com';

const VehicleDhalaSizeScreen = ({ route }: any) => {
  const vehicle = route?.params?.item?.vehicle;

  /* ------------------------------------------------------------------------ */
  /* VEHICLE IMAGES                                                           */
  /* ------------------------------------------------------------------------ */

  const vehicleImages = useMemo(() => {
    if (!vehicle?.images) {
      return [];
    }

    return Object.entries(vehicle.images)
      .filter(([, image]) => Boolean(image))
      .map(([position, image]) => ({
        photo_url: String(image),
        photo_id: position,
      }));
  }, [vehicle?.images]);

  /* ------------------------------------------------------------------------ */
  /* IMAGE URL                                                                 */
  /* ------------------------------------------------------------------------ */

  const getImageUrl = (image?: string | null) => {
    if (!image) {
      return '';
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

  /* ------------------------------------------------------------------------ */
  /* RENDER REAL VEHICLE IMAGE                                                */
  /* ------------------------------------------------------------------------ */

  const renderVehicleImage = ({
    item,
  }: {
    item: {
      photo_url: string;
      photo_id: string;
    };
  }) => {
    const imageUrl = getImageUrl(item?.photo_url);

    if (!imageUrl) {
      return null;
    }

    return (
      <View style={styles.listItem}>
        <Image
          source={{
            uri: imageUrl,
          }}
          style={styles.listImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* ================================================================== */}
      {/* VEHICLE TYPE IMAGES                                                 */}
      {/* ================================================================== */}

      <View style={styles.imageRow}>
        <View style={styles.vehicleImageContainer}>
          <Image
            source={{
              uri: getImageUrl(vehicle?.vehicleTypeImages?.front),
            }}
            style={styles.vehicleImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.vehicleImageContainer}>
          <Image
            source={{
              uri: getImageUrl(vehicle?.vehicleTypeImages?.back),
            }}
            style={styles.vehicleImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* ================================================================== */}
      {/* VEHICLE INFORMATION                                                 */}
      {/* ================================================================== */}

      <View style={styles.infoContainer}>
        <Text style={styles.vehicleName}>
          {vehicle?.vehicleType || 'Vehicle'}
        </Text>

        <Text style={styles.vehicleDetails}>
          {vehicle?.loadingCapacity ?? 0} kg ,{' '}
          {vehicle?.vehicleGrossWeight ?? 0} Ton
          {'\n'}
          Body Length: ~{vehicle?.dhalaLength ?? 0} ft , Body Height: ~
          {vehicle?.dhalaHeight ?? 0} ft
          {'\n'}
          Body Width: ~{vehicle?.dhalaWidth ?? 0} ft
        </Text>
      </View>

      {/* ================================================================== */}
      {/* REAL VEHICLE IMAGES TITLE                                           */}
      {/* ================================================================== */}

      <Text style={styles.sectionTitle}>Real Image Of Vehicle</Text>

      {/* ================================================================== */}
      {/* REAL VEHICLE IMAGES                                                 */}
      {/* ================================================================== */}

      <FlatList
        data={vehicleImages}
        keyExtractor={item => item.photo_id}
        renderItem={renderVehicleImage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        style={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: vs(16) }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No vehicle images available</Text>
          </View>
        }
      />

      {/* ================================================================== */}
      {/* DONE BUTTON                                                         */}
      {/* ================================================================== */}

      <CustomButton
        title="Done"
        variant="filled"
        style={styles.button}
        onPress={() => goBack()}
      />
    </View>
  );
};

export default VehicleDhalaSizeScreen;
