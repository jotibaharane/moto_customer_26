import { IconMapPin } from '@tabler/icons-react-native';
import { Download } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './../Loadingstatus.style';
import { ReceiptRow } from './ReceiptRow';

interface PaymentReceiptContentProps {
  receipt?: any;
}

export const PaymentReceiptContent = ({
  receipt,
}: PaymentReceiptContentProps) => {
  const declareweight = receipt?.declareweight ?? 500;
  const vehicleReportedAt = receipt?.vehicleReportedAt ?? '01:00';
  const LoadingAt = receipt?.LoadingAt ?? '02:00';
  const Numberofpackages = receipt?.Numberofpackages ?? 100;
  const isdelivered = false; 
  const paymentStatus = 'Paid'; // Assuming the payment status is paid for demonstration purposes

  return (
    <ScrollView
      style={styles.receiptScroll}
      contentContainerStyle={styles.receiptContainer}
      showsVerticalScrollIndicator={false}
    >


      {/* Route Details */}
      <View style={styles.receiptCard}>
        {/* <Text style={styles.sectionTitle}>
          Route Details
        </Text> */}

        <View style={styles.locationRow}>
          <View style={styles.locationIcon}>
            <IconMapPin size={20} color="#4CAF50" />
          </View>

          <View style={styles.locationContent}>
            <Text style={styles.locationLabel}>Origin</Text>

            <Text style={styles.locationText}>
              {receipt?.origin || 'Dadar, Mumbai, Maharashtra, India'}
            </Text>
          </View>
        </View>

        <View style={styles.routeLine} />

        <View style={styles.locationRow}>
          <View style={styles.locationIcon}>
            <IconMapPin size={20} color="#FF0A0A" />
          </View>

          <View style={styles.locationContent}>
            <Text style={styles.locationLabel}>Destination</Text>

            <Text style={styles.locationText}>
              {receipt?.destination || 'Bandra, Mumbai, Maharashtra, India'}
            </Text>
          </View>
        </View>
      </View>

      {/* Freight Details */}
      <View style={styles.receiptCard}>

        <ReceiptRow label="Declare Weight" value={`${declareweight}`} />

        <ReceiptRow label="Vehicle Reported At" value={`${vehicleReportedAt}`} />

        <ReceiptRow label="Loading At" value={`${LoadingAt}`} />

        <ReceiptRow label="Number of Packages Loaded" value={`${Numberofpackages}`} />
        {isdelivered && (
          <ReceiptRow label="Payment Status" value={paymentStatus} bold />
        )}

      </View>

      {/* Payment Details */}


      {/* Rate Driver */}
      {/* Rate Driver */}

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#E1E1E1',
          height: 30,
          paddingHorizontal: 12,
          alignSelf: 'center',
          borderRadius: 5,
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 14, color: '#000000', textAlign: 'center' }}>
          Freight Payment
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 12,
          gap: 8,
        }}
      >
        {/* Payment Status / E-POD */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {isdelivered ? (
            <>
              <Text style={{ fontSize: 14, color: '#333333', fontWeight: 'bold' }}>
                E-POD
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: '#2196F3',
                  paddingVertical: 7,
                  paddingHorizontal: 12,
                  borderRadius: 5,
                }}
                onPress={() => {
                  // E-POD view logic
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                  View
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={{ fontSize: 14, color: '#333333', fontWeight: 'bold' }}>
              Payment Status: {paymentStatus}
            </Text>
          )}
        </View>

        {/* Payment Receipt */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 14, color: '#333333', fontWeight: 'bold' }}>
            Payment Receipt
          </Text>

          {/* View Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#2196F3',
              padding: 7,
              borderRadius: 5,
            }}
            onPress={() => {
              // View receipt logic
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 11 }}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#4CAF50',
              padding: 7,
              borderRadius: 5,
            }}
            onPress={() => {
              // Download receipt logic
            }}
          >
            <Download size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
};

