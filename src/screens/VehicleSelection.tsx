import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

type VehicleType = 'car' | 'bus' | 'truck';

const VehicleSelection: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');

  const vehicles = [
    { type: 'car' as VehicleType, emoji: '🚗', name: 'Carro', color: '#ff4444' },
    { type: 'bus' as VehicleType, emoji: '🚌', name: 'Bus', color: '#4444ff' },
    { type: 'truck' as VehicleType, emoji: '🚚', name: 'Camión', color: '#44ff44' },
  ];

  const handleVehicleSelect = (vehicleType: VehicleType) => {
    setSelectedVehicle(vehicleType);
  };

  const handleStartGame = () => {
    if (selectedVehicle) {
      // @ts-ignore - Navigation type will be defined later
      navigation.navigate('CarMapGame', { vehicleType: selectedVehicle });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View 
        animation="fadeInDown" 
        duration={1000}
        style={styles.header}
      >
        <Text style={styles.title}>¡Elige tu transporte!</Text>
        <Text style={styles.subtitle}>
          Selecciona el vehículo que quieres conducir
        </Text>
      </Animatable.View>

      <View style={styles.vehiclesContainer}>
        {vehicles.map((vehicle, index) => (
          <Animatable.View
            key={vehicle.type}
            animation="fadeInUp"
            duration={1000}
            delay={index * 200}
            style={styles.vehicleCard}
          >
            <TouchableOpacity
              style={[
                styles.vehicleButton,
                selectedVehicle === vehicle.type && styles.selectedVehicle,
                { borderColor: vehicle.color }
              ]}
              onPress={() => handleVehicleSelect(vehicle.type)}
              activeOpacity={0.8}
            >
              <Animatable.Text
                style={[styles.vehicleEmoji, { color: vehicle.color }]}
                animation={selectedVehicle === vehicle.type ? "bounce" : undefined}
                iterationCount="infinite"
                duration={1000}
              >
                {vehicle.emoji}
              </Animatable.Text>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>

      {selectedVehicle && (
        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={styles.startButtonContainer}
        >
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartGame}
            activeOpacity={0.8}
          >
            <Animatable.Text
              style={styles.startButtonText}
              animation="pulse"
              iterationCount="infinite"
              duration={1500}
            >
              ¡Comenzar Juego! 🎮
            </Animatable.Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Fondo claro celeste
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  vehiclesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleCard: {
    marginVertical: 15,
  },
  vehicleButton: {
    width: 200,
    height: 150,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  selectedVehicle: {
    borderWidth: 6,
    shadowOpacity: 0.5,
    elevation: 12,
  },
  vehicleEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  startButtonContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 250,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default VehicleSelection;