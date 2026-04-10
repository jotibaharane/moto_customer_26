import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  GestureResponderEvent,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Modal,
  ModalProps,
  PanResponder,
  PanResponderGestureState,
  Platform,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import styles from './style';

type CustomStyles = {
  wrapper?: ViewStyle;
  container?: ViewStyle;
  draggableIcon?: ViewStyle;
};

export interface RBSheetRef {
  open: () => void;
  close: () => void;
}

interface Props {
  height?: number;
  openDuration?: number;
  closeDuration?: number;
  closeOnPressMask?: boolean;
  closeOnPressBack?: boolean;
  draggable?: boolean;
  dragOnContent?: boolean;
  useNativeDriver?: boolean;
  customStyles?: CustomStyles;
  customModalProps?: ModalProps;
  customAvoidingViewProps?: KeyboardAvoidingViewProps;
  onOpen?: (() => void) | null;
  onClose?: (() => void) | null;
  children?: React.ReactNode;
}

const RBSheet = forwardRef<RBSheetRef, Props>((props, ref) => {
  const {
    height = 260,
    openDuration = 300,
    closeDuration = 200,
    closeOnPressMask = true,
    closeOnPressBack = false,
    draggable = false,
    dragOnContent = false,
    useNativeDriver = false,
    customStyles = {},
    customModalProps = {},
    customAvoidingViewProps = {},
    onOpen = null,
    onClose = null,
    children = <View />,
  } = props;

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const animatedHeight = useRef<Animated.Value>(
    new Animated.Value(height),
  ).current;

  const pan = useRef<Animated.ValueXY>(new Animated.ValueXY()).current;

  useImperativeHandle(ref, () => ({
    open: () => handleSetVisible(true),
    close: () => handleSetVisible(false),
  }));

  const createPanResponder = () => {
    return PanResponder.create({
      onStartShouldSetPanResponder: (): boolean => draggable,

      onMoveShouldSetPanResponder: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ): boolean => draggable && dragOnContent && gestureState.dy > 0,

      onPanResponderMove: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        if (gestureState.dy > 0) {
          Animated.event([null, { dy: pan.y }], {
            useNativeDriver,
          })(e, gestureState);
        }
      },

      onPanResponderRelease: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        if (gestureState.dy > 100) {
          handleSetVisible(false);
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver,
          }).start();
        }
      },
    });
  };

  const panResponder = useRef(createPanResponder()).current;

  const handleSetVisible = (visible: boolean) => {
    if (visible) {
      setModalVisible(visible);

      if (typeof onOpen === 'function') {
        onOpen();
      }

      Animated.timing(animatedHeight, {
        useNativeDriver,
        toValue: height,
        duration: openDuration,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        useNativeDriver,
        toValue: 0,
        duration: closeDuration,
      }).start(() => {
        setModalVisible(visible);
        pan.setValue({ x: 0, y: 0 });

        if (typeof onClose === 'function') {
          onClose();
        }
      });
    }
  };

  return (
    <Modal
      testID="Modal"
      transparent
      visible={modalVisible}
      onRequestClose={
        closeOnPressBack ? () => handleSetVisible(false) : undefined
      }
      {...customModalProps}
    >
      <KeyboardAvoidingView
        testID="KeyboardAvoidingView"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.wrapper, customStyles.wrapper]}
        {...customAvoidingViewProps}
      >
        <TouchableOpacity
          testID="TouchableOpacity"
          style={styles.mask}
          activeOpacity={1}
          onPress={closeOnPressMask ? () => handleSetVisible(false) : undefined}
        />

        <Animated.View
          testID="AnimatedView"
          {...(dragOnContent && panResponder.panHandlers)}
          style={[
            styles.container,
            { transform: pan.getTranslateTransform() },
            { height: animatedHeight },
            customStyles.container,
          ]}
        >
          {draggable && (
            <View
              testID="DraggableView"
              {...(!dragOnContent && panResponder.panHandlers)}
              style={styles.draggableContainer}
            >
              <View
                testID="DraggableIcon"
                style={[styles.draggableIcon, customStyles.draggableIcon]}
              />
            </View>
          )}

          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

export default RBSheet;
