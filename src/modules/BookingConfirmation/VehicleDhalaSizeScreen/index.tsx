import CustomButton from '@components/Button';
import { goBack } from '@navigation/NavigationService';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { styles } from './vehicleDhalaSize.style';

const VehicleDhalaSizeScreen = ({ route }: any) => {
  const vehicle: any = route?.params?.item?.vehicle;

 

  const vehicleImages = Object.entries(vehicle.images).map(
    ([position, image]) => ({
      photo_url: image,
      photo_id: position,
    }),
  );
  return (
    <View style={styles.container}>
      <View style={styles.imageRow}>
        <Image
          source={{
            uri: `https://stag.motohelpindia.com${vehicle?.vehicleTypeImages?.front}`,
          }}
          style={styles.vehicleImage}
          resizeMode="contain"
        />
        <Image
          source={{
            uri: `https://stag.motohelpindia.com${vehicle?.vehicleTypeImages?.back}`,
          }}
          style={styles.vehicleImage}
          resizeMode="contain"
        />
      </View>
    <View style={styles.infoContainer}>
  {/* Loading Capacity */}
  <View style={styles.infoRow}>
    <Text style={styles.label}>Loading Capacity</Text>
    <Text style={styles.value}>
      {vehicle?.loadingCapacity} kg
    </Text>
  </View>

  {/* Make & Segment */}
  <View style={styles.infoRow}>
    <Text style={styles.label}>Make & Segment</Text>
    <Text style={styles.value}>
      {vehicle?.makeAndSegment || vehicle?.make || 'N/A'}
    </Text>
  </View>

  {/* Body Type */}
  <View style={styles.infoRow}>
    <Text style={styles.label}>Body Type</Text>
    <Text style={styles.value}>
      {vehicle?.bodyType || 'N/A'}
    </Text>
  </View>

  {/* Dhala Size */}
  <View style={styles.dhalaRow}>
    <Text style={styles.label}>Dhala Size</Text>

    <View style={styles.dhalaContent}>
      {/* Headers */}
      <View style={styles.dhalaHeaderRow}>
        <Text style={styles.dhalaHeader}>Length</Text>
        <Text style={styles.dhalaHeader}>Width</Text>
        <Text style={styles.dhalaHeader}>Height</Text>
      </View>

      {/* Values */}
      <View style={styles.dhalaValueRow}>
        <Text style={styles.dhalaValue}>
          {vehicle?.dhalaLength ?? '-'} ft
        </Text>

        <Text style={styles.dhalaValue}>
          {vehicle?.dhalaWidth ?? '-'} ft
        </Text>

        <Text style={styles.dhalaValue}>
          {vehicle?.dhalaHeight ?? '-'} ft
        </Text>
      </View>
    </View>
  </View>
</View>
      <Text style={styles.sectionTitle}>Real Image Of Vehicle</Text>
      <FlatList
        data={vehicleImages}
        keyExtractor={item => item?.photo_id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Image
              source={{
                uri: item?.photo_url ?? '',
              }}
              style={styles.listImage}
              resizeMode="contain"
            />
          </View>
        )}
      />
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
