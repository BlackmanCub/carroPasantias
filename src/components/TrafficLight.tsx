import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';

interface TrafficLightProps {
  onColorChange: (color: 'red' | 'yellow' | 'green') => void;
  isActive: boolean;
  distance: number;
}

const TrafficLight: React.FC<TrafficLightProps> = ({ onColorChange, isActive, distance }) => {
  const [currentColor, setCurrentColor] = useState<'red' | 'yellow' | 'green'>('green');
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mostrar semáforo en un rango de distancia
  const shouldShowTrafficLight = distance > 300 && distance < 400;

  useEffect(() => {
    if (shouldShowTrafficLight && isActive) {
      setIsVisible(true);

      const cycleTrafficLight = (color: 'red' | 'yellow' | 'green') => {
        let nextColor: 'red' | 'yellow' | 'green';
        let duration: number;

        switch (color) {
          case 'red':
            nextColor = 'yellow';
            duration = 1000; // Amarillo 1 segundo
            break;
          case 'yellow':
            nextColor = 'green';
            duration = 3000; // Verde 3 segundos
            break;
          default:
            nextColor = 'red';
            duration = 2000; // Rojo 2 segundos
            break;
        }

        setCurrentColor(nextColor);
        timeoutRef.current = setTimeout(() => cycleTrafficLight(nextColor), duration);
      };

      // Arrancar ciclo
      cycleTrafficLight(currentColor);
    } else {
      setIsVisible(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [shouldShowTrafficLight, isActive]);

  // Avisar al padre cuando cambie el color
  useEffect(() => {
    if (isVisible) onColorChange(currentColor);
  }, [currentColor, isVisible, onColorChange]);

  // Animaciones para luces
  const redStyle = useAnimatedStyle(() => ({
    opacity: withTiming(currentColor === 'red' ? 1 : 0.3, { duration: 300 }),
  }));

  const yellowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(currentColor === 'yellow' ? 1 : 0.3, { duration: 300 }),
  }));

  const greenStyle = useAnimatedStyle(() => ({
    opacity: withTiming(currentColor === 'green' ? 1 : 0.3, { duration: 300 }),
  }));

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Semáforo */}
      <View style={styles.trafficLightBox}>
        <Animated.View style={[styles.light, styles.redLight, redStyle]} />
        <Animated.View style={[styles.light, styles.yellowLight, yellowStyle]} />
        <Animated.View style={[styles.light, styles.greenLight, greenStyle]} />
      </View>

      {/* Paso de cebra */}
      <View style={styles.crosswalk}>
        {Array.from({ length: 6 }, (_, index) => (
          <View
            key={index}
            style={[
              styles.stripe,
              { 
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#000000',
                top: index * 10,
              },
            ]}
          />
        ))}
      </View>

      {/* Indicador de estado */}
      <View style={styles.statusIndicator}>
        <Text style={styles.statusText}>
          {currentColor === 'red'
            ? 'FRENAR'
            : currentColor === 'yellow'
            ? 'PRECAUCIÓN'
            : 'CONTINUAR'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 50,
    bottom: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trafficLightBox: {
    width: 70,
    height: 180,
    backgroundColor: '#333',
    borderRadius: 35,
    padding: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#666',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  light: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  redLight: { backgroundColor: '#ff4444', shadowColor: '#ff4444' },
  yellowLight: { backgroundColor: '#ffdd44', shadowColor: '#ffdd44' },
  greenLight: { backgroundColor: '#44ff44', shadowColor: '#44ff44' },
  crosswalk: {
    position: 'absolute',
    bottom: -80,
    left: -25,
    width: 50,
    height: 60,
    backgroundColor: '#333333',
    borderRadius: 5,
    overflow: 'hidden',
  },
  stripe: {
    position: 'absolute',
    width: '100%',
    height: 10,
  },
  statusIndicator: {
    position: 'absolute',
    top: -40,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TrafficLight;