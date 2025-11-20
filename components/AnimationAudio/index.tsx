import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface AnimationAudioProps {
  startAudioRecording: boolean;
  barCount?: number;
  barWidth?: number;
  barHeight?: number;
  barColor?: string;
}

const AnimationAudio: React.FC<AnimationAudioProps> = ({
  startAudioRecording,
  barCount = 20,
  barWidth = 4,
  barHeight = 75,
  barColor = '#00E5E5',
}) => {
  // Keep a stable array of Animated.Value instances
  const valuesRef = useRef<Animated.Value[]>([]);

  // If barCount changes, recreate the values array with the correct length
  if (valuesRef.current.length !== barCount) {
    valuesRef.current = Array.from({ length: barCount }, () => new Animated.Value(0));
  }

  // Keep references to the running animations so we can stop them reliably
  const runningAnimationsRef = useRef<Animated.CompositeAnimation[]>([]);

  const animateBars = () => {
    // Stop any previously running animations
    runningAnimationsRef.current.forEach((anim) => {
      try {
        anim.stop();
      } catch (e) {
        // ignore
      }
    });

    // Build a looped animation for each bar
    runningAnimationsRef.current = valuesRef.current.map((val, i) => {
      // small randomization so bars don't all move in exact sync
      const upDuration = 220 + (i % 5) * 30;
      const downDuration = 220 + ((barCount - i) % 5) * 25;

      const seq = Animated.sequence([
        Animated.timing(val, {
          toValue: 1,
          duration: upDuration,
          useNativeDriver: true,
        }),
        Animated.timing(val, {
          toValue: 0,
          duration: downDuration,
          useNativeDriver: true,
        }),
      ]);

      return Animated.loop(seq);
    });

    // Stagger the start so the waveform looks organic
    Animated.stagger(80, runningAnimationsRef.current).start();
  };

  const stopBars = () => {
    runningAnimationsRef.current.forEach((anim) => {
      try {
        anim.stop();
      } catch (e) {
        // ignore
      }
    });

    // Reset values back to small base to avoid fully collapsed bars
    valuesRef.current.forEach((v) => v.setValue(0));
  };

  useEffect(() => {
    if (startAudioRecording) {
      animateBars();
    } else {
      stopBars();
    }

    // cleanup when component unmounts
    return () => {
      runningAnimationsRef.current.forEach((anim) => {
        try {
          anim.stop();
        } catch (e) {
          // ignore
        }
      });
    };
  }, [startAudioRecording, barCount]);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', height: barHeight }}>
      {valuesRef.current.map((anim, index) => {
        const scaleY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.25, 1],
        });

        return (
          <Animated.View
            key={index}
            style={{
              width: barWidth,
              height: barHeight,
              marginHorizontal: 2,
              backgroundColor: barColor,
              transform: [{ scaleY }],
              borderRadius: 4,
            }}
          />
        );
      })}
    </View>
  );
};

export default AnimationAudio;
