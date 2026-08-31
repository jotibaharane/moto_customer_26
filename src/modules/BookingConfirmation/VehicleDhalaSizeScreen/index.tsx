import CustomButton from '@components/Button';
import { goBack } from '@navigation/NavigationService';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { styles } from './vehicleDhalaSize.style';

const VehicleDhalaSizeScreen = ({ route }: any) => {
  const vehicle: any = route?.params?.item?.vehicle;

  console.log({ vehicle });

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
        <Text style={styles.vehicleName}>{vehicle?.vehicleType}</Text>
        <Text style={styles.vehicleDetails}>
          {vehicle?.loadingCapacity} kg , {vehicle?.vehicleGrossWeight} Ton
          {'\n'} Body Length: ~{vehicle?.dhalaLength} ft , Body Height: ~
          {vehicle?.dhalaHeight}ft {'\n'} Body Width: ~{vehicle?.dhalaWidth}ft
        </Text>
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
