import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {styles} from './../Loadingstatus.style';

type LoadStatus = 'REPORTED' | 'LOADING' | 'PAYMENT';

interface ReportedContentProps {
  loadPostId: string;
  reportedTime: string;
  onStatusChange: (status: LoadStatus) => void;
}

export const ReportedContent = ({
  loadPostId,
  reportedTime,
  onStatusChange,
}: ReportedContentProps) => {
  return (
    <View style={styles.content}>

      <View style={styles.reportedMessage}>
        <Text style={styles.bullet}>•</Text>

        <Text style={styles.reportedText}>
          Vehicle Reported at {reportedTime}
        </Text>
      </View>

      <Pressable
        style={styles.reportedRow}
        onPress={() => {
          console.log('LOADING CLICKED');
          onStatusChange('LOADING');
        }}>
        <View style={styles.radioCircle} />

        <Text style={styles.disabledText}>
          Vehicle Loading status
        </Text>
      </Pressable>

      <Pressable
        style={styles.reportedRow}
        onPress={() => {
          console.log('PAYMENT CLICKED');
          onStatusChange('PAYMENT');
        }}>
        <View style={styles.radioCircle} />

        <Text style={styles.disabledText}>
          Payment
        </Text>
      </Pressable>

    </View>
  );
};