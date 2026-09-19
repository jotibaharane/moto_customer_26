import { IconMapPin } from '@tabler/icons-react-native';
import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ShipmentStatusModalProps {
  visible: boolean;
  onClose: () => void;

  loadId?: string | number;

  title: string;
  message?: string;

  pickup?: string;
  delivery?: string;

  distance?: string | number;
  weight?: string | number;
  freightAmount?: string | number;

  vehicleNo?: string;
  driverName?: string;
  driverId?: string | number;

  showRouteDetails?: boolean;
  showVehicleDetails?: boolean;

  buttonText?: string;
  remark?: string;
  onButtonPress?: () => void;
}

const ShipmentStatusModal = ({
  visible,
  onClose,
  loadId,
  title,
  message,

  pickup,
  delivery,

  distance,
  weight,
  freightAmount,

  vehicleNo,
  driverName,
  driverId,

  showRouteDetails = false,
  showVehicleDetails = false,

  buttonText = 'OK',
  remark,
  onButtonPress,
}: ShipmentStatusModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* CLOSE */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          {/* LOAD ID */}
          {loadId !== undefined && loadId !== null && (
            <Text style={styles.loadId}>Load# {loadId}</Text>
          )}

          {/* TITLE */}
          {/* 
          {title && (
            <Text style={styles.title}>
              {title}
            </Text>
          )}
          */}

          {/* MESSAGE */}
          {message && <Text style={styles.message}>{message}</Text>}

          {/* REMARK */}
          {remark && <Text style={styles.remark}>{remark}</Text>}

          {/* ROUTE DETAILS */}
          {showRouteDetails && (
            <View style={styles.routeContainer}>
              {/* PICKUP */}
              <View style={styles.locationRow}>
                <View style={styles.locationIconContainer}>
                  <IconMapPin size={30} color="#4CAF50" />
                </View>

                <View style={styles.locationContent}>
                  <Text style={styles.locationTitle}>Pick up Address</Text>

                  <Text style={styles.address} numberOfLines={2}>
                    {pickup || '-'}
                  </Text>

                  {distance !== undefined &&
                    distance !== null &&
                    distance !== '' && (
                      <Text style={styles.distance}>{distance} km</Text>
                    )}
                </View>
              </View>

              {/* DASHED LINE */}
              <View style={styles.verticalLineContainer}>
                <View style={styles.verticalLine} />
              </View>

              {/* DELIVERY */}
              <View style={styles.locationRow}>
                <View style={styles.locationIconContainer}>
                  <IconMapPin size={30} color="#4CAF50" />
                </View>

                <View style={styles.locationContent}>
                  <Text style={styles.locationTitle}>Delivery Address</Text>

                  <Text style={styles.address} numberOfLines={2}>
                    {delivery || '-'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* WEIGHT / FREIGHT */}
          {showRouteDetails && (
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>Approx Weight</Text>

                <Text style={styles.summaryValue}>{weight || '-'} KG</Text>
              </View>

              <View>
                <Text style={styles.summaryLabel}>Freight Amount</Text>

                <Text style={styles.summaryValue}>
                  ₹ {freightAmount || '-'}
                </Text>
              </View>
            </View>
          )}

          {/* VEHICLE / DRIVER */}
          {showVehicleDetails && (
            <View style={styles.driverContainer}>
              <Text style={styles.driverInfo}>
                Vehicle No : <Text style={styles.bold}>{vehicleNo || '-'}</Text>
              </Text>

              <Text style={styles.driverInfo}>
                Driver Name & Id :{' '}
                <Text style={styles.bold}>
                  {driverName || '-'} {driverId ? `(${driverId})` : ''}
                </Text>
              </Text>
            </View>
          )}

          {/* BUTTON */}
          {buttonText && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={onButtonPress || onClose}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ShipmentStatusModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#385380',
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 20,
  },

  closeButton: {
    position: 'absolute',
    right: 10,
    top: 5,
    zIndex: 10,
    padding: 5,
  },

  closeText: {
    fontSize: 30,
    color: '#000',
    fontWeight: '400',
  },

  loadId: {
    textAlign: 'center',
    color: '#385380',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
  },

  message: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
    marginTop: 4,
    lineHeight: 22,
    fontWeight: '600',
  },

  remark: {
    textAlign: 'center',
    color: '#2E5A99',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 20,
  },

  routeContainer: {
    marginTop: 22,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  locationIconContainer: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  locationContent: {
    flex: 1,
    marginLeft: 12,
  },

  locationTitle: {
    fontSize: 16,
    color: '#000000',
  },

  address: {
    marginTop: 5,
    fontSize: 14,
    color: '#777',
    lineHeight: 22,
  },

  distance: {
    marginTop: 10,
    color: '#385380',
    fontSize: 15,
    fontWeight: '600',
  },

  /*
   * Dashed line between pickup and delivery
   */
  verticalLineContainer: {
    width: 36,
    alignItems: 'center',
    height: 32,
  },

  verticalLine: {
    height: '100%',
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#777',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginTop: 2,
  },

  driverContainer: {
    marginTop: 24,
  },

  driverInfo: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 18,
  },

  bold: {
    fontWeight: '700',
  },

  button: {
    alignSelf: 'center',
    minWidth: 55,
    height: 38,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    paddingHorizontal: 15,
  },

  buttonText: {
    color: 'red',
    fontSize: 14,
    fontWeight: '600',
  },
});
