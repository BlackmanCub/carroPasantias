import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Vehicle from '../components/Vehicle';
import GameButton from '../components/GameButton';
import RoadMap from '../components/RoadMap';
import TrafficSigns from '../components/TrafficSigns';
import * as Animatable from 'react-native-animatable';

type VehicleType = 'car' | 'bus' | 'truck';
type TrafficColor = 'red' | 'yellow' | 'green';

interface RouteParams {
  vehicleType: VehicleType;
}

const CarMapGame: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { vehicleType } = route.params as RouteParams;
  
  // Estados del vehículo
  const [isMoving, setIsMoving] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [vehicleSpeed, setVehicleSpeed] = useState(1);
  const [isAccelerating, setIsAccelerating] = useState(false);
  
  // Estados del juego
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  
  // Estados del semáforo y señales
  const [currentTrafficColor, setCurrentTrafficColor] = useState<TrafficColor>('green');
  const [currentSign, setCurrentSign] = useState<string>('');
  
  // Estados de feedback
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('rgba(76, 175, 80, 0.9)');
  const [showFeedback, setShowFeedback] = useState(false);
  
  const { width } = Dimensions.get('window');
  const gameLoopRef = useRef<number | null>(null);

  // Loop principal del juego
  useEffect(() => {
    if (gameStarted && isMoving && !isStopped) {
      gameLoopRef.current = setInterval(() => {
        setDistance(prev => prev + vehicleSpeed);
      }, 50); // ~20 FPS
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, isMoving, isStopped, vehicleSpeed]);

  // Detectar semáforos cercanos (cada 150 metros)
  useEffect(() => {
    const signalInterval = 150;
    const currentSignalIndex = Math.floor(distance / signalInterval);
    const signalPosition = currentSignalIndex * signalInterval;
    
    // Más tolerancia en la detección (±25px)
    if (Math.abs(distance - signalPosition) < 25) {
      setCurrentSign('traffic-light');
    } else {
      setCurrentSign('');
    }
  }, [distance]);

  // Mostrar feedback
  const showFeedbackMessage = (message: string, color: string = 'rgba(76, 175, 80, 0.9)') => {
    setFeedbackMessage(message);
    setFeedbackColor(color);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  // Manejar cambio de semáforo
  const handleTrafficLightChange = (color: TrafficColor) => {
    setCurrentTrafficColor(color);
  };

  // Función para acelerar
  const handleAccelerate = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setIsMoving(true);
      showFeedbackMessage('¡Comienza tu viaje! 🚗', 'rgba(33, 150, 243, 0.9)');
      return;
    }

    if (isStopped) {
      showFeedbackMessage('¡Primero debes frenar!', 'rgba(255, 193, 7, 0.9)');
      return;
    }

    // Verificar violaciones cuando está cerca de un semáforo
    if (currentSign === 'traffic-light' && currentTrafficColor === 'red') {
      handleError('¡Ups! No puedes acelerar en rojo 🚦');
      return;
    }

    // Acelerar
    setIsAccelerating(true);
    setVehicleSpeed(prev => Math.min(prev + 0.5, 3));
    setIsMoving(true);
    
    setTimeout(() => {
      setIsAccelerating(false);
    }, 500);
  };

  // Función para frenar
  const handleBrake = () => {
    if (currentSign === 'traffic-light' && currentTrafficColor === 'red') {
      // Frenó correctamente en rojo
      setIsStopped(true);
      setIsMoving(false);
      setScore(prev => prev + 10);
      showFeedbackMessage('¡Muy bien! Te detuviste en rojo 🛑', 'rgba(76, 175, 80, 0.9)');
      
      setTimeout(() => {
        setIsStopped(false);
      }, 2000);
    } else {
      // Frenó cuando no debía
      showFeedbackMessage('No necesitas frenar ahora', 'rgba(255, 193, 7, 0.9)');
    }
  };

  // Manejar errores
  const handleError = (message: string) => {
    showFeedbackMessage(message, 'rgba(244, 67, 54, 0.9)');
    setIsMoving(false);
    setIsStopped(false);
    setVehicleSpeed(1);
    setDistance(0);
    setScore(prev => Math.max(0, prev - 10));
    setGameStarted(false); // reiniciar juego
  };

  const handleGoBack = () => {
    // @ts-ignore
    navigation.goBack();
  };

  const getVehicleName = () => {
    switch (vehicleType) {
      case 'car':
        return 'Carro';
      case 'bus':
        return 'Bus';
      case 'truck':
        return 'Camión';
      default:
        return 'Vehículo';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Animatable.Text 
          animation="fadeInDown" 
          style={styles.title}
        >
          {getVehicleName()} 🚗
        </Animatable.Text>
        <View style={styles.statsContainer}>
          <Text style={styles.score}>Puntos: {score}</Text>
          <Text style={styles.distance}>Distancia: {Math.floor(distance)}m</Text>
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {/* Road Map */}
        <RoadMap
          speed={vehicleSpeed}
          isMoving={isMoving}
        />

        {/* Vehicle */}
        <Vehicle
          type={vehicleType}
          isMoving={isMoving}
          isStopped={isStopped}
          speed={vehicleSpeed}
          isAccelerating={isAccelerating}
          mirrored={true} // voltear el carro para que mire hacia el otro lado
        />

        {/* Traffic Signs */}
        <TrafficSigns
          distance={distance}
          onTrafficLightChange={handleTrafficLightChange}
        />

        {/* Feedback Message */}
        {showFeedback && (
          <Animatable.View
            animation="bounceIn"
            style={[styles.feedbackContainer, { backgroundColor: feedbackColor }]}
          >
            <Text style={styles.feedbackText}>{feedbackMessage}</Text>
          </Animatable.View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <GameButton
          title="🚀 Acelerar"
          onPress={handleAccelerate}
          variant="primary"
          style={styles.accelerateButton}
        />
        
        <GameButton
          title="🛑 Frenar"
          onPress={handleBrake}
          variant="danger"
          style={styles.brakeButton}
        />
      </View>

      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <GameButton
          title="Volver ↩️"
          onPress={handleGoBack}
          variant="secondary"
          style={styles.backButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Fondo claro celeste
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  distance: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff9800',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  feedbackContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
  },
  accelerateButton: {
    flex: 1,
    marginRight: 10,
    minHeight: 100,
  },
  brakeButton: {
    flex: 1,
    marginLeft: 10,
    minHeight: 100,
  },
  backButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  backButton: {
    alignSelf: 'center',
    minWidth: 150,
    minHeight: 60,
  },
});

export default CarMapGame;