import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  withSequence,
  withRepeat
} from 'react-native-reanimated';

interface GameHUDProps {
  score: number;
  level: number;
  distance: number;
  speed: number;
  currentTrafficLight: 'red' | 'yellow' | 'green';
  showFeedback: boolean;
  feedbackMessage: string;
  feedbackType: 'success' | 'error' | 'warning' | 'info';
}

const GameHUD: React.FC<GameHUDProps> = ({
  score,
  level,
  distance,
  speed,
  currentTrafficLight,
  showFeedback,
  feedbackMessage,
  feedbackType
}) => {
  const [showSpeedWarning, setShowSpeedWarning] = useState(false);
  const pulseValue = useSharedValue(1);
  const feedbackScale = useSharedValue(0);

  useEffect(() => {
    if (showFeedback) {
      feedbackScale.value = withSequence(
        withSpring(1.2, { damping: 10 }),
        withSpring(1, { damping: 10 })
      );
    } else {
      feedbackScale.value = withTiming(0, { duration: 300 });
    }
  }, [showFeedback]);

  useEffect(() => {
    if (speed > 3) {
      setShowSpeedWarning(true);
      pulseValue.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      setShowSpeedWarning(false);
      pulseValue.value = withTiming(1, { duration: 300 });
    }
  }, [speed]);

  const feedbackStyle = useAnimatedStyle(() => ({
    transform: [{ scale: feedbackScale.value }],
  }));

  const speedWarningStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const getFeedbackColor = () => {
    switch (feedbackType) {
      case 'success': return '#4CAF50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'info': return '#2196F3';
      default: return '#2196F3';
    }
  };

  const getFeedbackEmoji = () => {
    switch (feedbackType) {
      case 'success': return '🎉';
      case 'error': return '⚠️';
      case 'warning': return '🚨';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.headerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Puntos</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Nivel</Text>
          <Text style={styles.statValue}>{level}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Distancia</Text>
          <Text style={styles.statValue}>{Math.floor(distance)}m</Text>
        </View>
      </View>

      {/* Speed Indicator */}
      <View style={styles.speedContainer}>
        <Text style={styles.speedLabel}>Velocidad</Text>
        <View style={styles.speedBar}>
          {Array.from({ length: 5 }, (_, index) => (
            <View
              key={index}
              style={[
                styles.speedSegment,
                index < speed && styles.speedSegmentActive,
                index < speed && { backgroundColor: speed > 3 ? '#ff4444' : '#4CAF50' },
                index < 4 ? { marginRight: 3 } : {}
              ]}
            />
          ))}
        </View>
        {showSpeedWarning && (
          <Animated.View style={[styles.speedWarning, speedWarningStyle]}>
            <Text style={styles.speedWarningText}>¡Muy rápido! 🚨</Text>
          </Animated.View>
        )}
      </View>

      {/* Traffic Light Status */}
      <View style={styles.trafficStatus}>
        <View style={[styles.trafficDot, { backgroundColor: 
          currentTrafficLight === 'red' ? '#ff4444' : 
          currentTrafficLight === 'yellow' ? '#ffdd44' : 
          '#44ff44' 
        }]} />
        <Text style={styles.trafficText}>
          {currentTrafficLight === 'red' ? 'ROJO - FRENAR' : 
           currentTrafficLight === 'yellow' ? 'AMARILLO - PRECAUCIÓN' : 
           'VERDE - CONTINUAR'}
        </Text>
      </View>

      {/* Feedback Message */}
      {showFeedback && (
        <Animated.View style={[styles.feedbackContainer, feedbackStyle]}>
          <Animatable.View
            animation="bounceIn"
            duration={500}
            style={[styles.feedbackBox, { backgroundColor: getFeedbackColor() }]}
          >
            <Text style={styles.feedbackEmoji}>{getFeedbackEmoji()}</Text>
            <Text style={styles.feedbackText}>{feedbackMessage}</Text>
          </Animatable.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 },
  headerStats: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.9)', paddingVertical: 10, paddingHorizontal: 20, borderBottomWidth: 2, borderBottomColor: '#e0e0e0' },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  statValue: { fontSize: 18, color: '#333', fontWeight: 'bold' },
  speedContainer: { position: 'absolute', top: 70, left: 20, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15, borderWidth: 2, borderColor: '#4CAF50' },
  speedLabel: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  speedBar: { flexDirection: 'row' },
  speedSegment: { width: 15, height: 20, backgroundColor: '#ddd', borderRadius: 3 },
  speedSegmentActive: { backgroundColor: '#4CAF50' },
  speedWarning: { position: 'absolute', top: -30, left: -10, backgroundColor: '#ff4444', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  speedWarningText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  trafficStatus: { position: 'absolute', top: 70, right: 20, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15, borderWidth: 2, borderColor: '#ff4444', flexDirection: 'row', alignItems: 'center' },
  trafficDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  trafficText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  feedbackContainer: { position: 'absolute', top: 120, left: 20, right: 20, alignItems: 'center' },
  feedbackBox: { paddingHorizontal: 20, paddingVertical: 15, borderRadius: 20, alignItems: 'center', minWidth: 200, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
  feedbackEmoji: { fontSize: 30, marginBottom: 5 },
  feedbackText: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
});

export default GameHUD;