import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CustomRadioButtonProps {
  label?: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  label,
  selected,
  onPress,
  disabled = false,
  size = 20,
  activeColor = '#2563EB',
  inactiveColor = '#9CA3AF',
  labelStyle,
  containerStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        containerStyle,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View
        style={[
          styles.outerCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: selected ? activeColor : inactiveColor,
          },
        ]}
      >
        {selected && (
          <View
            style={[
              styles.innerCircle,
              {
                width: size * 0.5,
                height: size * 0.5,
                borderRadius: (size * 0.5) / 2,
                backgroundColor: activeColor,
              },
            ]}
          />
        )}
      </View>

      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  outerCircle: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  innerCircle: {},

  label: {
    marginLeft: 10,
    fontSize: 15,
    color: '#1F2937',
  },

  pressed: {
    opacity: 0.7,
  },

  disabled: {
    opacity: 0.5,
  },
});

export default CustomRadioButton;