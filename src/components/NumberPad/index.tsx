import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onPress: (val: string) => void;
  onDelete: () => void;
}

const layout = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'delete'], // bottom row
];

const NumberPad: React.FC<Props> = ({ onPress, onDelete }) => {
  return (
    <View style={styles.pad}>
      {layout.map((row, rIndex) => (
        <View key={rIndex} style={styles.row}>
          {row.map((key, kIndex) => {
            if (key === '') {
              return <View key={kIndex} style={styles.empty} />;
            }

            if (key === 'delete') {
              return (
                <TouchableOpacity
                  key={kIndex}
                  style={styles.key}
                  onPress={onDelete}
                  activeOpacity={0.7}
                >
                  <Text style={styles.keyText}>✕</Text>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={kIndex}
                style={styles.key}
                onPress={() => onPress(key)}
                activeOpacity={0.7}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default NumberPad;

const styles = StyleSheet.create({
  pad: {
    gap: fp(16),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  key: {
    width: wp(80),
    height: hp(80),
    borderRadius: wp(80),
    backgroundColor: COLORS.white[200],
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  empty: {
    width: wp(80),
    height: hp(80),
  },

  keyText: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: fp(30),
    color: COLORS.black[500],
  },
});
