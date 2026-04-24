// components/CustomCheckbox.tsx

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
    height: 22,
    width: 22,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  innerCheck: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  disabled: {
    opacity: 0.5,
  },
});
