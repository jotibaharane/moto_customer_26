import { useGetVehicleImagesQuery } from '@api/Mutations';
import CustomButton from '@components/Button';
import { goBack } from '@navigation/NavigationService';
import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';

const VehicleDhalaSizeScreen = ({ route }: any) => {
  const vehicle: any = route?.params?.item;
  const { data: vehicleImagesData } = useGetVehicleImagesQuery({
    driver_id: vehicle?.DriverID || '',
  });

  const vehicleImages = vehicleImagesData?.data || [];

  return (
    <View
      style={{ flex: 1, backgroundColor: COLORS.white[100], padding: fp(16) }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: wp(29),
        }}
      >
        <Image
          source={{ uri: vehicle?.Img }}
          width={wp(150)}
          height={wp(150)}
        />
        <Image
          source={{ uri: vehicle?.Img }}
          style={{ transform: [{ scaleX: -1 }] }}
          width={wp(150)}
          height={wp(150)}
        />
      </View>
      <View
        style={{ justifyContent: 'center', gap: hp(4), alignItems: 'center' }}
      >
        <Text
          style={{
            fontSize: fp(16),
            fontFamily: FONT_FAMILIES.semiBold,
            color: COLORS.black[500],
            textAlign: 'center',
          }}
        >
          {vehicle?.VehicleName}
        </Text>
        <Text
          style={{
            fontSize: fp(16),
            fontFamily: FONT_FAMILIES.regular,
            color: COLORS.gray[500],
            textAlign: 'center',
            borderBottomWidth: 1,
            borderBottomColor: COLORS.gray[250],
            paddingBottom: hp(24),
          }}
        >
          4 Wheeler , {vehicle?.unladen_weight} kg ,{' '}
          {vehicle?.vehicle_gross_weight} Ton{'\n'} Body Length: ~
          {vehicle?.length} ft , Body Height: ~{vehicle?.height}ft
        </Text>
      </View>
      <Text
        style={{
          fontSize: fp(20),
          fontFamily: FONT_FAMILIES.semiBold,
          color: COLORS.primary[500],
          marginTop: hp(27),
        }}
      >
        Real Image Of Vehicle
      </Text>
      <FlatList
        data={vehicleImages}
        keyExtractor={item => item?.photo_id}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              marginBottom: hp(16),
            }}
          >
            <Image
              source={{
                uri: item?.photo_url,
              }}
              height={hp(146)}
              style={{
                width: '100%',
              }}
              resizeMode="contain"
            />
          </View>
        )}
      />
      <CustomButton
        title="Done"
        variant="filled"
        style={{ marginTop: hp(15) }}
        onPress={() => goBack()}
      />
    </View>
  );
};

export default VehicleDhalaSizeScreen;
