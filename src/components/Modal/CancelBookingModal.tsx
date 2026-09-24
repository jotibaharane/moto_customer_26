import { IconMapPin, IconX } from '@tabler/icons-react-native';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CancelBookingModalProps {
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

  remark?: string;

  /** Shown in the confirmation step; pass the real, server-calculated
   * charge preview instead of relying on the old hardcoded placeholder. */
  warningText?: string;

  /** Disables the Confirm button and swaps its label while a cancel
   * request is in flight, to prevent duplicate submits. */
  confirming?: boolean;

  /**
   * Called when user clicks Confirm
   */
  onConfirmCancel?: () => void;
}

const CancelBookingModal = ({
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

  remark,
  warningText = 'Cancellation charges may be applicable.',
  confirming = false,

  onConfirmCancel,
}: CancelBookingModalProps) => {
  /**
   * Two steps, matching the design: the details view has a "Cancel
   * Booking" button; tapping it disables that button and reveals the
   * charge warning with Confirm / Skip below it. Always starts back on the
   * details step when re-opened.
   */
  const [step, setStep] = useState<'details' | 'confirm'>('details');

  useEffect(() => {
    if (visible) setStep('details');
  }, [visible]);

  /**
   * User clicks Confirm — the parent owns closing the modal (via
   * `visible`) once its async cancel call actually resolves, so a
   * duplicate tap can't fire two cancel requests while one is in flight.
   */
  const handleConfirmCancel = () => {
    onConfirmCancel?.();
  };

  /** Skip abandons the cancellation and dismisses the modal. */
  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* ========================================= */}
          {/* CLOSE BUTTON */}
          {/* ========================================= */}

          <Pressable style={styles.closeButton} onPress={onClose}>
            <IconX size={22} color="#000" />
          </Pressable>

          {/* ========================================= */}
          {/* TITLE */}
          {/* ========================================= */}

          {/* ========================================= */}
          {/* LOAD ID */}
          {/* ========================================= */}

          {loadId !== undefined && loadId !== null && (
            <Text style={styles.loadId}>Load# {loadId}</Text>
          )}

          {/* ========================================= */}
          {/* MESSAGE */}
          {/* ========================================= */}

          {/* ========================================= */}
          {/* REMARK */}
          {/* ========================================= */}

          {remark && <Text style={styles.remark}>{remark}</Text>}

          {/* ========================================= */}
          {/* ROUTE DETAILS */}
          {/* ========================================= */}

          {showRouteDetails && (
            <View style={styles.routeContainer}>
              {/* ================= PICKUP ================= */}

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

              {/* ================= DASHED LINE ================= */}

              <View style={styles.verticalLineContainer}>
                <View style={styles.verticalLine} />
              </View>

              {/* ================= DELIVERY ================= */}

              <View style={styles.locationRow}>
                <View style={styles.locationIconContainer}>
                  <IconMapPin size={30} color="#FF0000" />
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

          {/* ========================================= */}
          {/* WEIGHT / FREIGHT */}
          {/* ========================================= */}

          {showRouteDetails && (
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Approx Weight</Text>

                <Text style={styles.summaryValue}>{weight || '-'} KG</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Freight Amount</Text>

                <Text style={styles.summaryValue}>
                  ₹ {freightAmount || '-'}
                </Text>
              </View>
            </View>
          )}

          {/* ========================================= */}
          {/* VEHICLE / DRIVER */}
          {/* ========================================= */}

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

          {/* ========================================= */}
          {/* CANCEL BOOKING (step 1) */}
          {/* ========================================= */}

          <View style={styles.cancelBookingRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cancelBookingButton}
              onPress={() => setStep('confirm')}
              disabled={step === 'confirm'}
            >
              <IconX
                size={16}
                color={step === 'confirm' ? '#9E9E9E' : '#FF0000'}
              />
              <Text
                style={[
                  styles.cancelBookingText,
                  step === 'confirm' && styles.cancelBookingTextDisabled,
                ]}
              >
                Cancel Booking
              </Text>
            </TouchableOpacity>
          </View>

          {/* ========================================= */}
          {/* CHARGES + CONFIRM / SKIP (step 2) */}
          {/* ========================================= */}

          {step === 'confirm' && (
            <View style={styles.confirmationContainer}>
              <Text style={styles.warningText}>{warningText}</Text>

              <View style={styles.confirmationButtons}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.confirmButton, confirming && { opacity: 0.5 }]}
                  onPress={handleConfirmCancel}
                  disabled={confirming}
                >
                  <Text style={styles.confirmButtonText}>
                    {confirming ? 'Cancelling…' : 'Confirm'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.skipButton}
                  onPress={handleSkip}
                  disabled={confirming}
                >
                  <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CancelBookingModal;

const styles = StyleSheet.create({
  /* ========================================= */
  /* OVERLAY */
  /* ========================================= */

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ========================================= */
  /* MAIN CONTAINER */
  /* ========================================= */

  container: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#385380',

    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 20,
  },

  /* ========================================= */
  /* CLOSE */
  /* ========================================= */

  closeButton: {
    position: 'absolute',
    right: 10,
    top: 6,
    zIndex: 10,

    padding: 5,
  },

  /* ========================================= */
  /* TITLE */
  /* ========================================= */

  title: {
    textAlign: 'center',
    color: '#FF0000',
    fontSize: 17,
    fontWeight: '700',

    marginBottom: 5,
  },

  /* ========================================= */
  /* LOAD ID */
  /* ========================================= */

  loadId: {
    textAlign: 'center',
    color: '#385380',
    fontSize: 12,
    fontWeight: '700',

    marginBottom: 10,
  },

  /* ========================================= */
  /* MESSAGE */
  /* ========================================= */

  message: {
    textAlign: 'center',
    color: '#FF0000',
    fontSize: 18,
    marginTop: 4,
    lineHeight: 22,
    fontWeight: '600',
  },

  /* ========================================= */
  /* REMARK */
  /* ========================================= */

  remark: {
    textAlign: 'center',
    color: '#2E5A99',
    fontSize: 16,
    fontWeight: '600',

    marginTop: 4,
    lineHeight: 20,
  },

  /* ========================================= */
  /* ROUTE */
  /* ========================================= */

  routeContainer: {
    marginTop: 15,
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
    fontWeight: '600',
    color: '#111111',
  },

  address: {
    marginTop: 4,

    fontSize: 14,
    color: '#777777',

    lineHeight: 19,
  },

  distance: {
    marginTop: 7,

    color: '#385380',
    fontSize: 12,
    fontWeight: '600',
  },

  /* ========================================= */
  /* DASHED LINE */
  /* ========================================= */

  verticalLineContainer: {
    width: 36,

    alignItems: 'center',

    height: 28,
  },

  verticalLine: {
    height: '100%',

    width: 1,

    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#777777',
  },

  /* ========================================= */
  /* SUMMARY */
  /* ========================================= */

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingHorizontal: 5,
  },
  summaryItem: {
    minWidth: 100,
  },

  summaryLabel: {
    fontSize: 11,
    color: '#666666',
  },

  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',

    marginTop: 3,
  },

  /* ========================================= */
  /* DRIVER */
  /* ========================================= */

  driverContainer: {
    marginTop: 20,
  },

  driverInfo: {
    fontSize: 12,
    color: '#000000',

    marginBottom: 12,
  },

  bold: {
    fontWeight: '700',
  },

  /* ========================================= */
  /* CANCEL BOOKING BUTTON */
  /* ========================================= */

  cancelBookingRow: {
    alignItems: 'flex-end',
    marginTop: 8,
  },

  cancelBookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 4,
  },

  cancelBookingText: {
    color: '#FF0000',
    fontSize: 13,
    fontWeight: '600',
  },

  cancelBookingTextDisabled: {
    color: '#9E9E9E',
  },

  /* ========================================= */
  /* CONFIRMATION */
  /* ========================================= */

  confirmationContainer: {
    width: '100%',

    alignItems: 'center',

    marginTop: 18,

    paddingTop: 16,

    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },

  /* ========================================= */
  /* WARNING TEXT */
  /* ========================================= */

  warningText: {
    width: '100%',
    textAlign: 'center',
    color: '#385380',
    fontSize: 16,

    fontWeight: '600',

    lineHeight: 21,

    paddingHorizontal: 5,
  },

  /* ========================================= */
  /* CONFIRM + SKIP */
  /* ========================================= */

  confirmationButtons: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 20,

    gap: 20,
  },

  /* ========================================= */
  /* CONFIRM BUTTON */
  /* ========================================= */

  confirmButton: {
    minWidth: 90,

    height: 38,

    borderWidth: 1,

    borderColor: '#FF0000',

    borderRadius: 7,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 18,

    backgroundColor: 'transparent',
  },

  confirmButtonText: {
    color: '#FF0000',

    fontSize: 13,

    fontWeight: '600',
  },

  /* ========================================= */
  /* SKIP BUTTON */
  /* ========================================= */

  skipButton: {
    minWidth: 90,
    height: 38,

    borderWidth: 1,

    borderColor: '#385380',

    borderRadius: 7,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 18,

    backgroundColor: 'transparent',
  },

  skipButtonText: {
    color: '#385380',

    fontSize: 13,

    fontWeight: '600',
  },
});
