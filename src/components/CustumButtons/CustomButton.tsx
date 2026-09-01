import { wp } from '@theme/index';
import { moderateScale } from '@theme/New/responsive';
import React, {memo, useCallback} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';



type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface CustomButtonProps {
  title: string;
  onPress: () => void;

  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;

  width?: number;
  height?: number;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  containerStyle?: ViewStyle;
  textStyle?: TextStyle;

  borderRadius?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,

  width = 90,
  height = 50,

  leftIcon,
  rightIcon,

  containerStyle,
  textStyle,

  borderRadius = 10,
}) => {
  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      onPress();
    }
  }, [disabled, loading, onPress]);

  const getButtonStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;

      case 'outline':
        return styles.outline;

      case 'danger':
        return styles.danger;

      case 'primary':
      default:
        return styles.primary;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;

      case 'secondary':
        return styles.secondaryText;

      case 'danger':
      case 'primary':
      default:
        return styles.whiteText;
    }
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({pressed}) => [
        styles.button,
        getButtonStyle(),

        {
          width: wp(width),
          height: moderateScale(height),
          borderRadius: moderateScale(borderRadius),
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
        },

        containerStyle,
      ]}>
      
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? '#000000' : '#FFFFFF'}
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && (
            <View style={styles.leftIcon}>
              {leftIcon}
            </View>
          )}

          <Text
            numberOfLines={1}
            style={[
              styles.text,
              getTextStyle(),
              textStyle,
            ]}>
            {title}
          </Text>

          {rightIcon && (
            <View style={styles.rightIcon}>
              {rightIcon}
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default memo(CustomButton);

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(12),
  },

  text: {
    fontSize: moderateScale(15),
    color:'#DC3545',
    fontWeight: '600',
  },

  leftIcon: {
    marginRight: moderateScale(8),
  },

  rightIcon: {
    marginLeft: moderateScale(8),
  },

  primary: {
    backgroundColor: 'transparent',
  },

  secondary: {
    backgroundColor: '#E9EEF8',
  },

  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1E5EFF',
  },

  danger: {
    backgroundColor: '#DC3545',
  },

  whiteText: {
    color: '#FFFFFF',
  },

  secondaryText: {
    color: '#1E293B',
  },

  outlineText: {
    color: '#1E5EFF',
  },
});