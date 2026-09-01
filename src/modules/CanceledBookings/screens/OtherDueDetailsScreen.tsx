import React from 'react';

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import CancellationCard from '../components/CancellationCard';
import useOtherDueDetails from '../hooks/useOtherDueDetails';

const OtherDueDetailsScreen = () => {
  const navigation = useNavigation();

  const {
    pendingCharges,
    cancellationDetails,
  } = useOtherDueDetails();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}


      {/* Pending Charges */}
      <View style={styles.pendingContainer}>
        <Text style={styles.pendingText}>
          You Have Pending Charges
        </Text>

        <Text style={styles.pendingAmount}>
          {pendingCharges} ₹
        </Text>
      </View>

      {/* Content */}
      <FlatList
        data={cancellationDetails}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <CancellationCard item={item} />
        )}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>
            Cancellation Details
          </Text>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default OtherDueDetailsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    fontSize: 34,
    color: '#374151',
    lineHeight: 35,
    marginTop: -3,
  },

  headerTitle: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: '700',
    color: '#425B7A',
  },

  pendingContainer: {
    height: 40,
    backgroundColor: '#E9EFF7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  pendingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#456084',
  },

  pendingAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#456084',
  },

  listContent: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 30,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#456084',
    marginBottom: 14,
  },
});