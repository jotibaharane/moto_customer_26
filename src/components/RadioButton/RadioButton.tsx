import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_FAMILIES, FONT_SIZES, ms, s, vs } from '@theme/index';
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
    marginBottom: vs(5),
    gap: s(19),
  },

  border: {
    justifyContent: 'center',
    alignItems: 'center',
    width: s(20),
    height: s(20),

    borderWidth: 1,
    borderRadius: s(10),

    borderColor: COLORS.gray[250],
    backgroundColor: COLORS.white[100],
  },

  smallBorder: {
    width: s(10),
    height: s(10),

    borderRadius: s(5),
    backgroundColor: COLORS.white[100],
  },

  label: {
    fontSize: ms(14),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.gray[650],
  },
});
