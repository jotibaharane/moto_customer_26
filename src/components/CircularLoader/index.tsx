import { COLORS, FONT_FAMILIES, fp } from '@theme/index';
import * as React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const TOTAL_SLICES = 12;

const CircularLoader = ({
  duration = 150,
  showTimer = true,
  loading = true,
  autoProgress = true, // 🔥 control slice animation
}: {
  duration?: number;
  showTimer?: boolean;
  loading?: boolean;
  autoProgress?: boolean;
}) => {
  const [activeSlice, setActiveSlice] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(duration);

  const STEP_TIME = (duration * 1000) / TOTAL_SLICES;

  /* 🔥 SLICE PROGRESS */
  React.useEffect(() => {
    if (!autoProgress || !loading) return;

    const interval = setInterval(() => {
      setActiveSlice(prev => (prev >= TOTAL_SLICES - 1 ? prev : prev + 1));
    }, STEP_TIME);

    return () => clearInterval(interval);
  }, [autoProgress, loading]);

  /* 🔥 TIMER */
  React.useEffect(() => {
    if (!showTimer || !loading) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showTimer, loading]);

  /* 🔥 FORMAT TIME */
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  /* 🔥 ARC GENERATOR */
  const createArc = (index: number) => {
    const cx = 62.5;
    const cy = 62.5;
    const outerR = 60;
    const innerR = 27;
    const gap = 2;

    const angle = 360 / TOTAL_SLICES;
    const start = index * angle + gap;
    const end = (index + 1) * angle - gap;

    const so = polar(cx, cy, outerR, start);
    const eo = polar(cx, cy, outerR, end);
    const si = polar(cx, cy, innerR, end);
    const ei = polar(cx, cy, innerR, start);

    return `
      M ${so.x} ${so.y}
      A ${outerR} ${outerR} 0 0 1 ${eo.x} ${eo.y}
      L ${si.x} ${si.y}
      A ${innerR} ${innerR} 0 0 0 ${ei.x} ${ei.y}
      Z
    `;
  };

  const polar = (cx: number, cy: number, r: number, angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  if (!loading) return null; // 🔥 hide loader

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={125} height={125} viewBox="0 0 125 125">
        {Array.from({ length: TOTAL_SLICES }).map((_, i) => (
          <Path
            key={i}
            d={createArc(i)}
            fill={i <= activeSlice ? '#4CAF50' : '#FFF'}
          />
        ))}

        <Circle cx={62.5} cy={62.5} r={25} fill="#4CAF50" stroke="white" />
      </Svg>

      {showTimer && (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: fp(16),
              fontFamily: FONT_FAMILIES.semiBold,
              color: COLORS.white[100],
            }}
          >
            {formatTime(timeLeft)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CircularLoader;
