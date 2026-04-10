import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { styles } from './LiveTracking.style';

const DATA = [
  { time: '09:00 AM', title: 'Post' },
  { time: '09:00 AM', title: 'Booking' },
  { time: '09:00 AM', title: 'Reporting' },
  { time: '09:00 AM', title: 'Loading Status' },
  { time: '09:00 AM', title: 'Payment' },
  { time: '09:00 AM', title: 'Departed (200, 300 m)' },
  { time: '09:00 AM', title: 'Location' },
  { time: '09:00 AM', title: 'Location' },
  { time: '09:00 AM', title: 'Location' },
  { time: '09:00 AM', title: 'Reporting' },
  { time: '09:00 AM', title: 'Unloading' },
  { time: '08:00 AM', title: 'Payment' },
  { time: '09:00 AM', title: 'Delivered' },
  { time: '09:00 AM', title: 'POD' },
];

const LiveTrackingScreen = () => {
  const renderItem = ({ item, index }: any) => {
    const isLast = index === DATA.length - 1;

    return (
      <View style={styles.row}>
        {/* LEFT (TIME) */}
        <Text style={styles.time}>{item.time}</Text>

        {/* CENTER (TIMELINE) */}
        <View style={styles.timeline}>
          <View style={styles.circle} />
          {!isLast && <View style={styles.line} />}
        </View>

        {/* RIGHT (TEXT) */}
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Tracking</Text>
        <Text style={styles.postId}>Post Id 262623</Text>
      </View>

      {/* DATE */}
      <Text style={styles.date}>05/03/2026</Text>

      {/* LIST */}
      <FlatList
        data={DATA}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default LiveTrackingScreen;
