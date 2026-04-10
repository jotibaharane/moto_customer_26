import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { RadioButtonProps } from './types';

export default function RadioButton({
  disabled = false,
  id,
  label,
  labelStyle,
  layout = 'row',
  onPress,
  selected = false,
}: RadioButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress ? () => onPress(id, label) : undefined}
      style={styles.container}
    >
      <View
        style={[
          styles.border,
          selected && {
            backgroundColor: COLORS.primary[500],
            borderColor: COLORS.primary[500],
          },
        ]}
      >
        {selected && <View style={styles.smallBorder} />}
      </View>

      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(16),
    gap: hp(19),
  },
  border: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    height: hp(20),
    width: wp(20),
    borderRadius: hp(10),
    borderColor: COLORS.gray[250],
    backgroundColor: COLORS.white[100],
  },
  smallBorder: {
    height: hp(10),
    width: wp(10),
    backgroundColor: COLORS.white[100],
    borderRadius: hp(10),
  },
  label: {
    fontSize: fp(14),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[650],
  },
});
