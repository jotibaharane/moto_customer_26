import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  IconChevronDown,
  IconTruck,
  IconCircleCheck,
  IconReceipt,
  IconX,
} from '@tabler/icons-react-native';
import { VehicleLoadingContent } from './VehicleLoadingContent';
import { PaymentReceiptContent } from './PaymentReceiptContent';
import { ReportedContent } from './ReportedContent';
import {styles}from './../Loadingstatus.style'

type LoadStatus =
  | 'REPORTED'
  | 'LOADING'
  | 'LOADED'
  | 'PAYMENT'
  | 'COMPLETED';

interface PaymentReceipt {
  receiptNo?: string;
  loadPostId?: string;
  vehicleNo?: string;
  customerName?: string;
  driverName?: string;

  freightAmount?: number;
  advanceAmount?: number;
  balanceAmount?: number;

  paymentMode?: string;
  paymentStatus?: string;
  paymentDate?: string;
}

interface LoadStatusModalProps {
  visible: boolean;
  status: LoadStatus;
  onClose: () => void;
 onStatusChange: (status: LoadStatus) => void;
  loadPostId?: string;
  reportedTime?: string;
  loadingTime?: string;

  packagesLoaded?: number;
  loadingDuration?: string;

  receipt?: PaymentReceipt;
}

const LoadStatusModal = ({
  visible,
  status,
  onClose,
  onStatusChange,
  loadPostId = '123456',
  reportedTime = '2:00 pm',
  loadingTime = '00:20',
  packagesLoaded = 1000,
  loadingDuration = '30 min : 00:20',
  receipt,
}: LoadStatusModalProps) => {
  const isLoading =
    status === 'LOADING' || status === 'LOADED';

  const isPayment =
    status === 'PAYMENT' || status === 'COMPLETED';

  return (
  <Modal
  visible={visible}
  transparent={true}
  animationType="slide"
  onRequestClose={onClose}
>
  <View style={styles.modalOverlay}>

    <View style={styles.modalContainer}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isLoading
            ? 'Vehicle Loading status'
            : isPayment
            ? 'Payment'
            : 'Load Status'}
        </Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            {status === 'LOADING'
              ? 'Loading in Process'
              : status === 'LOADED'
              ? 'Loading Complete'
              : status === 'PAYMENT'
              ? 'Payment Pending'
              : 'REPORTED'}
          </Text>
        </View>

        <Pressable
          style={styles.closeButton}
          onPress={onClose}
        >
          <IconX size={20} color="#000" />
        </Pressable>
      </View>

      {/* Dynamic Content */}
      {isLoading ? (
        <VehicleLoadingContent
          reportedTime={reportedTime}
          loadingTime={loadingTime}
          packagesLoaded={packagesLoaded}
          loadingDuration={loadingDuration}
          completed={status === 'LOADED'}
        />
      ) : isPayment ? (
        <PaymentReceiptContent
          receipt={receipt}
        />
      ) : (
        <ReportedContent
          loadPostId={loadPostId}
          reportedTime={reportedTime}
          onStatusChange={onStatusChange}
        />
      )}

    </View>

  </View>
</Modal>
  );
};

export default LoadStatusModal;