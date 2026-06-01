import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_FAMILIES, FONT_SIZES, fp, hp, wp } from '@theme/index';
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
    marginBottom: 5,
    gap: 19,
  },
  border: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: COLORS.gray[250],
    backgroundColor: COLORS.white[100],
  },
  smallBorder: {
    height: 10,
    width: 10,
    backgroundColor: COLORS.white[100],
    borderRadius: 10,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[650],
  },
});
