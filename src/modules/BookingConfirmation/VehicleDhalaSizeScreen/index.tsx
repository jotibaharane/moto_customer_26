import { useGetVehicleImagesQuery } from '@api/Mutations';
import CustomButton from '@components/Button';
import { goBack } from '@navigation/NavigationService';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { styles } from './vehicleDhalaSize.style';

const VehicleDhalaSizeScreen = ({ route }: any) => {
  const vehicle: any = route?.params?.item;
  const { data: vehicleImagesData } = useGetVehicleImagesQuery({
    driver_id: vehicle?.DriverID || '',
  });

  const vehicleImages = vehicleImagesData?.data || [];

  return (
    <View style={styles.container}>
      <View style={styles.imageRow}>
        <Image source={{ uri: vehicle?.Img }} style={styles.vehicleImage} />
        <Image
          source={{ uri: vehicle?.Img }}
          style={styles.vehicleImageMirror}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.vehicleName}>{vehicle?.VehicleName}</Text>
        <Text style={styles.vehicleDetails}>
          4 Wheeler , {vehicle?.unladen_weight} kg ,{' '}
          {vehicle?.vehicle_gross_weight} Ton{'\n'} Body Length: ~
          {vehicle?.length} ft , Body Height: ~{vehicle?.height}ft
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
                uri: item?.photo_url,
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
