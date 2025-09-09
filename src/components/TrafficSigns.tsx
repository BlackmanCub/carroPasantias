import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
} from 'react-native-reanimated';

interface TrafficSign {
  id: string;
  type: 'traffic-light';
  position: number;
  isActive: boolean;
}

interface TrafficSignsProps {
  distance: number;
  onTrafficLightChange: (color: 'red' | 'yellow' | 'green') => void;
}

const TrafficSigns: React.FC<TrafficSignsProps> = ({ distance, onTrafficLightChange }) => {
  const [signs, setSigns] = useState<TrafficSign[]>([]);
  const [trafficLightText, setTrafficLightText] = useState('CONTINUAR');
  const currentTrafficLightColor = useSharedValue<'red' | 'yellow' | 'green'>('green');
  const trafficLightTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generar semáforos cada 150 metros
  useEffect(() => {
    const newSigns: TrafficSign[] = [];
    const signalInterval = 150;
    const currentSignalIndex = Math.floor(distance / signalInterval);
    const signalPosition = currentSignalIndex * signalInterval;

    if (distance >= signalPosition && distance < signalPosition + 10) {
      const signId = `traffic-light-${currentSignalIndex}`;

      newSigns.push({
        id: signId,
        type: 'traffic-light',
        position: signalPosition,
        isActive: true,
      });
    }

    if (newSigns.length > 0) {
      setSigns(prev => {
        const existingIds = prev.map(s => s.id);
        const uniqueNew = newSigns.filter(s => !existingIds.includes(s.id));
        const all = [...prev, ...uniqueNew];
        return all.filter(s => distance - s.position < 100);
      });
    }
  }, [distance]);

  // Ciclo del semáforo
  useEffect(() => {
    const hasTrafficLight = signs.some(s => s.type === 'traffic-light' && s.isActive);

    if (hasTrafficLight) {
      const cycle = () => {
        let next: 'red' | 'yellow' | 'green' = 'green';
        let duration = 2000;

        switch (currentTrafficLightColor.value) {
          case 'red':
            next = 'green';
            duration = 15000; // 
            break;
          case 'yellow':
            next = 'red';
            duration = 15000;  // 
            break;
          case 'green':
            next = 'yellow';
            duration = 3000; // 
            break;
        }

        currentTrafficLightColor.value = next;

        // Texto en React
        setTrafficLightText(
          next === 'red'
            ? 'FRENAR'
            : next === 'yellow'
            ? 'PRECAUCIÓN'
            : 'CONTINUAR'
        );

        onTrafficLightChange(next);

        if (trafficLightTimeout.current) clearTimeout(trafficLightTimeout.current);
        trafficLightTimeout.current = setTimeout(cycle, duration);
      };

      cycle();
    } else {
      if (trafficLightTimeout.current) clearTimeout(trafficLightTimeout.current);
    }

    return () => {
      if (trafficLightTimeout.current) clearTimeout(trafficLightTimeout.current);
    };
  }, [signs.length]);

  // Estilos animados
  const redStyle = useAnimatedStyle(() => ({
    opacity: currentTrafficLightColor.value === 'red' ? 1 : 0.3,
  }));

  const yellowStyle = useAnimatedStyle(() => ({
    opacity: currentTrafficLightColor.value === 'yellow' ? 1 : 0.3,
  }));

  const greenStyle = useAnimatedStyle(() => ({
    opacity: currentTrafficLightColor.value === 'green' ? 1 : 0.3,
  }));

  const renderTrafficLight = (sign: TrafficSign) => {
    const relativePosition = sign.position - distance;
    const isVisible = relativePosition >= -100 && relativePosition <= 100;
    if (!isVisible) return null;

    const horizontalPosition = 50 - relativePosition * 3;

    return (
      <View key={sign.id} style={[styles.signContainer, { right: horizontalPosition, bottom: 200 }]}>
        <View style={styles.trafficLightBox}>
          <Animated.View style={[styles.light, styles.redLight, redStyle]} />
          <Animated.View style={[styles.light, styles.yellowLight, yellowStyle]} />
          <Animated.View style={[styles.light, styles.greenLight, greenStyle]} />
        </View>
        <View style={styles.statusIndicator}>
          <Text style={styles.statusText}>{trafficLightText}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {signs.map(sign => renderTrafficLight(sign))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 },
  signContainer: { position: 'absolute', alignItems: 'center' },
  trafficLightBox: {
    width: 60, height: 150, backgroundColor: '#333', borderRadius: 30, padding: 6,
    justifyContent: 'space-around', alignItems: 'center', borderWidth: 2, borderColor: '#666',
  },
  light: { width: 35, height: 35, borderRadius: 17.5, borderWidth: 1, borderColor: '#000' },
  redLight: { backgroundColor: '#ff4444' },
  yellowLight: { backgroundColor: '#ffdd44' },
  greenLight: { backgroundColor: '#44ff44' },
  statusIndicator: { marginTop: 5, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
});

export default TrafficSigns;
