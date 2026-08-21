import { useGetLoadsQuery } from '@api/query';
import Dropdown from '@components/Dropdown';
import { useFocusEffect } from '@react-navigation/native';
import { RootState } from '@store/rootReducer';
import { setDriverData } from '@store/slices/map/mapSlice';
import { COLORS, FONT_FAMILIES } from '@theme/index';
import { CheckCircle2 } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const LiveTracking = () => {
  const dispatch = useDispatch();
  const [loadID, setLoadId] = useState<any>('');
  const { data: loads, refetch } = useGetLoadsQuery();
  const { driver } = useSelector((state: RootState) => state.map);
  const loadData = useMemo(
    () =>
      loads?.data?.map((load: any) => ({
        label: load?.LoadId,
        value: load?.LoadId,
      })),
    [loads],
  );

  console.log({ loadData, loadID });
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (loadID) {
      const resp = loads?.data?.filter((item: any) => item?.LoadId === loadID);

      if (resp?.length) {
        let data = resp[0];
        dispatch(
          setDriverData({
            driverId: data?.DriverId,
            pickupCoordinate: {
              latitude: data?.PickupLatitude,
              longitude: data?.PickupLongitude,
            },
            destinationCoordinate: {
              latitude: data?.DeliveryLatitude,
              longitude: data?.DeliveryLongitude,
            },
            loadId: data?.LoadId,
          }),
        );
      }
    }
  }, [loadID]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white[100], padding: 16 }}>
      <View style={{ flexDirection: 'row', gap: 110 }}>
        <Text
          style={{
            fontFamily: FONT_FAMILIES.regular,
            color: COLORS.primary[500],
            fontSize: 10,
          }}
        >
          Vehicle No
        </Text>

        <Text
          style={{
            fontFamily: FONT_FAMILIES.regular,
            color: COLORS.primary[500],
            fontSize: 10,
          }}
        >
          Load Post Id
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 5, marginBottom: 16 }}>
        <Text
          style={{
            fontFamily: FONT_FAMILIES.semiBold,
            color: COLORS.primary[500],
            fontSize: 20,
          }}
        >
          {/* {data?.data?.[0]?.vehicle_id} */}
        </Text>

        <Text
          style={{
            fontFamily: FONT_FAMILIES.semiBold,
            color: COLORS.primary[500],
            fontSize: 20,
          }}
        >
          - {driver?.loadId || loads?.data?.[0]?.LoadId}
        </Text>
      </View>
      <Dropdown
        label="Your Load"
        data={loadData}
        placeholder="Select Load"
        onChange={value => {
          setLoadId(value);
        }}
        value={loadID}
      />
      <FlatList
        // data={data?.data || []}
        data={[]}
        // keyExtractor={item => item?.LoadId}
        ItemSeparatorComponent={() => (
          <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
            <View
              style={{
                height: 25,
                borderRightWidth: 1,
                borderStyle: 'dashed',
                width: 80,
              }}
            />
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontFamily: FONT_FAMILIES.regular }}>
              {/* {formatTimeAMPM(item?.insert_date)} */}
            </Text>

            <CheckCircle2
              color={'#fff'}
              style={{ backgroundColor: COLORS.primary[500], borderRadius: 99 }}
              size={25}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: FONT_FAMILIES.semiBold,
                color: COLORS.primary[500],
              }}
            >
              {/* {item?.status} */}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default LiveTracking;
