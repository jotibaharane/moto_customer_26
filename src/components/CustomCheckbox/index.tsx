// components/CustomCheckbox.tsx

import { s } from '@theme/scaling-utils';
import { CheckSquare, Square } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface CustomCheckboxProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => !disabled && onValueChange(!value)}
    >
      {value ? (
        <CheckSquare fill={'#07e249'} color={'#000'} size={24} />
      ) : (
        <Square size={24} />
      )}
    </TouchableOpacity>
  );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: s(22),
    height: s(22),

    borderWidth: 2,
    borderColor: '#333',
    borderRadius: s(4),

    justifyContent: 'center',
    alignItems: 'center',
  },

  checked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },

  innerCheck: {
    width: s(10),
    height: s(10),

    borderRadius: s(2),
    backgroundColor: '#fff',
  },

  label: {
    marginLeft: s(8),
    fontSize: 14, // Figma font size same
    color: '#333',
  },

  disabled: {
    opacity: 0.5,
  },
});
