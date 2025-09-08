import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface GameButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
}

const GameButton: React.FC<GameButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false, 
  variant = 'primary',
  style 
}) => {

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.button, styles.primaryButton];
      case 'secondary':
        return [styles.button, styles.secondaryButton];
      case 'danger':
        return [styles.button, styles.dangerButton];
      default:
        return [styles.button, styles.primaryButton];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.buttonText, styles.primaryText];
      case 'secondary':
        return [styles.buttonText, styles.secondaryText];
      case 'danger':
        return [styles.buttonText, styles.dangerText];
      default:
        return [styles.buttonText, styles.primaryText];
    }
  };

  return (
    <Animatable.View
      animation={disabled ? undefined : "pulse"}
      iterationCount="infinite"
      duration={1500}
    >
      <TouchableOpacity
        style={[...getButtonStyle(), disabled && styles.disabledButton, style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        <Animatable.Text
          style={getTextStyle()}
          animation={disabled ? undefined : "bounceIn"}
          duration={300}
        >
          {title}
        </Animatable.Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  primaryButton: { backgroundColor: '#4CAF50' },
  secondaryButton: { backgroundColor: '#2196F3' },
  dangerButton: { backgroundColor: '#f44336' },
  disabledButton: { backgroundColor: '#cccccc', shadowOpacity: 0, elevation: 0 },
  buttonText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  primaryText: { color: '#ffffff' },
  secondaryText: { color: '#ffffff' },
  dangerText: { color: '#ffffff' },
});

export default GameButton;
