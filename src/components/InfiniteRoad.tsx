import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
} from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';

interface RoadElement {
  id: string;
  type: 'traffic-light';
  position: number;
  isActive: boolean;
}

interface InfiniteRoadProps {
  scrollPosition: number;
  gameSpeed: number;
  onTrafficLightChange: (color: 'red' | 'yellow' | 'green') => void;
}

const InfiniteRoad: React.FC<InfiniteRoadProps> = ({ 
  scrollPosition, 
  gameSpeed, 
  onTrafficLightChange 
}) => {
  const [roadElements, setRoadElements] = useState<RoadElement[]>([]);
  const { width } = Dimensions.get('window');

  const roadAnimation = useSharedValue(0);

  // Generar solo semáforos cada 150 metros
  const generateTrafficLights = (distance: number) => {
    const elements: RoadElement[] = [];
    const spacing = 150; // distancia fija entre semáforos
    const numLights = Math.ceil((distance + width * 2) / spacing);

    for (let i = 0; i < numLights; i++) {
      const position = i * spacing;
      elements.push({
        id: `traffic-light-${i}`,
        type: 'traffic-light',
        position,
        isActive: position <= distance + width && position >= distance - width
      });
    }

    return elements;
  };

  // Actualizar elementos del camino
  useEffect(() => {
    const distance = scrollPosition;
    const newElements = generateTrafficLights(distance);
    setRoadElements(newElements);
  }, [scrollPosition]);

  // Animación del road
  useEffect(() => {
    roadAnimation.value = withTiming(-scrollPosition, { duration: 100 });
  }, [scrollPosition]);

  const roadStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: roadAnimation.value }],
  }));

  const renderTrafficLight = (element: RoadElement) => (
    <View key={element.id} style={[styles.element, { left: element.position }]}>
      <View style={styles.trafficLightBox}>
        <View style={[styles.light, styles.redLight, { opacity: 0.3 }]} />
        <View style={[styles.light, styles.yellowLight, { opacity: 0.3 }]} />
        <View style={[styles.light, styles.greenLight, { opacity: 1 }]} />
      </View>
    </View>
  );

  return (
    <Animated.View style={[styles.road, roadStyle]}>
      {roadElements.map(renderTrafficLight)}
      {/* Líneas de la carretera */}
      {Array.from({ length: 20 }, (_, index) => (
        <View
          key={index}
          style={[styles.laneMarking, { left: index * 100 }]}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  road: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: '#666666',
  },
  laneMarking: {
    position: 'absolute',
    top: 50,
    width: 4,
    height: 20,
    backgroundColor: '#ffffff',
  },
  element: {
    position: 'absolute',
    bottom: 0,
  },
  trafficLightBox: {
    width: 60,
    height: 150,
    backgroundColor: '#333',
    borderRadius: 30,
    padding: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666',
  },
  light: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  redLight: {
    backgroundColor: '#ff4444',
  },
  yellowLight: {
    backgroundColor: '#ffdd44',
  },
  greenLight: {
    backgroundColor: '#44ff44',
  },
});

export default InfiniteRoad;
