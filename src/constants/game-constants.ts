/**
 * Game Constants
 * Central location for all configurable constants used throughout the game
 */

// Animation Constants
export const ROTATION_SPEED = 0.001; // radians per millisecond

// Rendering Constants
export const LINE_HEIGHT_SCALE = 1.2; // Scale factor for line height in text rendering

// UI Constants
export const DEBUG_OVERLAY_UPDATE_INTERVAL_MS = 500; // Default interval for FPS counter updates

// Map Constants
export enum TileType {
  GRASS = 0,
  SWAMP = 1,
  WATER = 2
}

export const TILE_COLORS = {
  [TileType.GRASS]: '#4CAF50', // Green for grass
  [TileType.SWAMP]: '#2E7D32', // Dark green for swamp
  [TileType.WATER]: '#1976D2'  // Blue for water
};

export const TILE_NAMES = {
  [TileType.GRASS]: 'Grass',
  [TileType.SWAMP]: 'Swamp',
  [TileType.WATER]: 'Water'
};

// Default map settings
export const DEFAULT_MAP_WIDTH = 20;  // Number of tiles horizontally
export const DEFAULT_MAP_HEIGHT = 20; // Number of tiles vertically
export const TILE_WIDTH = 64;        // Base width of each tile in pixels
export const TILE_HEIGHT = 32;       // Base height of each tile in pixels
export const ISOMETRIC_FACTOR = 0.5; // Height to width ratio for isometric projection
