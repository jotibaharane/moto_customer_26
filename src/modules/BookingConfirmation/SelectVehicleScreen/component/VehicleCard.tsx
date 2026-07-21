import { navigate } from '@navigation/NavigationService';
import { COLORS } from '@theme/index';
import { BadgeIndianRupee, Clock, Weight } from 'lucide-react-native';
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
          <Weight size={16} color={COLORS.primary[500]} />
          <Text style={styles.vehicleDetails}>{item.weightRange}</Text>
        </View>

        <View style={styles.detailRow}>
          <Clock size={16} color={COLORS.primary[500]} />
          <Text style={styles.vehicleDetails}>
            {item.expectedVehicleAvailability}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <BadgeIndianRupee size={16} color={COLORS.primary[500]} />
          <Text style={styles.vehicleDetails}>₹ {item.freightAmount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VehicleCard;
