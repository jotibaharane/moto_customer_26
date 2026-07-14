import { View, Text } from 'react-native'
import React, { memo, useEffect, useRef, useState } from 'react'
import { styles } from '../reporting.style'
import { Camera, Images, LineLayer, MapView, MarkerView, ShapeSource, SymbolLayer } from '@rnmapbox/maps'
import { isValidLocation } from '@utils/location.utils'
import { useSelector } from 'react-redux'
import { RootState } from '@store/rootReducer'
import { animateMarker, getSmoothHeading } from '@utils/animation.utils'

const MapComponent = () => {
  const cameraRef = useRef<any>(null);

  const { driver} = useSelector(
    (state: RootState) => state.map,
  );

const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  const [animatedCoords, setAnimatedCoords] = useState<[number, number] | null>(
    null,
  );

  const prevCoords = useRef<[number, number] | null>(null);

  const prevHeading = useRef(0);




  // =========================
  // DRIVER LIVE MOVEMENT
  // =========================

  useEffect(() => {
    if (!driver) return;

    const lng = Number(driver?.longitude);

    const lat = Number(driver?.latitude);

    // INVALID COORDS
    if (isNaN(lng) || isNaN(lat)) {
      console.log('Invalid driver coordinates', driver);

      return;
    }

    const newCoords: [number, number] = [lng, lat];

  
    // SMOOTH ANIMATION
    
    prevCoords.current = newCoords;

    const smoothHeading = getSmoothHeading(
      prevHeading.current,
      driver.heading || 0,
    );

    prevHeading.current = smoothHeading;

      cameraRef.current?.setCamera({
        centerCoordinate: newCoords,

        zoomLevel: 17,

        pitch: 60,

        heading: smoothHeading,

        animationMode: 'easeTo',

        animationDuration: 1000,
      });
    
  }, [driver]);

 


  return (
     <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/streets-v12"
          logoEnabled={false}
          scaleBarEnabled={false}
        >
          {/* CAMERA */}
          <Camera ref={cameraRef} />

          {/* IMAGES */}
          <Images
            images={{
              carIcon: require('@assets/images/carIcon.png'),
              pickupIcon: require('@assets/images/marker.png'),
              dropIcon: require('@assets/images/drop_marker.png'),
            }}
          />

          {/* ========================= */}
          {/* ROUTE */}
          {/* ========================= */}

          {routeGeoJSON && (
            <ShapeSource id="routeSource" shape={routeGeoJSON}>
              <LineLayer
                id="routeLine"
                style={{
                  lineColor: '#2563eb',
                  lineWidth: [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    10,
                    4,
                    14,
                    7,
                    18,
                    12,
                  ],
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            </ShapeSource>
          )}

          {/* ========================= */}
          {/* DRIVER VEHICLE */}
          {/* ========================= */}

          {animatedCoords && (
            <ShapeSource
              id="driverSource"
              shape={{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: animatedCoords,
                },
                properties: {},
              }}
            >
              <SymbolLayer
                id="driverSymbol"
                style={{
                  iconImage: 'carIcon',

                  iconSize: [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    10,
                    0.05,
                    14,
                    0.07,
                    18,
                    0.1,
                  ],
                  iconAnchor: 'center',
                  iconRotationAlignment: 'map',
                  iconAllowOverlap: true,
                  iconRotate: prevHeading.current,
                }}
              />
            </ShapeSource>
          )}

          {/* ========================= */}
          {/* TOOLTIP */}
          {/* ========================= */}

          {animatedCoords && (
            <MarkerView coordinate={animatedCoords} anchor={{ x: 0.5, y: 1.8 }}>
              <View style={styles.tooltipContainer}>
                <Text style={styles.tooltipTitle}>
                  Distance {driver?.pickupDistance || 0} Km
                </Text>
                <Text style={styles.tooltipText}>
                  Time {0} min
                </Text>
              </View>
            </MarkerView>
          )}

          {/* ========================= */}
          {/* PICKUP */}
          {/* ========================= */}

          {isValidLocation(driver?.pickupCoordinate) && (
            <ShapeSource
              id="pickupSource"
              shape={{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [driver?.pickupCoordinate?.longitude,driver?.pickupCoordinate?.latitude],
                },
                properties: {},
              }}
            >
              <SymbolLayer
                id="pickupSymbol"
                style={{
                  iconImage: 'pickupIcon',
                  iconSize: 0.3,
                  iconAnchor: 'bottom',
                }}
              />
            </ShapeSource>
          )}

         
        </MapView>
      </View>
  )
}

export default memo(MapComponent)