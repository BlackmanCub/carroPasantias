import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withSpring } from 'react-native-reanimated';

interface FeedbackMessageProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  duration?: number;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ 
  message, 
  type, 
  isVisible, 
  duration = 3000 
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isVisible) {
      setShowMessage(true);

      scale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
      opacity.value = withTiming(1, { duration: 300 });

      timeoutRef.current = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        scale.value = withTiming(0, { duration: 300 });
        setTimeout(() => setShowMessage(false), 300);
      }, duration);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const stylesMap = {
    success: { container: styles.successContainer, text: styles.successText, emoji: '🎉' },
    error: { container: styles.errorContainer, text: styles.errorText, emoji: '⚠️' },
    warning: { container: styles.warningContainer, text: styles.warningText, emoji: '🚨' },
    info: { container: styles.infoContainer, text: styles.infoText, emoji: 'ℹ️' },
  };

  const currentStyle = stylesMap[type] || stylesMap.info;

  if (!showMessage) return null;

  return (
    <Animated.View style={[styles.overlay, animatedStyle]}>
      <Animatable.View animation="bounceIn" duration={500} style={[styles.messageContainer, currentStyle.container]}>
        <Text style={styles.emoji}>{currentStyle.emoji}</Text>
        <Text style={[styles.messageText, currentStyle.text]}>{message}</Text>
      </Animatable.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  messageContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 250,
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  successContainer: { backgroundColor: '#4CAF50' },
  errorContainer: { backgroundColor: '#f44336' },
  warningContainer: { backgroundColor: '#ff9800' },
  infoContainer: { backgroundColor: '#2196F3' },
  emoji: { fontSize: 40, marginBottom: 10 },
  messageText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', lineHeight: 24 },
  successText: { color: '#ffffff' },
  errorText: { color: '#ffffff' },
  warningText: { color: '#ffffff' },
  infoText: { color: '#ffffff' },
});

export default FeedbackMessage;
