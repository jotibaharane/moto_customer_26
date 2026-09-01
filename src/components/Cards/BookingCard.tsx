import React, {memo, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  IconMapPinFilled,
  IconX,
} from '@tabler/icons-react-native';

import {moderateScale} from '@theme/New/responsive';

interface BookingCardProps {
  loadId: string;
  pickupDistance: string;
  pickupAddress: string;
  deliveryAddress: string;
  distance: string;
  approxWeight: string;
  freightAmount: string;
  vehicleNo?: string;
  driverName?: string;
  driverId?: string;
  onCancel?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  loadId,
  pickupDistance,
  pickupAddress,
  deliveryAddress,
  distance,
  approxWeight,
  freightAmount,
  vehicleNo = '',
  driverName = '',
  driverId = '',
  onCancel,
}) => {
  const [showCancelConfirmation, setShowCancelConfirmation] =
    useState(false);

  const handleCancelPress = () => {
    setShowCancelConfirmation(true);
  };

  const handleSkip = () => {
    setShowCancelConfirmation(false);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirmation(false);
    onCancel?.();
  };

  return (
    <View style={styles.card}>

      {/* Load ID */}
      <Text style={styles.loadId}>
        Load# {loadId}
      </Text>

      {/* Pickup Distance */}
      <Text style={styles.pickupDistance}>
        Pickup Address {pickupDistance} Away From You
      </Text>

      {/* Location Section */}
      <View style={styles.locationContainer}>

        {/* Pickup */}
        <View style={styles.locationRow}>
          <View style={styles.iconContainer}>
            <IconMapPinFilled
              size={moderateScale(25)}
              color="#4CAF50"
            />
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.locationTitle}>
              Pick up Address
            </Text>

            <Text
              style={styles.address}
              numberOfLines={1}>
              {pickupAddress}
            </Text>
          </View>
        </View>

        {/* Dashed Line */}
        <View style={styles.dashedLine} />

        {/* Delivery */}
        <View style={styles.locationRow}>
          <View style={styles.iconContainer}>
            <IconMapPinFilled
              size={moderateScale(25)}
              color="#FF0000"
            />
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.locationTitle}>
              Delivery Address
            </Text>

            <Text
              style={styles.address}
              numberOfLines={1}>
              {deliveryAddress}
            </Text>
          </View>
        </View>

      </View>

      {/* Distance */}
      <Text style={styles.distance}>
        {distance}
      </Text>

      {/* Booking Information */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>
            Approx Weight
          </Text>

          <Text style={styles.infoValue}>
            {approxWeight}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>
            Freight Amount
          </Text>

          <Text style={styles.infoValue}>
            {freightAmount}
          </Text>
        </View>
      </View>

      {/* Vehicle */}
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>
          Vehicle No :
        </Text>

        <Text style={styles.detailValue}>
          {vehicleNo || 'N/A'}
        </Text>
      </View>

      {/* Driver */}
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>
          Driver Name & Id :
        </Text>

        <Text style={styles.detailValue}>
          {driverName
            ? `${driverName} (${driverId})`
            : 'N/A'}
        </Text>
      </View>

      {/* Cancel Booking */}
      {!showCancelConfirmation && (
        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.7}
          onPress={handleCancelPress}>

          <IconX
            size={moderateScale(17)}
            color="#FF0000"
          />

          <Text style={styles.cancelText}>
            Cancel Booking
          </Text>

        </TouchableOpacity>
      )}

      {/* Cancellation Confirmation */}
      {showCancelConfirmation && (
        <View style={styles.cancelConfirmation}>

          {/* Cancellation Charges */}
          <Text style={styles.cancellationCharges}>
      Cancelation Charges rs 200 Will Be Apllicabel
          </Text>

          {/* Action Buttons */}
          <View style={styles.cancelActions}>

            {/* Skip */}
            <TouchableOpacity
              style={styles.skipButton}
              activeOpacity={0.7}
              onPress={handleSkip}>
              <Text style={styles.skipText}>
                Skip
              </Text>
            </TouchableOpacity>

            {/* Confirm */}
            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.7}
              onPress={handleConfirmCancel}>
              <Text style={styles.confirmText}>
                Confirm
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      )}

    </View>
  );
};

export default memo(BookingCard);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignSelf: 'stretch',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#8A9BB5',

    borderRadius: moderateScale(7),

    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(10),

    marginVertical: moderateScale(6),
  },

  loadId: {
    textAlign: 'center',
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#31558B',
    marginBottom: moderateScale(8),
  },

  pickupDistance: {
    textAlign: 'center',
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#31558B',
    marginBottom: moderateScale(8),
  },

  locationContainer: {
    position: 'relative',
  },

  locationRow: {
    flexDirection: 'row',
    minHeight: moderateScale(38),
    alignItems: 'flex-start',
  },

  iconContainer: {
    width: moderateScale(28),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  addressContainer: {
    flex: 1,
    marginLeft: moderateScale(3),
  },

  locationTitle: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: '#111111',
    marginBottom: moderateScale(2),
  },

  address: {
    fontSize: moderateScale(10),
    color: '#666666',
  },

  dashedLine: {
    position: 'absolute',
    left: moderateScale(13),
    top: moderateScale(24),
    bottom: moderateScale(25),

    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#777777',
  },

  distance: {
    marginLeft: moderateScale(32),
    fontSize: moderateScale(9),
    fontWeight: '600',
    color: '#31558B',
    marginVertical: moderateScale(3),
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginTop: moderateScale(6),
    marginBottom: moderateScale(8),

    paddingHorizontal: moderateScale(2),
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  infoLabel: {
    fontSize: moderateScale(8),
    color: '#666666',
  },

  infoValue: {
    fontSize: moderateScale(9),
    fontWeight: '700',
    color: '#111111',
    marginLeft: moderateScale(3),
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: moderateScale(27),
  },

  detailLabel: {
    fontSize: moderateScale(10),
    color: '#111111',
    fontWeight: '500',
  },

  detailValue: {
    flex: 1,
    fontSize: moderateScale(10),
    color: '#333333',
    marginLeft: moderateScale(4),
  },

  /* =========================
     CANCEL BOOKING
  ========================= */

  cancelButton: {
    alignSelf: 'flex-end',

    flexDirection: 'row',
    alignItems: 'center',

    marginTop: moderateScale(8),
    marginRight: moderateScale(7),

    paddingVertical: moderateScale(3),
  },

  cancelText: {
    fontSize: moderateScale(11),
    color: '#FF0000',
    marginLeft: moderateScale(3),
    fontWeight: '500',
  },

  /* =========================
     CANCELLATION CONFIRMATION
  ========================= */

  cancelConfirmation: {
    marginTop: moderateScale(8),

    paddingTop: moderateScale(8),

    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },

  cancellationCharges: {
    textAlign: 'center',

    fontSize: moderateScale(11),
    fontWeight: '600',

    color: '#2E5A99',

    marginBottom: moderateScale(10),
  },

  cancelActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    gap: moderateScale(8),
  },

  skipButton: {
    minWidth: moderateScale(70),

    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: moderateScale(7),
    paddingHorizontal: moderateScale(14),

    borderWidth: 1,
    borderColor: '#8A9BB5',

    borderRadius: moderateScale(5),

    backgroundColor: '#FFFFFF',
  },

  skipText: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#31558B',
  },

  confirmButton: {
    minWidth: moderateScale(75),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#8A9BB5',
    paddingVertical: moderateScale(7),
    paddingHorizontal: moderateScale(14),
    borderRadius: moderateScale(5)
  },

  confirmText: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

