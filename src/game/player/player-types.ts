/**
 * Player Types - Type definitions for the player system
 */
import { TileType } from '../../constants/game-constants';

/**
 * Direction enum for player movement
 */
export enum Direction {
  NONE = 'none',
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right'
}

/**
 * Player movement state
 */
export interface PlayerMovementState {
  direction: Direction;
  isMoving: boolean;
  targetX: number | null; // Target grid X position
  targetY: number | null; // Target grid Y position
  lastMoveTime: number;   // Timestamp of last movement
}

/**
 * Player position with grid coordinates and rendered position
 */
export interface PlayerPosition {
  gridX: number;         // Grid X position
  gridY: number;         // Grid Y position
  renderX: number;       // Render X position (can be in-between tiles during movement)
  renderY: number;       // Render Y position (can be in-between tiles during movement)
}

/**
 * Player stats
 */
export interface PlayerStats {
  health: number;
  maxHealth: number;
  attackPower: number;
  movementSpeed: number;  // Base movement speed (tiles per second)
}

/**
 * Player entity
 */
export interface Player {
  id: string;            // Unique player ID
  name: string;          // Player display name
  position: PlayerPosition;
  movement: PlayerMovementState;
  stats: PlayerStats;
  currentTileType: TileType; // Type of tile the player is currently on
}

/**
 * Input state for keyboard control
 */
export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}
