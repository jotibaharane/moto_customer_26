import {
  COLORS,
  FONT_FAMILIES,
  moderateScale,
  scale,
  verticalScale,
} from '@theme/index';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  // @ts-ignore
  LogBox,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface InputOutlineMethods {
  /**
   * Requests focus for the given input or view. The exact behavior triggered will depend on the platform and type of view.
   */
  focus: () => void;
  /**
   * Removes focus from an input or view. This is the opposite of focus()
   */
  blur: () => void;
  /**
   * Returns current focus of input.
   */
  isFocused: Boolean;
  /**
   * Removes all text from the TextInput.
   */
  clear: () => void;
}

export interface InputOutlineProps extends TextInputProps {
  /**
   * Placeholder for the textinput.
   * @default Placeholder
   * @type string
   */
  placeholder?: string;
  /**
   * Font size for TextInput.
   * @default 14
   * @type number
   */
  fontSize?: number;
  /**
   * Color of TextInput font.
   * @default 'black'
   * @type string
   */
  fontColor?: string;
  /**
   * Font family for all fonts.
   * @default undefined
   * @type string
   */
  fontFamily?: string;
  /**
   * Vertical padding for TextInput Container. Used to calculate animations.
   * @default 12
   * @type number
   */
  paddingVertical?: number;
  /**
   * Vertical padding for TextInput Container.
   * @default 16
   * @type number
   */
  paddingHorizontal?: number;
  /**
   * Color when focused.
   * @default 'blue'
   * @type string
   */
  activeColor?: string;
  /**
   * Color when blurred (not focused).
   * @default 'grey'
   * @type string
   */
  inactiveColor?: string;
  /**
   * Background color of the InputOutline.
   * @default 'white'
   * @type string
   */
  backgroundColor?: string;
  /**
   * Error message is displayed. If anything is provided to error besides null or undefined, then the component is
   * within an error state, thus displaying the error message provided here and errorColor.
   * @default undefined
   * @type string
   */
  error?: string;
  /**
   * Color that is displayed when in error state. Error state is anything that is not null or undefined.
   * @default 'red'
   * @type string
   */
  errorColor?: string;
  /**
   * Trailing Icon for the TextInput.
   * @default undefined
   * @type React.FC
   */
  TrailingIcon?: React.FC;
  /**
   * Border radius applied to container.
   * @default 5
   * @type number
   */
  roundness?: number;
  /**
   * Will show a character count helper text and limit the characters being entered.
   * @default undefined
   * @type number
   */
  characterCount?: number;
  characterCountFontSize?: number;
  characterCountFontFamily?: string;
  characterCountColor?: string;
  /**
   * Helper text that can be displayed to assist users with Inputs. `error` prop will override this.
   * @default undefined
   * @type string
   */
  assistiveText?: string;
  /**
   * Font size of assistive text.
   * @default 10
   * @type number
   */
  assistiveTextFontSize?: number;
  /**
   * Color of assistive text.
   * @default inactiveColor
   * @type string
   */
  assistiveTextColor?: string;
  /**
   * Font family of assistive text.
   * @default undefined
   * @type string
   */
  assistiveFontFamily?: string;
  /**
   * Font size of error text.
   * @default 10
   * @type number
   */
  errorFontSize?: number;
  /**
   * Font family of error text.
   * @default undefined
   * @type string
   */
  errorFontFamily?: string;
}

type InputOutline = InputOutlineMethods;

