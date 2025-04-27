// Game states
export enum GameState {
  START,
  PLAYING,
  GAME_OVER
}

// Player states
export enum PlayerState {
  RUNNING,
  JUMPING
}

// Collision types
export enum CollisionType {
  COIN,
  OBSTACLE
}

// Game object interface
export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}