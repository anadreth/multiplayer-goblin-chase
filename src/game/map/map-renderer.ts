/**
 * Map Renderer - Renders the game map with isometric projection
 */
import { TileType, TILE_COLORS, TILE_WIDTH, TILE_HEIGHT } from '../../constants/game-constants';
import { GameMap, Tile, GrassDetails, SwampDetails, WaterDetails } from './map-types';

/**
 * Calculates the screen position for an isometric tile
 * @param x - Grid X position
 * @param y - Grid Y position
 * @param offsetX - Screen X offset
 * @param offsetY - Screen Y offset
 * @returns Screen coordinates {x, y}
 */
export const calculateIsometricPosition = (
  x: number, 
  y: number, 
  offsetX = 0, 
  offsetY = 0
): { x: number; y: number } => {
  // Isometric projection formula
  const screenX = (x - y) * (TILE_WIDTH / 2) + offsetX;
  const screenY = (x + y) * (TILE_HEIGHT / 2) + offsetY;
  
  return { x: screenX, y: screenY };
};

/**
 * Draws a single isometric tile
 * @param ctx - Canvas rendering context
 * @param tile - The tile to draw
 * @param offsetX - Screen X offset
 * @param offsetY - Screen Y offset
 */
const drawIsometricTile = (
  ctx: CanvasRenderingContext2D, 
  tile: Tile, 
  offsetX = 0, 
  offsetY = 0
): void => {
  const { x, y } = calculateIsometricPosition(tile.x, tile.y, offsetX, offsetY);
  
  // Set the fill color based on tile type
  ctx.fillStyle = TILE_COLORS[tile.type];
  
  // Draw isometric diamond shape
  ctx.beginPath();
  ctx.moveTo(x, y - TILE_HEIGHT / 2);               // Top point
  ctx.lineTo(x + TILE_WIDTH / 2, y);                // Right point
  ctx.lineTo(x, y + TILE_HEIGHT / 2);               // Bottom point
  ctx.lineTo(x - TILE_WIDTH / 2, y);                // Left point
  ctx.closePath();
  ctx.fill();
  
  // Draw outline
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  
  // Add visual details based on tile type
  switch (tile.type) {
    case TileType.GRASS:
      drawGrassDetails(ctx, x, y, tile.details as GrassDetails);
      break;
    case TileType.SWAMP:
      drawSwampDetails(ctx, x, y, tile.details as SwampDetails);
      break;
    case TileType.WATER:
      drawWaterDetails(ctx, x, y, tile.details as WaterDetails);
      break;
  }
};

/**
 * Draws grass details on a tile using pre-generated detail information
 * @param ctx - Canvas rendering context
 * @param x - Screen X center position
 * @param y - Screen Y center position
 * @param details - Pre-generated grass details
 */
const drawGrassDetails = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  details: GrassDetails
): void => {
  // Draw grass blades based on pre-generated details
  ctx.strokeStyle = '#8BC34A';  // Lighter green
  ctx.lineWidth = 1;
  
  // Draw each pre-generated grass blade
  for (const blade of details.blades) {
    ctx.beginPath();
    ctx.moveTo(x + blade.offsetX, y + blade.offsetY);
    ctx.lineTo(
      x + blade.offsetX + blade.angleOffset, 
      y + blade.offsetY - blade.height
    );
    ctx.stroke();
  }
};

/**
 * Draws swamp details on a tile using pre-generated detail information
 * @param ctx - Canvas rendering context
 * @param x - Screen X center position
 * @param y - Screen Y center position
 * @param details - Pre-generated swamp details
 */
const drawSwampDetails = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  details: SwampDetails
): void => {
  // Draw swamp puddles
  ctx.fillStyle = 'rgba(76, 121, 74, 0.6)'; // Semi-transparent muddy color
  
  // Draw each pre-generated puddle
  for (const puddle of details.puddles) {
    ctx.beginPath();
    ctx.ellipse(
      x + puddle.offsetX, 
      y + puddle.offsetY, 
      puddle.radius, 
      puddle.radius * 0.7, 
      0, 0, Math.PI * 2
    );
    ctx.fill();
  }
};

/**
 * Draws water details on a tile using pre-generated detail information
 * @param ctx - Canvas rendering context
 * @param x - Screen X center position
 * @param y - Screen Y center position
 * @param details - Pre-generated water details
 */
const drawWaterDetails = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  details: WaterDetails
): void => {
  // Draw water wave lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  
  // Draw each pre-generated wave line
  for (const wave of details.waves) {
    ctx.beginPath();
    ctx.moveTo(x - TILE_WIDTH * 0.3, y + wave.offsetY);
    
    // Create wavy line based on stored amplitudes
    for (let j = 0; j < wave.amplitudes.length; j++) {
      const waveX = x - TILE_WIDTH * 0.3 + j * (TILE_WIDTH * 0.3);
      const waveY = y + wave.offsetY + wave.amplitudes[j];
      ctx.lineTo(waveX, waveY);
    }
    
    ctx.stroke();
  }
};

/**
 * Renders the game map on the canvas
 * @param ctx - Canvas rendering context
 * @param map - The game map to render
 * @param centerX - X center point for the map (optional)
 * @param centerY - Y center point for the map (optional)
 */
export const renderMap = (
  ctx: CanvasRenderingContext2D, 
  map: GameMap,
  centerX?: number,
  centerY?: number
): void => {
  const canvas = ctx.canvas;
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Map dimensions calculation not needed for now
  
  // Calculate offsets to center the map
  const offsetX = centerX ?? canvas.width / 2;
  const offsetY = centerY ?? canvas.height / 4; // Place it higher so we can see more of the map
  
  // Render in reverse order (back to front) for isometric view
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      drawIsometricTile(ctx, map.tiles[y][x], offsetX, offsetY);
    }
  }
};
