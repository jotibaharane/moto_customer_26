import { useLazyGetCancellationChargeQuery } from '@api/api';
import CustomButton from '@components/Button';
import OverlayLoader from '@components/OverlayLoader';
import { useDistance } from '@hooks/useDistance';
import { goBack } from '@navigation/NavigationService';
import CustomerSocket from '@socket/CustomerSocket';
import { RootState } from '@store/rootReducer';
import { IconMapPinFilled } from '@tabler/icons-react-native';
import { vs } from '@theme/index';
import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import EventBus from '../../../events/EventBus';
import { EVENTS } from '../../../events/events';
import { styles } from './ReviewBooking.style';

const ReviewBookingScreen = () => {
  const [watingDriver, setWaitingDriver] = React.useState(false);
  const [cancellingOffer, setCancellingOffer] = React.useState(false);
  // Known only once the server acks the offer (it creates the load then);
  // cancelling needs it, and the offer-ended events are matched against it.
  const pendingLoadId = React.useRef<string | null>(null);
  const [offerLoadId, setOfferLoadId] = React.useState<string | null>(null);
  const [fetchCancellationCharge] = useLazyGetCancellationChargeQuery();
  const { userId } = useSelector((state: RootState) => state.auth);
  const {
    delivery,
    pickup,
    vehicleType,
    weight,
    vehicleImage,
    expectedVehicleAvailability,
    freightAmount,
    selectedDriverId,
    driverMobile,
    driverName,
    vehicleNumber,
    weightRange,
    length,
    width,
    height,
  } = useSelector((state: RootState) => state.booking);
  const { distance, loading } = useDistance(
    { lat: pickup?.latitude!, lng: pickup?.longitude! },
    { lat: delivery?.latitude!, lng: delivery?.longitude! },
  );
  const handleBook = async () => {
    setWaitingDriver(true);
    pendingLoadId.current = null;
    setOfferLoadId(null);

    try {
      const response = await CustomerSocket.sendLoadOffer({
        driverId: selectedDriverId,
        customerId: userId,
        pickup,
        delivery,
        vehicleType,
        weight,
        fare: freightAmount,
        distance: distance?.distanceKm ?? 0,
        eta: expectedVehicleAvailability,
        driverName,
        driverMobile,
        vehicleNumber,
        vehicleImage,
        weightRange,
      });

      if (response?.status !== '00') {
        setWaitingDriver(false);
        Alert.alert(
          'Could not send request',
          response?.message || 'Please try again.',
        );
        return;
      }
      pendingLoadId.current = response?.data?.loadId ?? null;
      setOfferLoadId(pendingLoadId.current);
    } catch (error) {
      console.log(error);
      setWaitingDriver(false);
      Alert.alert('Could not send request', 'Please try again.');
    }
  };

  const confirmCancelOffer = async (loadId: string) => {
    setCancellingOffer(true);
    try {
      const response = await CustomerSocket.cancelLoad({ loadId });
      if (response?.status === '00') {
        pendingLoadId.current = null;
        setOfferLoadId(null);
        setWaitingDriver(false);
        if (response.data?.isChargeable) {
          Alert.alert(
            'Request Cancelled',
            `A cancellation charge of ₹${response.data.finalChargeAmount} applies.`,
          );
        }
      } else {
        Alert.alert(
          'Cancellation Failed',
          [
            response?.message || 'Could not cancel this request. Please try again.',
            response?.detail,
          ]
            .filter(Boolean)
            .join('\n'),
        );
      }
    } catch {
      Alert.alert(
        'Cancellation Failed',
        'Could not cancel this request. Please try again.',
      );
    } finally {
      setCancellingOffer(false);
    }
  };

  // Cancelling before any driver accepts is free twice, then charged
  // (rule lives in CancelLoadByCustomer; this preview is informational and
  // the server recalculates on the real cancel) — so show the customer
  // which side of that line this cancellation falls on before confirming.
  const handleCancelOffer = async () => {
    const loadId = pendingLoadId.current;
    if (!loadId || cancellingOffer) return;

    let message = 'Do you want to cancel this request?';
    try {
      const preview = await fetchCancellationCharge(
        { loadId },
        false,
      ).unwrap();
      const d = preview?.data;
      if (d) {
        message = d.isChargeable
          ? `You have used your ${d.freeCancellationLimit} free cancellations. A charge of ₹${d.chargeAmount} applies if you cancel now.`
          : `Free cancellation ${d.cancellationNumber} of ${d.freeCancellationLimit}. Further cancellations are charged.`;
      }
    } catch {
      // Preview is best-effort — the real cancel still enforces the rule.
    }

    Alert.alert('Cancel request?', message, [
      { text: 'Keep waiting', style: 'cancel' },
      {
        text: 'Cancel request',
        style: 'destructive',
        onPress: () => confirmCancelOffer(loadId),
      },
    ]);
  };

  // The driver declined or never answered — CustomerSocketListener has no
  // access to this screen's local overlay state, so it signals via EventBus.
  React.useEffect(() => {
    const onOfferEnded = (payload?: { loadId?: string; reason?: string }) => {
      const pending = pendingLoadId.current;
      if (payload?.loadId && pending && payload.loadId !== pending) return;
      pendingLoadId.current = null;
      setOfferLoadId(null);
      setWaitingDriver(false);
      Alert.alert(
        payload?.reason === 'REJECTED'
          ? 'Request Declined'
          : 'No Response',
        payload?.reason === 'REJECTED'
          ? 'The driver declined your request. Please choose another vehicle.'
          : 'The driver did not respond in time. Please choose another vehicle.',
      );
      goBack();
    };
    EventBus.on(EVENTS.OFFER_ENDED, onOfferEnded);
    return () => EventBus.off(EVENTS.OFFER_ENDED, onOfferEnded);
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <TouchableOpacity activeOpacity={0.9} style={[styles.card]}>
          <Pressable style={styles.imageContainer}>
            <View style={styles.circle} />

            <Image
              source={{
                uri: `https://stag.motohelpindia.com/assets${vehicleImage}`,
              }}
              resizeMode="contain"
              style={styles.truckImage}
            />
          </Pressable>

          <View style={styles.cardContent}>
            <View style={styles.detailRow}>
              <Text style={styles.vehicleName}>{vehicleType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.vehicleDetails} numberOfLines={1}>
                Loading Capacity - {weightRange}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.vehicleDetails}>Length - {length}ft</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.vehicleDetails}>width - {width} ft </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.vehicleDetails}>Height - {height} ft </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Total Weight</Text>
          <Text style={styles.cardText}>{weight} KG</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Total Freight</Text>
          <Text style={styles.cardText}>{freightAmount} ₹</Text>
        </View>
        <View style={styles?.addressContainer}>
          <View style={styles.row}>
            <IconMapPinFilled size={30} fill={'#4CAF50'} />
            <View>
              <Text style={styles.addressTitle}>Pick up Address</Text>
              <Text style={styles.addressSubtitle}>{pickup?.name}</Text>
            </View>
          </View>
          <View style={styles.divider}>
            <Text style={styles.distanceText}>
              {distance?.distanceKm || 0} km
            </Text>
          </View>
          <View style={styles.row}>
            <IconMapPinFilled size={30} fill={'#FF0A0A'} />
            <View>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressSubtitle}>{delivery?.name}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.etaText}>
          Expated Arrival Time - {expectedVehicleAvailability}
        </Text>
        <OverlayLoader
          visible={watingDriver}
          onClose={() => {}}
          onCancel={handleCancelOffer}
          cancelling={cancellingOffer}
          canCancel={!!offerLoadId}
        />
        <CustomButton
          title="Confirm Booking"
          variant="filled"
          style={{
            marginTop: vs(49),
          }}
          onPress={handleBook}
        />
      </ScrollView>
    </View>
  );
};

export default ReviewBookingScreen;
