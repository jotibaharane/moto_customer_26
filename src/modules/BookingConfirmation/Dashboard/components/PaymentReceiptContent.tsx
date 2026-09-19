import { IconMapPin } from '@tabler/icons-react-native';
import { Download } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { styles } from './../Loadingstatus.style';
import { ReceiptRow } from './ReceiptRow';

interface PaymentReceiptContentProps {
  receipt?: any;
}

export const PaymentReceiptContent = ({
  receipt,
}: PaymentReceiptContentProps) => {
  const tripFare = receipt?.tripFare ?? 996.28;
  const fareWithoutTax = receipt?.fareWithoutTax ?? 996.28;
  const cgstTax = receipt?.cgstTax ?? 0;
  const sgstTax = receipt?.sgstTax ?? 0;
  const rounding = receipt?.rounding ?? -0.28;
  const totalOrderFare = receipt?.totalOrderFare ?? 996;
  const cashPaid = receipt?.cashPaid ?? 996;

  return (
    <ScrollView
      style={styles.receiptScroll}
      contentContainerStyle={styles.receiptContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Row 1 */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Trip No :{'ABC123'}</Text>
            {/* <Text style={styles.value}></Text> */}
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Driver Name:{'RASHID'}</Text>
            {/* <Text style={styles.value}></Text> */}
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Vehicle No:{'MH0346F5574'}</Text>
            {/* <Text style={styles.value}></Text> */}
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Mobile No:{'7506122183'}</Text>
            {/* <Text style={styles.value}></Text> */}
          </View>
        </View>
      </View>

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
        <Text style={styles.sectionTitle}>Freight Details</Text>

        <ReceiptRow label="Trip Fare" value={`₹ ${tripFare}`} />

        <ReceiptRow label="Fare Without Tax" value={`₹ ${fareWithoutTax}`} />

        <ReceiptRow label="CGST Tax" value={`₹ ${cgstTax}`} />

        <ReceiptRow label="SGST Tax" value={`₹ ${sgstTax}`} />

        <ReceiptRow label="Rounding" value={`₹ ${rounding}`} />

        <View style={styles.divider} />

        <ReceiptRow
          label="Total Order Fare"
          value={`₹ ${totalOrderFare}`}
          bold
        />
      </View>

      {/* Payment Details */}
      <View style={styles.receiptCard}>
        <Text style={styles.sectionTitle}>Payment Details</Text>

        <ReceiptRow
          label={receipt?.paymentMode || 'Cash'}
          value={`₹ ${cashPaid}`}
          bold
        />
      </View>

      {/* Rate Driver */}
      {/* Rate Driver */}
      <View style={styles.receiptCard}>
        <Text style={styles.sectionTitle}>Rate your Driver</Text>

        <View style={styles.ratingContainer}>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={28}
            startingValue={receipt?.rating || 0}
            ratingColor="#315E9F"
            ratingBackgroundColor="#FFFFFF"
            tintColor="#FFFFFF"
            readonly={false}
            showRating={false}
            onFinishRating={(rating: any) => {
              console.log('Driver Rating:', rating);
            }}
          />

          <Text style={styles.ratingText}>{receipt?.rating || 0} / 5</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.receiptFooter}>
        <TouchableOpacity style={styles.download}>
          <Download size={22} color={'#ffffff'} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
