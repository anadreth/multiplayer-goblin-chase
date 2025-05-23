/**
 * Player System - Manages player creation, movement, and rendering
 */
import { TileType } from '../../constants/game-constants';
import { GameMap } from '../map/map-types';
import { Direction, InputState, Player } from './player-types';
import { calculateIsometricPosition } from '../map/map-renderer';

/**
 * Generates a random player name
 * @returns Random player name
 */
const generatePlayerName = (): string => {
  const prefixes = ['Brave', 'Swift', 'Mighty', 'Noble', 'Fierce'];
  const nouns = ['Warrior', 'Knight', 'Hunter', 'Explorer', 'Adventurer'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${prefix} ${noun}`;
};

/**
 * Generate a unique ID
 * @returns Unique ID string
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Find a valid starting position for the player
 * @param map Game map
 * @returns Valid starting position {gridX, gridY}
 */
const findValidStartPosition = (map: GameMap): { gridX: number; gridY: number } => {
  // Try to find a grass tile near the center of the map
  const centerX = Math.floor(map.width / 2);
  const centerY = Math.floor(map.height / 2);
  
  // Search in expanding rings from the center
  for (let ring = 0; ring < Math.max(map.width, map.height); ring++) {
    // Check each tile in the current ring
    for (let y = centerY - ring; y <= centerY + ring; y++) {
      for (let x = centerX - ring; x <= centerX + ring; x++) {
        // Skip if not on the ring's perimeter
        if (ring > 0 && y > centerY - ring && y < centerY + ring && x > centerX - ring && x < centerX + ring) {
          continue;
        }
        
        // Skip if out of bounds
        if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
          continue;
        }
        
        // If we find a walkable tile, return it
        if (map.tiles[y][x].walkable) {
          return { gridX: x, gridY: y };
        }
      }
    }
  }
  
  // Fallback to the first walkable tile we can find
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      if (map.tiles[y][x].walkable) {
        return { gridX: x, gridY: y };
      }
    }
  }
  
  // If no walkable tiles (shouldn't happen), return the top left
  return { gridX: 0, gridY: 0 };
};

/**
 * Creates a new player at a valid position on the map
 * @param map Game map to place the player on
 * @param name Optional player name (randomly generated if not provided)
 * @returns New player instance
 */
export const createPlayer = (map: GameMap, name?: string): Player => {
  // Find a valid starting position
  const { gridX, gridY } = findValidStartPosition(map);
  
  // Get the current tile type
  const currentTileType = map.tiles[gridY][gridX].type;
  
  // Create a player
  return {
    id: generateId(),
    name: name || generatePlayerName(),
    position: {
      gridX,
      gridY,
      renderX: gridX,
      renderY: gridY
    },
    movement: {
      direction: Direction.NONE,
      isMoving: false,
      targetX: null,
      targetY: null,
      lastMoveTime: 0
    },
    stats: {
      health: 100,
      maxHealth: 100,
      attackPower: 10,
      movementSpeed: 4 // Base movement speed in tiles per second
    },
    currentTileType
  };
};

/**
 * Get the movement delay based on the tile type
 * @param tileType Type of the tile
 * @param baseSpeed Base movement speed in tiles per second
 * @returns Movement delay in milliseconds
 */
const getMovementDelay = (tileType: TileType, baseSpeed: number): number => {
  // Base delay in milliseconds (time to move one tile)
  const baseDelay = 1000 / baseSpeed;
  
  // Apply tile-specific modifiers
  switch (tileType) {
    case TileType.SWAMP:
      return baseDelay * 2; // Half speed in swamp
    case TileType.GRASS:
    default:
      return baseDelay; // Normal speed on grass
  }
};

/**
 * Check if a move to the target position is valid
 * @param map Game map
 * @param gridX Current X position
 * @param gridY Current Y position
 * @param dx X direction change
 * @param dy Y direction change
 * @returns Whether the move is valid
 */
const isValidMove = (map: GameMap, gridX: number, gridY: number, dx: number, dy: number): boolean => {
  const targetX = gridX + dx;
  const targetY = gridY + dy;
  
  // Check if target is within map bounds
  if (targetX < 0 || targetY < 0 || targetX >= map.width || targetY >= map.height) {
    return false;
  }
  
  // Check if target tile is walkable
  return map.tiles[targetY][targetX].walkable;
};

/**
 * Update player movement based on input state
 * @param player Player to update
 * @param inputState Current input state
 * @param map Game map
 * @param currentTime Current timestamp
 */
export const updatePlayerMovement = (
  player: Player,
  inputState: InputState,
  map: GameMap,
  currentTime: number
): void => {
  // If player is already moving, skip input processing
  if (player.movement.isMoving) {
    return;
  }
  
  // Determine direction from input
  let dx = 0;
  let dy = 0;
  let direction = Direction.NONE;
  
  if (inputState.up) {
    dy = -1;
    direction = Direction.UP;
  } else if (inputState.down) {
    dy = 1;
    direction = Direction.DOWN;
  } else if (inputState.left) {
    dx = -1;
    direction = Direction.LEFT;
  } else if (inputState.right) {
    dx = 1;
    direction = Direction.RIGHT;
  }
  
  // Update player direction even if we can't move
  player.movement.direction = direction;
  
  // If no movement input, stop here
  if (dx === 0 && dy === 0) {
    return;
  }
  
  // Check if move is valid
  if (isValidMove(map, player.position.gridX, player.position.gridY, dx, dy)) {
    // Get the target position
    const targetX = player.position.gridX + dx;
    const targetY = player.position.gridY + dy;
    
    // Get the current and target tile types
    const currentTile = map.tiles[player.position.gridY][player.position.gridX];
    const targetTile = map.tiles[targetY][targetX];
    
    // Calculate movement delay based on current tile
    const movementDelay = getMovementDelay(currentTile.type, player.stats.movementSpeed);
    
    // Check if enough time has passed since last move
    if (currentTime - player.movement.lastMoveTime >= movementDelay) {
      // Start moving to the new position
      player.movement.isMoving = true;
      player.movement.targetX = targetX;
      player.movement.targetY = targetY;
      player.movement.lastMoveTime = currentTime;
      
      // Update current tile type for next movement
      player.currentTileType = targetTile.type;
      
      // Immediately update grid position to target
      player.position.gridX = targetX;
      player.position.gridY = targetY;
      
      // Reset moving flag since we've immediately moved to the destination
      // This allows the player to move again on the next frame
      player.movement.isMoving = false;
    }
  }
};

/**
 * Renders the player on the canvas
 * @param ctx Canvas rendering context
 * @param player Player to render
 * @param offsetX Screen X offset
 * @param offsetY Screen Y offset
 */
export const renderPlayer = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  offsetX = 0,
  offsetY = 0
): void => {
  // Get the isometric position of the player
  const { x, y } = calculateIsometricPosition(
    player.position.gridX,
    player.position.gridY,
    offsetX,
    offsetY
  );
  
  // Draw player (red square)
  const size = 20; // Size of the player square
  
  ctx.fillStyle = '#E53935'; // Red color
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  
  // Draw centered on the tile
  ctx.fillRect(x - size / 2, y - size, size, size);
  ctx.strokeRect(x - size / 2, y - size, size, size);
  
  // Draw player name above
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFF';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeText(player.name, x, y - size - 5);
  ctx.fillText(player.name, x, y - size - 5);
};

/**
 * Player System that manages all player-related functionality
 */
export class PlayerSystem {
  private player: Player;
  private inputState: InputState;
  private map: GameMap;
  private ctx: CanvasRenderingContext2D;
  
  /**
   * Create a new player system
   * @param ctx Canvas rendering context
   * @param map Game map
   * @param playerName Optional player name
   */
  constructor(ctx: CanvasRenderingContext2D, map: GameMap, playerName?: string) {
    this.ctx = ctx;
    this.map = map;
    
    // Create a player
    this.player = createPlayer(map, playerName);
    
    // Initialize input state
    this.inputState = {
      up: false,
      down: false,
      left: false,
      right: false
    };
    
    // Set up input event listeners
    this.setupInputHandlers();
  }
  
  /**
   * Set up keyboard input handlers
   */
  private setupInputHandlers(): void {
    // Keyboard event handler for key down
    const handleKeyDown = (e: KeyboardEvent): void => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.inputState.up = true;
          break;
        case 's':
        case 'arrowdown':
          this.inputState.down = true;
          break;
        case 'a':
        case 'arrowleft':
          this.inputState.left = true;
          break;
        case 'd':
        case 'arrowright':
          this.inputState.right = true;
          break;
      }
    };
    
    // Keyboard event handler for key up
    const handleKeyUp = (e: KeyboardEvent): void => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.inputState.up = false;
          break;
        case 's':
        case 'arrowdown':
          this.inputState.down = false;
          break;
        case 'a':
        case 'arrowleft':
          this.inputState.left = false;
          break;
        case 'd':
        case 'arrowright':
          this.inputState.right = false;
          break;
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  }
  
  /**
   * Update the player system
   * @param currentTime Current timestamp
   */
  public update(currentTime: number): void {
    // Update player movement based on input
    updatePlayerMovement(this.player, this.inputState, this.map, currentTime);
  }
  
  /**
   * Render the player
   */
  public render(): void {
    // Calculate map center for offset
    const canvas = this.ctx.canvas;
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 4; // Place it higher so we can see more of the map
    
    renderPlayer(this.ctx, this.player, offsetX, offsetY);
  }
  
  /**
   * Get the current player
   * @returns The player
   */
  public getPlayer(): Player {
    return this.player;
  }
  
  /**
   * Update the map reference
   * @param map New map reference
   */
  public setMap(map: GameMap): void {
    this.map = map;
    
    // Find a new valid position for the player on this map
    const { gridX, gridY } = findValidStartPosition(map);
    this.player.position.gridX = gridX;
    this.player.position.gridY = gridY;
    this.player.position.renderX = gridX;
    this.player.position.renderY = gridY;
    this.player.currentTileType = map.tiles[gridY][gridX].type;
  }
  
  /**
   * Clean up resources when destroying the player system
   */
  public cleanup(): void {
    // Remove event listeners if needed
    // (Modern browsers handle this automatically when the page unloads)
  }
}
