import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {CancellationItem} from '../types';

interface CancellationCardProps {
  item: CancellationItem;
}

const CancellationCard = ({item}: CancellationCardProps) => {
  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.header}>
        <View style={styles.cancelIcon}>
          <Text style={styles.cancelText}>×</Text>
        </View>

        <View style={styles.postDetails}>
          <Text style={styles.postId}>
            Post Id {item.postId}
          </Text>

          <Text style={styles.date}>
            {item.date}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {item.status}
          </Text>
        </View>
      </View>

      {/* Location + Reason */}
      <View style={styles.content}>
        {/* Route */}
        <View style={styles.routeContainer}>
          <View style={styles.timeline}>
            <View style={styles.pickupDot} />

            <View style={styles.verticalLine} />

            <View style={styles.dropDot} />
          </View>

          <View style={styles.locationContainer}>
            <Text
              style={styles.location}
              numberOfLines={1}>
              {item.pickupLocation}
            </Text>

            <View style={styles.dottedLine} />

            <Text
              style={styles.location}
              numberOfLines={1}>
              {item.dropLocation}
            </Text>
          </View>
        </View>

        {/* Reason */}
        <View style={styles.reasonContainer}>
          <Text style={styles.reasonLabel}>
            Reason
          </Text>

          <Text
            style={styles.reasonText}
            numberOfLines={2}>
            {item.reason}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.chargeLabel}>
          Cancellation Charges
        </Text>

        <Text style={styles.chargeAmount}>
          {item.cancellationCharge} ₹
        </Text>
      </View>
    </View>
  );
};

export default React.memo(CancellationCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D9DE',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },

  header: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  cancelIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F6F8FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#F02D2D',
    lineHeight: 34,
  },

  postDetails: {
    flex: 1,
    marginLeft: 12,
  },

  postId: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },

  date: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 5,
  },

  statusContainer: {
    backgroundColor: '#EEF3F8',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 5,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#46607F',
  },

  content: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E2E5E8',
    minHeight: 100,
  },

  routeContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 8,
  },

  timeline: {
    width: 20,
    alignItems: 'center',
  },

  pickupDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#3F8C50',
  },

  verticalLine: {
    width: 1,
    flex: 1,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#AAB0B8',
    marginVertical: 2,
  },

  dropDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#F02020',
  },

  locationContainer: {
    flex: 1,
    marginLeft: 7,
  },

  location: {
    flex: 1,
    fontSize: 11,
    color: '#606975',
    paddingTop: 1,
  },

  dottedLine: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#B6BBC1',
    marginVertical: 7,
  },

  reasonContainer: {
    width: 96,
    borderLeftWidth: 1,
    borderColor: '#E2E5E8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  reasonLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    marginBottom: 5,
  },

  reasonText: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'center',
  },

  footer: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

  chargeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },

  chargeAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#46607F',
  },
});