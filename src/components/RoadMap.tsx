import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

interface RoadMapProps {
  speed: number;
  isMoving: boolean;
}

const { width } = Dimensions.get('window');

const RoadMap: React.FC<RoadMapProps> = ({ speed, isMoving }) => {
  const roadScroll = useSharedValue(0);
  const laneScroll = useSharedValue(0);

  useEffect(() => {
    if (isMoving) {
      // Road scrolling animation
      roadScroll.value = withRepeat(
        withTiming(-width, { duration: 2000 / speed }),
        -1,
        false
      );

      // Lane markings animation
      laneScroll.value = withRepeat(
        withTiming(-width / 4, { duration: 1000 / speed }),
        -1,
        false
      );
    } else {
      // Stop animations smoothly
      roadScroll.value = withTiming(0, { duration: 300 });
      laneScroll.value = withTiming(0, { duration: 300 });
    }
  }, [isMoving, speed]);

  const roadStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: roadScroll.value }],
  }));

  const laneStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: laneScroll.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Road segments */}
      <Animated.View style={[styles.roadWrapper, roadStyle]}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <View key={idx} style={[styles.roadSegment, { left: idx * width }]}>
            <View style={styles.roadSurface} />
            <Animated.View style={[styles.laneContainer, laneStyle]}>
              {Array.from({ length: 8 }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.laneMarking, { left: i * (width / 8) }]}
                />
              ))}
            </Animated.View>
          </View>
        ))}
      </Animated.View>

      {/* Road edges */}
      <View style={styles.roadEdgeTop} />
      <View style={styles.roadEdgeBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  roadWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    top: 0,
    bottom: 0,
    left: 0,
  },
  roadSegment: {
    position: 'absolute',
    width: width,
    top: 0,
    bottom: 0,
  },
  roadSurface: {
    flex: 1,
    backgroundColor: '#4a4a4a',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#333',
  },
  laneContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 4,
    flexDirection: 'row',
  },
  laneMarking: {
    position: 'absolute',
    width: 40,
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    top: 0,
  },
  roadEdgeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#ffffff',
  },
  roadEdgeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#ffffff',
  },
  roadSurfaceSegment: {},
});

export default RoadMap;
