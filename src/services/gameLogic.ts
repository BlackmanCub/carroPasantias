export interface GameState {
  isMoving: boolean;
  isStopped: boolean;
  speed: number;
  distance: number;
  level: number;
  score: number;
  currentTrafficLight: 'red' | 'yellow' | 'green';
  trafficLightPosition: number;
  crosswalkPosition: number;
  pedestriansCrossing: boolean;
  gameStarted: boolean;
}

export interface GameConfig {
  baseSpeed: number;
  maxSpeed: number;
  acceleration: number;
  deceleration: number;
  levelUpDistance: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  baseSpeed: 1,
  maxSpeed: 5,
  acceleration: 0.5,
  deceleration: 1,
  levelUpDistance: 1000,
};

export class GameLogic {
  private state: GameState;
  private config: GameConfig;
  private trafficLightTimer: number | null = null;
  private gameLoopTimer: number | null = null;
  private crosswalkTimer: number | null = null;

  constructor(config: GameConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.state = {
      isMoving: false,
      isStopped: false,
      speed: config.baseSpeed,
      distance: 0,
      level: 1,
      score: 0,
      currentTrafficLight: 'red', // empieza en rojo
      trafficLightPosition: 0,
      crosswalkPosition: 0,
      pedestriansCrossing: false,
      gameStarted: false,
    };
  }

  // --- Getters ---
  getState(): GameState {
    return { ...this.state };
  }

  // --- Game control ---
  startGame(): void {
    this.state.gameStarted = true;
    this.state.isMoving = true;
    this.startGameLoop();
    this.startTrafficLightCycle();
  }

  stopGame(): void {
    this.state.gameStarted = false;
    this.state.isMoving = false;
    this.stopGameLoop();
    this.stopTrafficLightCycle();
    if (this.crosswalkTimer) clearTimeout(this.crosswalkTimer);
  }

  resetGame(): void {
    this.stopGame();
    this.state = {
      isMoving: false,
      isStopped: false,
      speed: this.config.baseSpeed,
      distance: 0,
      level: 1,
      score: 0,
      currentTrafficLight: 'red', // reinicia en rojo
      trafficLightPosition: 0,
      crosswalkPosition: 0,
      pedestriansCrossing: false,
      gameStarted: false,
    };
  }

  // --- Vehicle control ---
  accelerate(): void {
    if (!this.state.gameStarted) {
      this.startGame();
      return;
    }
    if (this.state.isStopped) return;
    this.state.speed = Math.min(this.state.speed + this.config.acceleration, this.config.maxSpeed);
    this.state.isMoving = true;
  }

  brake(): void {
    this.state.isStopped = true;
    this.state.isMoving = false;
    this.state.speed = this.config.baseSpeed;
  }

  releaseBrake(): void {
    this.state.isStopped = false;
    this.state.isMoving = true;
  }

  // --- Traffic light cycle ---
  private startTrafficLightCycle(): void {
    const cycle = (color: 'red' | 'yellow' | 'green') => {
      this.state.currentTrafficLight = color;
      if (color === 'red') this.startCrosswalk();

      let nextColor: 'red' | 'yellow' | 'green';
      let duration: number;

      switch (color) {
        case 'red':
          nextColor = 'green';
          duration = 3000;
          break;
        case 'yellow':
          nextColor = 'red';
          duration = 1000;
          break;
        case 'green':
          nextColor = 'yellow';
          duration = 2000;
          break;
      }

      this.trafficLightTimer = setTimeout(() => cycle(nextColor), duration) as unknown as number;
    };

    cycle('red'); // empieza en rojo
  }

  private stopTrafficLightCycle(): void {
    if (this.trafficLightTimer) {
      clearTimeout(this.trafficLightTimer);
      this.trafficLightTimer = null;
    }
  }

  private startCrosswalk(): void {
    this.state.pedestriansCrossing = true;
    this.crosswalkTimer = setTimeout(() => {
      this.state.pedestriansCrossing = false;
    }, 3000) as unknown as number;
  }

  // --- Game loop ---
  private startGameLoop(): void {
    this.gameLoopTimer = setInterval(() => this.updateGame(), 16) as unknown as number;
  }

  private stopGameLoop(): void {
    if (this.gameLoopTimer) {
      clearInterval(this.gameLoopTimer);
      this.gameLoopTimer = null;
    }
  }

  private updateGame(): void {
    if (this.state.isMoving && !this.state.isStopped) {
      this.state.distance += this.state.speed;

      // Semáforos cada 150 unidades
      if (this.state.distance % 150 < this.state.speed) {
        this.setTrafficLightPosition(this.state.distance + 100);
      }

      // Level progression
      const newLevel = Math.floor(this.state.distance / this.config.levelUpDistance) + 1;
      if (newLevel > this.state.level) {
        this.state.level = newLevel;
        // Restart traffic light cycle with increased difficulty
        this.stopTrafficLightCycle();
        this.startTrafficLightCycle();
      }
    }
  }

  // --- Collisions ---
  checkTrafficLightViolation(): boolean {
    const distanceToTrafficLight = Math.abs(this.state.distance - this.state.trafficLightPosition);
    return distanceToTrafficLight < 50 && this.state.currentTrafficLight === 'red' && !this.state.isStopped;
  }

  checkCrosswalkViolation(): boolean {
    const distanceToCrosswalk = Math.abs(this.state.distance - this.state.crosswalkPosition);
    return distanceToCrosswalk < 50 && this.state.pedestriansCrossing && !this.state.isStopped;
  }

  // --- Score ---
  addScore(points: number): void {
    this.state.score += points;
  }

  subtractScore(points: number): void {
    this.state.score = Math.max(0, this.state.score - points);
  }

  // --- Positioning ---
  setTrafficLightPosition(position: number): void {
    this.state.trafficLightPosition = position;
    this.state.crosswalkPosition = position - 30;
  }

  // --- Cleanup ---
  destroy(): void {
    this.stopGame();
  }
}
