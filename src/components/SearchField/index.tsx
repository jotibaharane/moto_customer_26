import { COLORS, FONT_FAMILIES, fp, wp } from '@theme/index';
import { MapPin, Search, X } from 'lucide-react-native';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface Props extends TextInputProps {
  iconType?: 'search' | 'location';
  onPress?: () => void; // optional (for readonly field like address picker)
  iconColor?: string; // optional, default to primary color
  containerStyle?: StyleProp<ViewStyle>;
}

const SearchField: React.FC<Props> = ({
  iconType = 'search',
  onPress,
  editable = true,
  iconColor = '#4CAF50',
  containerStyle,
  value,
  ...props
}) => {
  const Icon = iconType === 'location' ? MapPin : Search;

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <Icon size={32} color="#fff" fill={iconColor} />

      <TextInput
        {...props}
        editable={editable}
        value={value}
        placeholderTextColor="#4C002E"
        style={styles.input}
      />
      {value ? (
        <TouchableOpacity
          onPress={() => props.onChangeText?.('')}
          style={styles.clearBtn}
        >
          <X size={24} color="#999" />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

export default SearchField;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },

  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(16),
    padding: wp(8),
    backgroundColor: COLORS.white[100],
    overflow: 'hidden',
  },

  input: {
    flex: 1,
    fontSize: fp(16),
    color: '#6D4C5B',
    fontFamily: FONT_FAMILIES.medium,
    borderRadius: wp(16),
  },
  clearBtn: {
    padding: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
