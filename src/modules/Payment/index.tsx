import { useGetLoadPaymentQuery, useMakePaymentMutation } from '@api/Mutations';
import CustomButton from '@components/Button';
import CustomCheckbox from '@components/CustomCheckbox';
import QRScanner from '@components/QRScanner';
import { useNetInfo } from '@react-native-community/netinfo';
import { wp } from '@theme/index';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './FrightPayment.style';
const FrightPayment = () => {
  const netInfo = useNetInfo();
  console.log({ netInfo });
  const [success, setSuccess] = useState(false);
  const [paymentAt, setPaymentAt] = useState<'Paid' | 'ToPay'>('Paid');
  const { data } = useGetLoadPaymentQuery(
    {
      DriverID: 'REH-1178',
      CustomerID: 'RAM001',
      LoadpostID: 'LP046114',
    },
    {
      skip: false, // or condition
    },
  );
  console.log({ data });
  const load = data?.data?.[0];
  const [makePayment] = useMakePaymentMutation();
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
      });
      console.log({ resp });

      if (resp?.data?.status === '00') {
        setSuccess(true);
      }
    } catch (error) {}
  };
  return (
    <View style={styles.container}>
      <View style={styles.rowBox}>
        <Text style={styles.label}>Paid(at pickup)</Text>
        <CustomCheckbox
          value={paymentAt === 'Paid'}
          onValueChange={val => setPaymentAt(val ? 'Paid' : 'ToPay')}
        />
      </View>

      <View style={styles.rowBox}>
        <Text style={styles.label}>To Pay</Text>
        <CustomCheckbox
          value={paymentAt === 'ToPay'}
          onValueChange={val => setPaymentAt(val ? 'ToPay' : 'Paid')}
        />
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>
          Total Amount To Be Paid - ₹ {load?.freight_amount || 0}
        </Text>
      </View>

      {paymentAt === 'Paid' && (
        <View style={styles.rowBox}>
          <Text style={styles.label}>Pay Another Amount</Text>
          <CustomCheckbox value={payAnother} onValueChange={setPayAnother} />
        </View>
      )}

      {payAnother && (
        <TextInput
          value={partialAmount}
          placeholder="Enter Amount You Want To Pay"
          style={styles.input}
          placeholderTextColor="#999"
          onChangeText={t => setPartialAmount(t)}
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
          {!success ? (
            <CustomButton
              title="Submit"
              style={{ alignSelf: 'center', paddingHorizontal: wp(24) }}
              onPress={() => handlePayment()}
            />
          ) : (
            <View style={styles.successContainer}>
              <Image
                source={require('@assets/images/paymentdone.png')}
                style={styles.image}
              />
              <Text style={styles.successText}>
                Payment has been done successfully.
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
