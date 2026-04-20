import { FONT_FAMILIES, fp } from '@theme/index';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import CircularLoader from '../CircularLoader';

const OverlayLoader = ({
  visible = false,
  duration = 150,
  showTimer = true,
  text = 'Waiting for driver...',
  onClose, // ✅ add this
}: any) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose} // ✅ handle back
    >
      <View style={styles.container}>
        <View style={styles.overlay} />

        <View style={styles.card}>
          <CircularLoader duration={duration} showTimer={showTimer} />
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default OverlayLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* 🔥 FAKE BLUR */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#d9d9d9d0', // dim background
  },

  /* 🔥 GLASS CARD */
  card: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },

  text: {
    marginTop: 12,
    color: '#4CAF50',
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: fp(20),
    textAlign: 'center',
  },
});
