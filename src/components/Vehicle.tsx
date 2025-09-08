import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';

interface VehicleProps {
  type: 'car' | 'bus' | 'truck';
  isMoving: boolean;
  isStopped: boolean;
  speed: number;
  isAccelerating: boolean;
  mirrored?: boolean; // true si quieres que mire hacia el otro lado
}

const Vehicle: React.FC<VehicleProps> = ({ 
  type, 
  isMoving, 
  isStopped, 
  speed, 
  isAccelerating, 
  mirrored = false 
}) => {
  const scale = useSharedValue(1);
  const bounceY = useSharedValue(0);
  const exhaustSmoke = useSharedValue(0);
  const speedLines = useSharedValue(0);
  const headlightGlow = useSharedValue(0);

  useEffect(() => {
    if (isStopped) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
      bounceY.value = withSpring(0, { damping: 20 });
      exhaustSmoke.value = withTiming(0, { duration: 300 });
      speedLines.value = withTiming(0, { duration: 300 });
      headlightGlow.value = withTiming(0, { duration: 300 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    }
  }, [isStopped]);

  useEffect(() => {
    if (isMoving && speed > 0) {
      bounceY.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 400 }),
          withTiming(2, { duration: 400 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        false
      );

      exhaustSmoke.value = withRepeat(
        withTiming(1, { duration: 1000 }),
        -1,
        true
      );

      if (isAccelerating) {
        speedLines.value = withRepeat(
          withTiming(1, { duration: 150 }),
          -1,
          true
        );
      } else {
        speedLines.value = withTiming(0, { duration: 300 });
      }

      headlightGlow.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        true
      );
    } else {
      bounceY.value = withSpring(0, { damping: 20 });
      exhaustSmoke.value = withTiming(0, { duration: 300 });
      speedLines.value = withTiming(0, { duration: 300 });
      headlightGlow.value = withTiming(0, { duration: 300 });
    }
  }, [isMoving, speed, isAccelerating]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounceY.value },
      { scale: scale.value },
      mirrored ? { scaleX: -1 } : { scaleX: 1 }, // flip global
    ],
  }));

  const exhaustStyle = useAnimatedStyle(() => ({
    opacity: exhaustSmoke.value * 0.6,
    transform: [{ scale: 0.5 + exhaustSmoke.value * 0.5 }],
  }));

  const speedLinesStyle = useAnimatedStyle(() => ({
    opacity: speedLines.value * 0.8,
    transform: [{ scale: 0.5 + speedLines.value * 0.5 }],
  }));

  const headlightStyle = useAnimatedStyle(() => ({
    opacity: headlightGlow.value * 0.7,
    transform: [{ scale: 0.8 + headlightGlow.value * 0.2 }],
  }));

  const getVehicleEmoji = () => {
    switch (type) {
      case 'car': return '🚗';
      case 'bus': return '🚌';
      case 'truck': return '🚚';
      default: return '🚗';
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Humo del escape */}
      {isMoving && speed > 0 && (
        <Animated.View style={[styles.exhaust, exhaustStyle]}>
          <View style={styles.smoke1} />
          <View style={styles.smoke2} />
          <View style={styles.smoke3} />
        </Animated.View>
      )}

      {/* Faros delanteros */}
      {isMoving && speed > 0 && (
        <Animated.View style={[styles.headlights, headlightStyle]}>
          <View style={styles.headlight1} />
          <View style={styles.headlight2} />
        </Animated.View>
      )}

      {/* Vehículo principal */}
      <Animatable.Text 
        style={styles.vehicle}
        animation={isMoving && speed > 0 ? "pulse" : undefined}
        iterationCount="infinite"
        duration={600}
      >
        {getVehicleEmoji()}
      </Animatable.Text>

      {/* Líneas de velocidad */}
      {isAccelerating && (
        <Animated.View style={[styles.speedLines, speedLinesStyle]}>
          <View style={styles.speedLine1} />
          <View style={styles.speedLine2} />
          <View style={styles.speedLine3} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    left: '50%',
    marginLeft: -35,
    zIndex: 10,
    alignItems: 'center',
  },
  vehicle: {
    fontSize: 80,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4.65,
    elevation: 8,
  },
  exhaust: {
    position: 'absolute',
    left: -40,
    top: 30,
    width: 35,
    height: 45,
  },
  smoke1: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: 'rgba(200, 200, 200, 0.7)',
    position: 'absolute', top: 0, left: 5,
  },
  smoke2: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(180, 180, 180, 0.6)',
    position: 'absolute', top: 10, left: 8,
  },
  smoke3: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(160, 160, 160, 0.5)',
    position: 'absolute', top: 20, left: 10,
  },
  headlights: {
    position: 'absolute',
    right: -50,
    top: 20,
    width: 80,
    height: 20,
  },
  headlight1: {
    position: 'absolute',
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 200, 0.8)',
    top: 0, left: 10,
  },
  headlight2: {
    position: 'absolute',
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 200, 0.8)',
    top: 0, right: 10,
  },
  speedLines: {
    position: 'absolute',
    right: -60,
    top: 40,
    width: 30,
    height: 30,
  },
  speedLine1: {
    position: 'absolute',
    width: 25, height: 3, borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    top: 5, left: 0,
  },
  speedLine2: {
    position: 'absolute',
    width: 20, height: 3, borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    top: 12, left: 0,
  },
  speedLine3: {
    position: 'absolute',
    width: 15, height: 3, borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    top: 19, left: 0,
  },
});

export default Vehicle;