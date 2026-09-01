import React, {memo, useCallback} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {IconX} from '@tabler/icons-react-native';
import {moderateScale} from '@theme/New/responsive';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;

  /**
   * Modal width in percentage.
   * Example: 90 = 90%
   */
  width?: number;

  closeOnBackdropPress?: boolean;
  containerStyle?: ViewStyle;
  showCloseButton?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  children,
  width = 88,
  closeOnBackdropPress = true,
  containerStyle,
  showCloseButton = true,
}) => {
  const handleBackdropPress = useCallback(() => {
    if (closeOnBackdropPress) {
      onClose();
    }
  }, [closeOnBackdropPress, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.overlay}>

        {/* Backdrop */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
        />

        {/* Modal */}
        <View
          style={[
            styles.modalContainer,
            {
              width: `${width}%`,
            },
            containerStyle,
          ]}>

          {/* Close Button */}
          {showCloseButton && (
            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={styles.closeButton}>
              <IconX
                size={moderateScale(22)}
                color="#333"
              />
            </Pressable>
          )}

          {children}
        </View>
      </View>
    </Modal>
  );
};

export default memo(CustomModal);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: moderateScale(16),
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),

    padding: moderateScale(20),

    minHeight: moderateScale(150),

    elevation: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  closeButton: {
    position: 'absolute',

    top: moderateScale(10),
    right: moderateScale(10),

    width: moderateScale(36),
    height: moderateScale(36),

    borderRadius: moderateScale(18),

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#F2F2F2',

    zIndex: 10,
  },
});