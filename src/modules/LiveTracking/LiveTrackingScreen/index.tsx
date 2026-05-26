import { useGetLoadsQuery, useGetLoadTrakingQuery } from '@api/Mutations';
import Dropdown from '@components/Dropdown';
import { RootState } from '@store/rootReducer';
import { setLPStatus } from '@store/slices/Auth/authSlice';
import { setTripDetails } from '@store/slices/tracking/trackingSlice';
import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { formatTimeAMPM } from '@utils/datetime.utils';
import { CheckCircle2 } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const LiveTracking = () => {
  const dispatch = useDispatch();
  const [loadID, setLoadId] = useState<any>('');
  const { CustomerID } = useSelector((state: RootState) => state.auth);

  const { data: loads } = useGetLoadsQuery({
    customer_id: CustomerID!,
  });
  console.log({ loads });

  const { data } = useGetLoadTrakingQuery({
    customer_id: CustomerID!,
    load_id: loadID || loads?.[0]?.value,
  });

  useEffect(() => {
    if (data?.data?.length) {
      const load = data?.data?.[0];
      dispatch(
        setTripDetails({
          loadId: load?.load_id,
          DriverID: load?.driver_id,
          distance_km: load?.distance,
          driverMobile: '',
          eta_minutes: 0,
          message: load?.message,
          status: load?.status,
        }),
      );
      dispatch(setLPStatus(load?.status));
    }
  }, [data]);

  return (
    <View
      style={{ flex: 1, backgroundColor: COLORS.white[100], padding: wp(16) }}
    >
      <View style={{ flexDirection: 'row', gap: wp(110) }}>
        <Text
          style={{
            fontFamily: FONT_FAMILIES.regular,
            color: COLORS.primary[500],
            fontSize: fp(10),
          }}
        >
          Vehicle No
        </Text>

        <Text
          style={{
            fontFamily: FONT_FAMILIES.regular,
            color: COLORS.primary[500],
            fontSize: fp(10),
          }}
        >
          Load Post Id
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 5, marginBottom: hp(16) }}>
        <Text
          style={{
            fontFamily: FONT_FAMILIES.semiBold,
            color: COLORS.primary[500],
            fontSize: fp(20),
          }}
        >
          {data?.data?.[0]?.vehicle_id}
        </Text>

        <Text
          style={{
            fontFamily: FONT_FAMILIES.semiBold,
            color: COLORS.primary[500],
            fontSize: fp(20),
          }}
        >
          - {data?.data?.[0]?.load_id}
        </Text>
      </View>
      <Dropdown
        label="Your Load"
        data={loads?.data}
        onChange={value => {
          setLoadId(value);
        }}
        value={loadID}
      />
      <FlatList
        data={data?.data || []}
        keyExtractor={item => item?.id}
        ItemSeparatorComponent={() => (
          <View
            style={{ flexDirection: 'row', gap: wp(13), alignItems: 'center' }}
          >
            <View
              style={{
                height: 25,
                borderRightWidth: 1,
                borderStyle: 'dashed',
                width: wp(80),
              }}
            />
          </View>
        )}
        renderItem={({ item }) => (
          <View
            style={{ flexDirection: 'row', gap: wp(13), alignItems: 'center' }}
          >
            <Text
              style={{ fontSize: fp(12), fontFamily: FONT_FAMILIES.regular }}
            >
              {formatTimeAMPM(item?.insert_date)}
            </Text>

            <CheckCircle2
              color={'#fff'}
              style={{ backgroundColor: COLORS.primary[500], borderRadius: 99 }}
              size={25}
            />
            <Text
              style={{
                fontSize: fp(16),
                fontFamily: FONT_FAMILIES.semiBold,
                color: COLORS.primary[500],
              }}
            >
              {item?.status}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default LiveTracking;
