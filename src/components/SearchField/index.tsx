import { IconMapPinFilled } from '@tabler/icons-react-native';
import { FONT_FAMILIES, ms, s } from '@theme/index';
import { Colors } from '@theme/New';
import { Search } from 'lucide-react-native';
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
  const Icon = iconType === 'location' ? IconMapPinFilled : Search;

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <Icon size={32} color={iconColor} />

  <TextInput
  {...props}
  editable={editable}
  value={value}
  placeholderTextColor="#4C002E"
  style={styles.input}
  numberOfLines={2}
  multiline
/>
      {/* {value ? (
        <TouchableOpacity
          onPress={() => props.onChangeText?.('')}
          style={styles.clearBtn}
        >
          <X size={24} color="#999" />
        </TouchableOpacity>
      ) : null} */}
    </TouchableOpacity>
  );
};

export default SearchField;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

container: {
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  minHeight: s(55),
  paddingHorizontal: s(4),
  paddingVertical: s(4),
  borderRadius: s(16),
  backgroundColor: Colors.white,
  overflow: 'hidden',
},

input: {
  flex: 1,
  minWidth: 0,
  fontSize: ms(14),
  color: '#6D4C5B',
  fontFamily: FONT_FAMILIES.medium,
  textAlign: 'center',
  textAlignVertical: 'center',
  includeFontPadding: false,
  paddingVertical: s(2),
  paddingHorizontal: s(2),
  borderRadius: s(16),
},
});
