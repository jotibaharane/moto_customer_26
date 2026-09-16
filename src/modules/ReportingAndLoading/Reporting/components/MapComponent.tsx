import CustomerMapView from '@components/CustomerMapView';
import { RootState } from '@store/rootReducer';
import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from '../reporting.style';

interface MapComponentProps {
  /** Known independently of live driver data, so the map has something
   * sensible to show before the driver's first GPS ping arrives. */
  pickup?: { latitude: number | undefined; longitude: number | undefined } | null;
  delivery?: { latitude: number | undefined; longitude: number | undefined } | null;
}

/**
 * Single persistent native map (see android/app/src/main/java/com/
 * moto_customer/map/CustomerMapView.kt) — replaces the previous
 * @rnmapbox/maps JS tree. Full turn-by-turn (maneuver banner, following
 * camera, live route + reroute, distance/duration/ETA card) is native now,
 * matching the driver app's own TripMapView — fed by the driver's reported
 * position via Mapbox's replay engine instead of real device GPS. This
 * component only forwards that reported position and the trip's status.
 */
const MapComponent = ({ pickup, delivery }: MapComponentProps) => {
  const { driver } = useSelector((state: RootState) => state.map);

  const pickupCoords = useMemo(() => {
    if (driver?.pickupCoordinate?.latitude && driver?.pickupCoordinate?.longitude) {
      return driver.pickupCoordinate;
    }
    return pickup;
  }, [driver?.pickupCoordinate, pickup]);

  const destinationCoords = useMemo(() => {
    if (driver?.destinationCoordinate?.latitude && driver?.destinationCoordinate?.longitude) {
      return driver.destinationCoordinate;
    }
    return delivery;
  }, [driver?.destinationCoordinate, delivery]);

  return (
    <View style={styles.mapContainer}>
      <CustomerMapView
        style={mapComponentStyles.map}
        mode="TRACKING"
        pickupLatitude={Number(pickupCoords?.latitude) || 0}
        pickupLongitude={Number(pickupCoords?.longitude) || 0}
        deliveryLatitude={Number(destinationCoords?.latitude) || 0}
        deliveryLongitude={Number(destinationCoords?.longitude) || 0}
        vehicleLatitude={Number(driver?.latitude) || 0}
        vehicleLongitude={Number(driver?.longitude) || 0}
        vehicleHeading={Number(driver?.heading) || 0}
        tripStatus={driver?.tripStatus}
      />
    </View>
  );
};

const mapComponentStyles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default memo(MapComponent);
