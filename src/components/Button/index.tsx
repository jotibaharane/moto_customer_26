import { BORDER_RADIUS, COLORS, FONT_FAMILIES, fp, hp } from '@theme/index';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type Variant = 'filled' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean; // 👈 add this
  style?: ViewStyle;
  textStyle?: TextStyle;
  disbled?: boolean; // 👈 add this
}

const CustomButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'filled',
  loading = false,
  style,
  textStyle,
  disbled,
}) => {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={loading || disbled} // 👈 disable when loading
      style={[
        styles.button,
        isOutline ? styles.outline : styles.filled,
        loading || disbled ? styles.disabled : null, // 👈 optional opacity
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isOutline ? COLORS.primary[500] : COLORS.white[100]}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? styles.outlineText : styles.filledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    height: hp(56),
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filled: {
    backgroundColor: COLORS.primary[500],
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary[500],
  },

  disabled: {
    opacity: 0.6,
  },

  text: {
    fontSize: fp(16),
    fontFamily: FONT_FAMILIES.bold,
  },

  filledText: {
    color: COLORS.white[100],
  },

  outlineText: {
    color: COLORS.primary[500],
  },
});
