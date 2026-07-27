import { navigate } from '@navigation/NavigationService';
import {
  IconClockHour4,
  IconCoinRupee,
  IconWeight,
} from '@tabler/icons-react-native';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../SelectVehicle.styles';

const VehicleCard = ({ item, selected, onSelect }: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onSelect}
      style={[styles.card, selected && styles.selectedCard]}
    >
      <Pressable
        onPress={() => navigate('VehicleDhalaSizeScreen', { item })}
        style={styles.imageContainer}
      >
        <View style={styles.circle} />

        <Image
          source={require('@assets/images/truck.png')}
          resizeMode="contain"
          style={styles.truckImage}
        />
      </Pressable>

      <View style={styles.cardContent}>
        <Text style={styles.vehicleName}>{item.vehicleType}</Text>

        <View style={styles.detailRow}>
          <IconWeight size={16} color={'#6C7278'} />
          <Text style={styles.vehicleDetails}>{item.weightRange}</Text>
        </View>

        <View style={styles.detailRow}>
          <IconClockHour4 size={16} color={'#6C7278'} />
          <Text style={styles.vehicleDetails}>
            {item.expectedVehicleAvailability}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <IconCoinRupee size={16} color={'#6C7278'} />
          <Text style={styles.vehicleDetails}>
            Fright - ₹ {item.freightAmount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VehicleCard;