const InputOutlineComponent = forwardRef<InputOutline, InputOutlineProps>(
  (props, ref) => {
    const scrollRef = useRef<ScrollView>(null);
    const inputY = useRef(0);

    const scrollToInput = () => {
      scrollRef.current?.scrollTo({
        y: inputY.current - 100,
        animated: true,
      });
    };

    // establish provided props
    const {
      inactiveColor = COLORS.gray[75],
      activeColor = COLORS.primary[500],
      errorColor = 'red',
      backgroundColor = 'white',

      fontSize = moderateScale(16),
      fontColor = COLORS.black[500],
      fontFamily = FONT_FAMILIES.medium,

      error,
      errorFontSize = moderateScale(10),
      errorFontFamily,

      assistiveText,
      assistiveTextFontSize = moderateScale(10),
      assistiveTextColor = inactiveColor,
      assistiveFontFamily,

      characterCount,
      characterCountFontFamily,
      characterCountColor = inactiveColor,
      characterCountFontSize = moderateScale(10),

      placeholderTextColor = COLORS.black[500],

      paddingHorizontal = scale(16),
      paddingVertical = verticalScale(12),
      roundness = scale(8),

      style,
      selectionColor = COLORS.black[500],

      placeholder = 'Placeholder',
      TrailingIcon,
      editable,

      value: _providedValue = '',
      onChangeText,
      ...inputProps
    } = props;
    // value of input
    const [value, setValue] = useState(_providedValue);

    // animation vars
    const inputRef = useRef<TextInput>(null);
    const placeholderMap = useSharedValue(_providedValue ? 1 : 0);
    const placeholderSize = useSharedValue(0);
    const colorMap = useSharedValue(0);

    // helper functinos
    const focus = () => inputRef.current?.focus();
    const blur = () => inputRef.current?.blur();
    const isFocused = () => Boolean(inputRef.current?.isFocused());
    const clear = () => {
      Boolean(inputRef.current?.clear());
      setValue('');
    };

    const errorState = useCallback(
      () => error !== null && error !== undefined,
      [error],
    );

    const handleFocus = () => {
      scrollToInput();
      placeholderMap.value = withTiming(1); // focused
      if (!errorState()) colorMap.value = withTiming(1); // active
      focus();
    };

    const handleBlur = () => {
      if (!value) placeholderMap.value = withTiming(0); // blur
      if (!errorState()) colorMap.value = withTiming(0); // inactive
      blur();
    };

    const handleChangeText = (text: string) => {
      onChangeText && onChangeText(text);
      setValue(text);
    };

    const handlePlaceholderLayout = useCallback(
      ({ nativeEvent }: { nativeEvent: { layout: { width: number } } }) => {
        const { width } = nativeEvent.layout;
        placeholderSize.value = width;
      },
      [placeholderSize],
    );

    // handle value update
    useEffect(() => {
      if (_providedValue.length) placeholderMap.value = withTiming(1); // focused;
      setValue(_providedValue);
    }, [_providedValue, placeholderMap]);
    // error handling
    useEffect(() => {
      if (errorState()) {
        colorMap.value = 2; // error -- no animation here, snap to color immediately
      } else {
        colorMap.value = isFocused() ? 1 : 0; // to active or inactive color if focused
      }
    }, [error, colorMap, errorState]);

    const animatedPlaceholderStyles = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: interpolate(placeholderMap.value, [0, 1], [0, -25]),
        },
        {
          scale: interpolate(placeholderMap.value, [0, 1], [1, 0.7]),
        },
        {
          translateX: interpolate(
            placeholderMap.value,
            [0, 1],
            [0, -placeholderSize.value * 0.2],
          ),
        },
      ],
    }));

    const animatedPlaceholderTextStyles = useAnimatedStyle(() => ({
      color: interpolateColor(
        colorMap.value,
        [0, 1, 2],
        [COLORS.black[500], activeColor, errorColor],
      ),
    }));

    const animatedPlaceholderSpacerStyles = useAnimatedStyle(() => ({
      width: interpolate(
        placeholderMap.value,
        [0, 1],
        [0, placeholderSize.value * 0.7 + 7],
        Extrapolate.CLAMP,
      ),
    }));

    const animatedContainerStyle = useAnimatedStyle(() => ({
      borderColor:
        placeholderSize.value > 0
          ? interpolateColor(
              colorMap.value,
              [0, 1, 2],
              [inactiveColor, activeColor, errorColor],
            )
          : inactiveColor,
    }));

    useImperativeHandle(ref, () => ({
      focus: handleFocus,
      blur: handleBlur,
      isFocused: isFocused(),
      clear: clear,
    }));
    const styles = StyleSheet.create({
      container: {
        borderWidth: 1,
        borderRadius: roundness,
        alignSelf: 'stretch',
        flexDirection: 'row',
        backgroundColor,
        height: verticalScale(56), // 48 ऐवजी
        borderColor: COLORS.gray[75],
      },

      inputContainer: {
        flex: 1,
        paddingHorizontal,
        paddingVertical:
          Platform.OS !== 'android' ? paddingVertical : undefined,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
      },

      input: {
        flex: 1,
        fontSize,
        fontFamily,
        color: fontColor,
      },

      placeholder: {
        position: 'absolute',
        top: paddingVertical,
        left: paddingHorizontal,
        backgroundColor, // '#fff' काढा
      },

      placeholderText: {
        fontSize,
        fontFamily,
      },

      placeholderSpacer: {
        position: 'absolute',
        top: -1,
        left: paddingHorizontal - scale(3),
        backgroundColor,
        height: 1,
      },

      errorText: {
        position: 'absolute',
        color: errorColor,
        fontSize: errorFontSize,
        fontFamily: errorFontFamily,
        bottom: -moderateScale(errorFontSize) - verticalScale(7),
        left: paddingHorizontal,
      },

      trailingIcon: {
        position: 'absolute',
        right: paddingHorizontal,
        alignSelf: 'center',
      },

      counterText: {
        position: 'absolute',
        color: errorState() ? errorColor : characterCountColor,
        fontSize: characterCountFontSize,
        bottom: -moderateScale(characterCountFontSize) - verticalScale(7),
        right: paddingHorizontal,
        fontFamily: characterCountFontFamily,
      },

      assistiveText: {
        position: 'absolute',
        color: assistiveTextColor,
        fontSize: assistiveTextFontSize,
        bottom: -moderateScale(assistiveTextFontSize) - verticalScale(7),
        left: paddingHorizontal,
        fontFamily: assistiveFontFamily,
      },
    });
    const placeholderStyle = useMemo(() => {
      return [styles.placeholder, animatedPlaceholderStyles];
    }, [styles.placeholder, animatedPlaceholderStyles]);

    return (
      <Animated.View style={[styles.container, animatedContainerStyle, style]}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (editable) handleFocus();
          }}
        >
          <View
            style={styles.inputContainer}
            onLayout={e => {
              inputY.current = e.nativeEvent.layout.y;
            }}
          >
            <TextInput
              {...inputProps}
              ref={inputRef}
              style={styles.input}
              editable={editable}
              pointerEvents={isFocused() ? 'auto' : 'none'}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChangeText={handleChangeText}
              maxLength={characterCount ? characterCount : undefined}
              selectionColor={errorState() ? errorColor : activeColor}
              value={value}
              numberOfLines={1}
            />
          </View>
        </TouchableWithoutFeedback>
        {TrailingIcon && (
          <View style={styles.trailingIcon}>{<TrailingIcon />}</View>
        )}
        <Animated.View
          style={[styles.placeholderSpacer, animatedPlaceholderSpacerStyles]}
        />
        <Animated.View
          style={placeholderStyle}
          onLayout={handlePlaceholderLayout}
          pointerEvents="none"
        >
          <Animated.Text
            style={[styles.placeholderText, animatedPlaceholderTextStyles]}
          >
            {placeholder}
          </Animated.Text>
        </Animated.View>
        {characterCount && (
          <Text
            style={styles.counterText}
          >{`${value.length} / ${characterCount}`}</Text>
        )}
        {errorState() ? (
          <Text style={[styles.errorText]}>{error}</Text>
        ) : (
          assistiveText && (
            <Text style={[styles.assistiveText]}>{assistiveText}</Text>
          )
        )}
      </Animated.View>
    );
  },
);

const InputOutline = InputOutlineComponent;
export { InputOutline };

// color issue
LogBox.ignoreLogs(['You are setting the style `{ color: ... }` as a prop.']);
