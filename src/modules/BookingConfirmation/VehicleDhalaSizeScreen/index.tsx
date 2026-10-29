import CustomButton from '@components/Button';
import { goBack } from '@navigation/NavigationService';
import { IconChevronLeft } from '@tabler/icons-react-native';
import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { vs } from '@theme/New';
import { styles } from './vehicleDhalaSize.style';

const API_BASE_URL = 'https://stag.motohelpindia.com';

const VehicleDhalaSizeScreen = ({ route }: any) => {
  const item = route?.params?.item;
  const vehicle = item?.vehicle ?? {};

  const getImageUrl = (image?: string | null) => {
    if (!image) {
      return undefined;
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    return `${API_BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
  };

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

  const frontImage = getImageUrl(vehicle?.vehicleTypeImages?.front);
  const backImage = getImageUrl(vehicle?.vehicleTypeImages?.back);

  const vehicleNumber =
    vehicle?.vehicleNumber ??
    item?.vehicleNumber ??
    vehicle?.registrationNumber ??
    vehicle?.vehicleNo ??
    'N/A';

  const loadingCapacity =
    vehicle?.loadingCapacity ??
    vehicle?.maxLoadingCapacity ??
    vehicle?.minLoadingCapacity ??
    '-';

  const make = vehicle?.make ?? vehicle?.vehicleMake ?? 'N/A';
  const segment = vehicle?.segment ?? vehicle?.vehicleSegment ?? '';
  const bodyType =
    vehicle?.bodyType ?? vehicle?.vehicleBodyType ?? 'N/A';

  const length = vehicle?.dhalaLength;
  const width = vehicle?.dhalaWidth;
  const height = vehicle?.dhalaHeight;

  const displayDimension = (value: any) =>
    value !== null && value !== undefined && value !== ''
      ? value
      : '-';

  const renderVehicleImage = ({ item: imageItem }: any) => {
    const imageUrl = getImageUrl(imageItem.photo_url);

    if (!imageUrl) {
      return null;
    }

    return (
      <View style={styles.listItem}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.listImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  const renderTableRow = (label: string, value: React.ReactNode) => (
    <View style={styles.tableRow}>
      <View style={styles.tableLabel}>
        <Text style={styles.tableText}>{label}</Text>
      </View>
      <View style={styles.tableValue}>{value}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <FlatList
        data={vehicleImages}
        keyExtractor={imageItem => imageItem.photo_id}
        renderItem={renderVehicleImage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            {/* Vehicle number */}
            <Text style={styles.vehicleNumber}>
              Vehicle No : {vehicleNumber}
            </Text>

            {/* Backend vehicle type images */}
            <View style={styles.imageRow}>
              <View style={styles.vehicleImageContainer}>
                {frontImage ? (
                  <Image
                    source={{ uri: frontImage }}
                    style={styles.vehicleImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>Front view</Text>
                  </View>
                )}
              </View>

              <View style={styles.vehicleImageContainer}>
                {backImage ? (
                  <Image
                    source={{ uri: backImage }}
                    style={styles.vehicleImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>Rear view</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Vehicle details table */}
            <View style={styles.detailsTable}>
              {renderTableRow(
                'Loading Capacity',
                <Text style={styles.tableText}>
                  {loadingCapacity}
                  {typeof loadingCapacity === 'number' ? ' kg' : ''}
                </Text>,
              )}

              {renderTableRow(
                'Make & Segment',
                <Text style={styles.tableText}>
                  {[make, segment].filter(Boolean).join(' / ')}
                </Text>,
              )}

              {renderTableRow(
                'Body Type',
                <Text style={styles.tableText}>{bodyType}</Text>,
              )}

              <View style={[styles.tableRow, styles.lastTableRow]}>
                <View style={styles.tableLabel}>
                  <Text style={styles.tableText}>Dhala Size</Text>
                </View>

                <View style={styles.dimensionsContainer}>
                  <View style={styles.dimensionColumn}>
                    <Text style={styles.dimensionHeading}>Length</Text>
                    <Text style={styles.dimensionValue}>
                      {displayDimension(length)} ft
                    </Text>
                  </View>

                  <View style={styles.dimensionColumn}>
                    <Text style={styles.dimensionHeading}>Width</Text>
                    <Text style={styles.dimensionValue}>
                      {displayDimension(width)} ft
                    </Text>
                  </View>

                  <View style={styles.dimensionColumn}>
                    <Text style={styles.dimensionHeading}>Height</Text>
                    <Text style={styles.dimensionValue}>
                      {displayDimension(height)} ft
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Real vehicle images */}
            <Text style={styles.sectionTitle}>Real Image Of Vehicle</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No vehicle images available</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: vs(16) }} />}
        ListFooterComponent={<View style={{ height: vs(16) }} />}
      />

      {/* Done button */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Done"
          variant="filled"
          style={styles.button}
          onPress={() => goBack()}
        />
      </View>
    </SafeAreaView>
  );
};

export default VehicleDhalaSizeScreen;
