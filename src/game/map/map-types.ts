/**
 * Map Types - Type definitions for the map system
 */
import { TileType } from '../../constants/game-constants';

/**
 * Types for tile visual details
 */
export interface GrassDetails {
  blades: Array<{
    offsetX: number;
    offsetY: number;
    height: number;
    angleOffset: number;
  }>;
}

export interface SwampDetails {
  puddles: Array<{
    offsetX: number;
    offsetY: number;
    radius: number;
  }>;
}

export interface WaterDetails {
  waves: Array<{
    offsetY: number;
    amplitudes: number[];
  }>;
}

/**
 * Union type for all tile details
 */
export type TileDetails = GrassDetails | SwampDetails | WaterDetails;

/**
 * Represents a single tile in the game map
 */
export interface Tile {
  type: TileType;    // Type of terrain
  x: number;         // Grid X position
  y: number;         // Grid Y position
  walkable: boolean; // Whether players can walk on this tile
  movementSpeed: number; // Movement speed multiplier (1.0 = normal)
  details: TileDetails; // Visual details for rendering
}

/**
 * Represents the game map
 */
export interface GameMap {
  width: number;      // Number of tiles horizontally
  height: number;     // Number of tiles vertically
  tiles: Tile[][];    // 2D array of tiles [y][x]
  seed?: number;      // Random seed used to generate the map (optional)
  generationParams?: MapGenerationParams; // Parameters used during generation
}

/**
 * Parameters for map generation
 */
export interface MapGenerationParams {
  waterPercentage: number; // 0-1, percent of map covered in water
  swampPercentage: number; // 0-1, percent of map covered in swamp
  noiseFactor: number;     // 0-1, how noisy/random the generation is
  smoothingPasses: number; // Number of smoothing passes to apply
}

/**
 * Default parameters for map generation
 */
export const DEFAULT_GENERATION_PARAMS: MapGenerationParams = {
  waterPercentage: 0.2,   // 20% water
  swampPercentage: 0.3,    // 30% swamp
  noiseFactor: 0.6,        // Medium noise
  smoothingPasses: 2       // Apply 2 smoothing passes
};
