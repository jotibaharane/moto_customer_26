import { COLORS, FONT_FAMILIES, fp } from '@theme/index';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface Props {
  text: string;
}

const SlidingHeader: React.FC<Props> = ({ text }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (!containerWidth || !textWidth) return;

    const animate = () => {
      translateX.setValue(containerWidth);

      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -textWidth,
          duration: (containerWidth + textWidth) * 18,
          useNativeDriver: true,
        }),

        // 🔥 pause to hide jump
        Animated.delay(1000),
      ]).start(() => animate());
    };

    animate();
  }, [containerWidth, textWidth, text]);

  return (
    <View
      style={styles.container}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Animated.Text
        numberOfLines={1}
        onLayout={e => setTextWidth(e.nativeEvent.layout.width)}
        style={[
          styles.text,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

export default SlidingHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  text: {
    fontSize: fp(14),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.primary[500],
    flex: 1,
  },
});
