import { useGetLoadTrakingQuery } from '@api/Mutations';
import { useGetLoadsQuery } from '@api/query';
import Dropdown from '@components/Dropdown';
import { useFocusEffect } from '@react-navigation/native';
import CustomerSocket from '@socket/CustomerSocket';
import CustomerSocketListener from '@socket/CustomerSocketListener';
import { RootState } from '@store/rootReducer';
import { setLPStatus, setTripDetails } from '@store/slices/map/mapSlice';
import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { formatTimeAMPM } from '@utils/datetime.utils';
import { CheckCircle2 } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const LiveTracking = () => {
  const [loadID, setLoadId] = useState<any>('');
  const { data: loads ,refetch} = useGetLoadsQuery();

const loadData=useMemo(()=>loads?.data?.map((load:any) => ({
          label: load?.LoadId,
          value: load?.LoadId,
        })),[loads])

  console.log({ loadData ,loadID});
  useFocusEffect(
    useCallback(() => {
      refetch();
     
    }, [refetch]),
  );





useEffect(() => {
  CustomerSocketListener.setAuthenticatedCallback(() => {
    if (!loadID) return;
    console.log('Track Load After Auth:', loadID);
    CustomerSocket.trackLoad({
      loadId: loadID,
    });
  });

  return () => {
    CustomerSocketListener.clearAuthenticatedCallback();
  };
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
          - {loadID||loads?.data?.[0]?.LoadId}
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
