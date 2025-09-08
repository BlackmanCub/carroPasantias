# 🚗 Aprendizaje Vial - Minijuego para Niños

Un minijuego educativo de educación vial diseñado específicamente para niños de 5 años en Ecuador. El juego enseña a los niños a reconocer las luces del semáforo y respetar las señales de tránsito básicas.

## 🎯 Objetivo

Que los niños aprendan a:
- Diferenciar las luces del semáforo (rojo, amarillo, verde)
- Reconocer señales básicas de tránsito
- Respetar los pasos de cebra
- Desarrollar conciencia vial desde temprana edad

## 🎮 Características del Juego

### Selección de Transporte
- **Carro** 🚗 (rojo brillante)
- **Bus** 🚌 (azul)
- **Camión** 🚚 (verde)

### Mecánicas de Juego
- **Movimiento**: Botón "Avanzar" para mover el vehículo
- **Semáforo**: Cambia automáticamente cada 3 segundos
- **Frenado**: Botón "Frenar" cuando el semáforo está en rojo
- **Paso de Cebra**: Aparece cuando hay semáforo en rojo
- **Sistema de Puntos**: Recompensa el comportamiento correcto

### Elementos Visuales
- **Fondo claro** y colorido
- **Botones grandes** (mínimo 100px) fáciles de tocar
- **Animaciones suaves** con react-native-reanimated
- **Feedback visual** inmediato
- **Paleta de colores**: rojo, verde, amarillo, azul, celeste y blanco

## 🛠️ Stack Tecnológico

- **React Native** + **Expo**
- **TypeScript** (obligatorio)
- **React Navigation** para navegación
- **React Native Reanimated** para animaciones
- **React Native Animatable** para efectos visuales
- **React Native SVG** para iconos y gráficos

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd proyecto_aprendizajeVial
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el proyecto**
   ```bash
   npm start
   ```

4. **Ejecutar en dispositivo**
   - **Android**: `npm run android`
   - **iOS**: `npm run ios`
   - **Web**: `npm run web`

## 🎯 Cómo Jugar

1. **Selecciona tu transporte** favorito (carro, bus o camión)
2. **Presiona "Avanzar"** para mover tu vehículo
3. **Observa el semáforo** que cambia de color automáticamente
4. **Cuando esté en rojo**, presiona "Frenar" para detenerte
5. **Respeta el paso de cebra** cuando aparezca
6. **Gana puntos** por tu buen comportamiento vial

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── TrafficLight.tsx      # Componente del semáforo
│   ├── Vehicle.tsx           # Componente del vehículo
│   ├── GameButton.tsx        # Botones del juego
│   └── Crosswalk.tsx         # Paso de cebra
├── screens/
│   ├── VehicleSelection.tsx  # Selección de transporte
│   └── CarMapGame.tsx        # Pantalla principal del juego
└── services/
    └── socket.ts             # Servicios (futuro)
```

## 🎨 Diseño y UX

### Colores
- **Fondo**: Celeste claro (#f0f8ff)
- **Carro**: Rojo brillante (#ff4444)
- **Bus**: Azul (#4444ff)
- **Camión**: Verde (#44ff44)
- **Semáforo**: Rojo, amarillo, verde tradicionales

### Botones
- **Tamaño mínimo**: 100px de alto
- **Bordes redondeados**: 25px
- **Sombras**: Para efecto de profundidad
- **Animaciones**: Pulse y bounce para feedback

### Animaciones
- **Movimiento del vehículo**: Suave con react-native-reanimated
- **Cambio de semáforo**: Transición de 500ms
- **Feedback**: Animaciones de bounce y pulse
- **Mensajes**: Aparición con bounceIn

## 🚀 Funcionalidades Implementadas

✅ **Selección de transporte** (carro, bus, camión)  
✅ **Semáforo animado** con cambio automático de colores  
✅ **Movimiento del vehículo** con botón "Avanzar"  
✅ **Sistema de frenado** con botón "Frenar"  
✅ **Paso de cebra** que aparece con semáforo en rojo  
✅ **Sistema de puntuación** por comportamiento correcto  
✅ **Feedback visual** y mensajes educativos  
✅ **Animaciones suaves** en todos los elementos  
✅ **Diseño responsive** para diferentes tamaños de pantalla  

## 🎓 Aspectos Educativos

- **Aprendizaje por repetición**: El juego se repite hasta que el niño se equivoque
- **Feedback inmediato**: Mensajes claros sobre el comportamiento
- **Gamificación**: Sistema de puntos para motivar
- **Elementos visuales**: Colores y formas que llaman la atención
- **Interfaz intuitiva**: Botones grandes y fáciles de usar

## 🔧 Desarrollo Futuro

- [ ] Más tipos de señales de tránsito
- [ ] Diferentes niveles de dificultad
- [ ] Múltiples mapas
- [ ] Sonidos y música
- [ ] Modo multijugador
- [ ] Estadísticas de progreso

## 📱 Compatibilidad

- **Android**: 5.0+ (API 21+)
- **iOS**: 11.0+
- **Expo**: 49.0.0+

## 👨‍💻 Desarrollado para

Niños de 5 años en Ecuador, con enfoque en:
- Educación vial temprana
- Desarrollo de habilidades motoras
- Aprendizaje lúdico
- Conciencia ciudadana

---

¡Disfruta aprendiendo sobre educación vial! 🚗🚦✨
