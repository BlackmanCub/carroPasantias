import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import VehicleSelection from './src/screens/VehicleSelection';
import CarMapGame from './src/screens/CarMapGame';

export type RootStackParamList = {
  VehicleSelection: undefined;
  CarMapGame: { vehicleType: 'car' | 'bus' | 'truck' };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="VehicleSelection"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen 
          name="VehicleSelection" 
          component={VehicleSelection}
          options={{
            title: 'Selección de Vehículo',
          }}
        />
        <Stack.Screen 
          name="CarMapGame" 
          component={CarMapGame}
          options={{
            title: 'Juego de Educación Vial',
            gestureEnabled: false, // Prevent going back during game
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
