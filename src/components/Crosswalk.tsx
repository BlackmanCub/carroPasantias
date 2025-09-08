import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface CrosswalkProps {
  isVisible: boolean;
  position: number; // posición en X
}

const Crosswalk: React.FC<CrosswalkProps> = ({ isVisible, position }) => {
  if (!isVisible) return null;

  return (
    <Animatable.View
      animation="fadeIn"
      duration={500}
      style={[
        styles.container,
        { transform: [{ translateX: position }] }
      ]}
    >
      {/* Paso peatonal */}
      <View style={styles.crosswalk}>
        {Array.from({ length: 8 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.stripe,
              { backgroundColor: index % 2 === 0 ? '#ffffff' : '#0000ff' } // blanco y azul
            ]}
          />
        ))}
      </View>

      {/* Peatón animado */}
      <Animatable.View
        animation="bounce"
        iterationCount="infinite"
        duration={2000}
        style={styles.pedestrian}
      >
        <Animatable.Text style={styles.pedestrianEmoji}>
          🚶‍♂️
        </Animatable.Text>
      </Animatable.View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    width: 60,
    height: 100,
    alignItems: 'center',
  },
  crosswalk: {
    width: 60,
    height: 64,
    backgroundColor: '#333333',
    borderRadius: 5,
    overflow: 'hidden',
    justifyContent: 'space-between', // reparte las franjas equidistantes
    paddingVertical: 2,
  },
  stripe: {
    width: '100%',
    height: 6,
    borderRadius: 2,
  },
  pedestrian: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
  },
  pedestrianEmoji: {
    fontSize: 30,
  },
});

export default Crosswalk;
