// // ReportingScreen.tsx

// import { RootState } from '@store/rootReducer';
// import { COLORS } from '@theme/index';
// import { handleCall } from '@utils/helperfunctions.utils';
// import { Phone, User } from 'lucide-react-native';
// import React, { useCallback, useEffect } from 'react';
// import { Alert, Text, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useSelector } from 'react-redux';
// import Header from './components/Header';
// import { styles } from './reporting.style';
// import { navigate } from '@navigation/NavigationService';
// import CustomerSocket from '@socket/CustomerSocket';
// import MapComponent from './components/MapComponent';
// import { useGetLoadsQuery } from '@api/query';
// import { useFocusEffect } from '@react-navigation/native';

// const ReportingScreen = () => {
//     const { data: loads ,refetch} = useGetLoadsQuery();

//   const { status, tracking } = useSelector((state: RootState) => state.map);
//   const { PaymentStatus, BalanceAmount } = useSelector(
//     (state: RootState) => state.payment,
//   );
//   const { driverMobile, loadId } = tracking || {};

//   useEffect(() => {
//     if (
//       status === 'loaded' ||
//       (status === 'reached' && PaymentStatus !== 'FULL' && BalanceAmount !== 0)
//     ) {
//       navigate('FrightPayment');
//     }
//   }, [status]);

 

// useFocusEffect(
//   useCallback(() => {
//     refetch();
//   }, [refetch]),
// );


// useEffect(() => {
  
//   if (!loads?.data?.[0]?.LoadId) {
//     return;
//   }
//      CustomerSocket.trackLoad({
//         loadId: loads?.data?.[0]?.LoadId,
//       });

 
// }, [loads]);


//   return (
//     <SafeAreaView style={styles.container}>
//       {/* HEADER */}
//       <Header />
    
     
//       {/* MAP */}
//       <MapComponent />
//       {/* ========================= */}
//       {/* CALL BUTTON */}
//       {/* ========================= */}

//       {loadId && (
//         <TouchableOpacity
//           style={styles.callButton}
//           onPress={() => handleCall(driverMobile)}
//         >
//           <View style={styles.callRows}>
//             <View style={styles.phoneRotate}>
//               <Phone size={36} color={COLORS.primary[500]} />
//             </View>

//             <View style={styles.userIconWrapper}>
//               <User />
//             </View>
//           </View>

//           <Text style={styles.postIdText} numberOfLines={1}>
//             Post id {loadId || 'N/A'}
//           </Text>
//         </TouchableOpacity>
//       )}
//     </SafeAreaView>
//   );
// };

// export default ReportingScreen;




// ReportingScreen.tsx

import React, { useCallback, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Phone, User } from 'lucide-react-native';

import Header from './components/Header';
import MapComponent from './components/MapComponent';
import { styles } from './reporting.style';
import { COLORS } from '@theme/index';
import { RootState } from '@store/rootReducer';
import { handleCall } from '@utils/helperfunctions.utils';
import { navigate } from '@navigation/NavigationService';
import CustomerSocket from '@socket/CustomerSocket';
import { useGetLoadsQuery } from '@api/query';
import CustomerSocketListener from '@socket/CustomerSocketListener';

const ReportingScreen = () => {
  const {
    data: loads,
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useGetLoadsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { status, tracking } = useSelector(
    (state: RootState) => state.map,
  );

  const { PaymentStatus, BalanceAmount } = useSelector(
    (state: RootState) => state.payment,
  );

  const { driverMobile, loadId } = tracking || {};

  const currentLoadId = loads?.data?.[0]?.LoadId;

  /**
   * Navigate to payment screen
   */
  useEffect(() => {
    if (
      status === 'loaded' ||
      (status === 'reached' &&
        PaymentStatus !== 'FULL' &&
        BalanceAmount !== 0)
    ) {
      navigate('FrightPayment');
    }
  }, [status, PaymentStatus, BalanceAmount]);

  /**
   * Refetch whenever screen is focused
   */
  useFocusEffect(
    useCallback(() => {
      console.log('==============================');
      console.log('ReportingScreen Focused');
      console.log('==============================');

      refetch();

      return () => {
        console.log('ReportingScreen Unfocused');
      };
    }, [refetch]),
  );

  /**
   * Debug Query
   */
  useEffect(() => {
    console.log('Loads Query');
    console.log({
      isLoading,
      isFetching,
      isSuccess,
      error,
      loads,
    });
  }, [loads, isLoading, isFetching, isSuccess, error]);


useEffect(() => {
  CustomerSocketListener.setAuthenticatedCallback(() => {
    if (!currentLoadId) return;
    console.log('Track Load After Auth:', currentLoadId);
    CustomerSocket.trackLoad({
      loadId: currentLoadId,
    });
  });

  return () => {
    CustomerSocketListener.clearAuthenticatedCallback();
  };
}, [currentLoadId]);
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <MapComponent />

      {loadId && (
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall(driverMobile)}
        >
          <View style={styles.callRows}>
            <View style={styles.phoneRotate}>
              <Phone
                size={36}
                color={COLORS.primary[500]}
              />
            </View>

            <View style={styles.userIconWrapper}>
              <User />
            </View>
          </View>

          <Text style={styles.postIdText}>
            Post id {loadId}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ReportingScreen;