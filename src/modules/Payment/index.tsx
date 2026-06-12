import CustomButton from '@components/Button';
import CustomCheckbox from '@components/CustomCheckbox';
import QRScanner from '@components/QRScanner';
import { useNetInfo } from '@react-native-community/netinfo';
import { wp } from '@theme/index';
import React, { useEffect, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './FrightPayment.style';
import { emitPaymentStatusUpdate } from '@socket/socket.emitters';
import {
  useGetLoadPaymentQuery,
  useMakePaymentMutation,
  usePaymentHistoryMutation,
} from '@api/PaymentMutations';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/rootReducer';
import { navigate } from '@navigation/NavigationService';
import { setLPStatus } from '@store/slices/Auth/authSlice';
const FrightPayment = () => {
  const dispatch = useDispatch();
  const { PaymentStatus } = useSelector((state: RootState) => state.payment);
  const { DriverID, loadId } = useSelector(
    (state: RootState) => state.tracking,
  );
  const { CustomerID, status } = useSelector((state: RootState) => state.auth);
  console.log({ DriverID, loadId, CustomerID });

  const [success, setSuccess] = useState(false);
  const [paymentAt, setPaymentAt] = useState<'Paid' | 'ToPay'>('Paid');

  const { data, refetch } = useGetLoadPaymentQuery(
    {
      DriverID: DriverID,
      CustomerID: CustomerID,
      LoadpostID: loadId,
    },
    {
      skip: false, // or condition
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );
  console.log({ data });
  const load = data?.data?.[0];

  console.log({ load });
  const [makePayment] = useMakePaymentMutation();
  const [paymentHistory, { data: historyData }] = usePaymentHistoryMutation();
  const [partialAmount, setPartialAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [payAnother, setPayAnother] = useState(false);
  const [tab, setTab] = useState<'Cash' | 'UPI' | 'Scaner'>('Cash');
  const handlePayment = async () => {
    try {
      const resp = await makePayment({
        Currency: 'INR',
        CustomerID: load?.CustomerID!,
        DriverID: load?.driver_id!,
        TotalAmount: Number(load?.freight_amount),
        UPI_ID: upiId,
        TransactionType: payAnother ? 'PARTIAL' : 'FULL',
        TransactionAmt: Number(load?.freight_amount),
        PaidAmount: payAnother
          ? Number(partialAmount)
          : Number(load?.freight_amount),
        LoadpostID: load?.LoadPostID!,
        TransactionMode: tab as any,
        IPAddress: '',
        DeviceInfo: '',
        PaymentStage: paymentAt,
      });
      console.log({ resp });

      if (resp?.data?.status === '00') {
        emitPaymentStatusUpdate(load?.driver_id!,load?.LoadPostID!);
        refetch();
        setSuccess(true);
        setPartialAmount('');
        setPayAnother(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (!loadId) return;

    paymentHistory({ LoadpostID: loadId });
  }, [loadId]);

  useEffect(() => {
    if (!PaymentStatus) return;

    const timer = setTimeout(() => {
      if (status !== 'reached') {
        dispatch(setLPStatus(''));
      }
      navigate('BottomNavigation', {
        screen: 'New Load',
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [PaymentStatus]);
  return (
    <View style={styles.container}>
      {status !== 'reached' && (
        <View style={styles.rowBox}>
          <Text style={styles.label}>Paid(at pickup)</Text>
          <CustomCheckbox
            value={paymentAt === 'Paid'}
            onValueChange={val => setPaymentAt(val ? 'Paid' : 'ToPay')}
          />
        </View>
      )}
      <View style={styles.rowBox}>
        <Text style={styles.label}>To Pay</Text>
        <CustomCheckbox
          value={status !== 'reached' ? paymentAt === 'ToPay' : true}
          onValueChange={val => setPaymentAt(val ? 'ToPay' : 'Paid')}
        />
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>
          Total Amount To Be Paid - ₹ {load?.ShowAmount || 0}
        </Text>
      </View>

      {paymentAt === 'Paid' && status !== 'reached' && (
        <View style={styles.rowBox}>
          <Text style={styles.label}>Pay Another Amount</Text>
          <CustomCheckbox value={payAnother} onValueChange={setPayAnother} />
        </View>
      )}

      {payAnother && paymentAt === 'Paid' && status !== 'reached' && (
        <TextInput
          value={partialAmount}
          placeholder="Enter Amount You Want To Pay"
          style={styles.input}
          placeholderTextColor="#999"
          onChangeText={t => {
            if (t <= load?.ShowAmount) {
              setPartialAmount(t);
            }
          }}
        />
      )}

      <View style={styles.tabContainer}>
        {['Cash', 'UPI', 'Scaner'].map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.tab, tab === item && styles.activeTab]}
            onPress={() => setTab(item as any)}
          >
            <Text
              style={[styles.tabText, tab === item && styles.activeTabText]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomContainer}>
        {tab === 'UPI' && (
          <TextInput
            placeholder="Enter UPI ID"
            style={styles.input}
            placeholderTextColor="#999"
            onChangeText={txt => setUpiId(txt)}
            value={upiId}
          />
        )}

        {tab === 'Scaner' && <QRScanner />}
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          {!success && (
            <CustomButton
              title="Submit"
              style={{ alignSelf: 'center', paddingHorizontal: wp(24) }}
              onPress={() => handlePayment()}
            />
          )}

          {PaymentStatus !== '' && PaymentStatus !== undefined && success && (
            <View style={styles.successContainer}>
              <Image
                source={require('@assets/images/paymentdone.png')}
                style={styles.image}
              />
              <Text style={styles.successText}>
                {PaymentStatus} Payment has been done successfully.
              </Text>
              <Text style={styles.receiptText}>Fright Payment Receipt</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default FrightPayment;
