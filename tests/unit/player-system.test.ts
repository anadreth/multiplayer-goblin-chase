/**
 * Player System Unit Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Direction } from '../../src/game/player/player-types';
import { createPlayer, updatePlayerMovement } from '../../src/game/player/player-system';
import { TileType } from '../../src/constants/game-constants';

// Mock dependencies
vi.mock('../../src/utils/id/uuid', () => ({
  generateUUID: () => 'test-uuid-123'
}));

// Mock generic details for all tile types to avoid type errors
type GenericTileDetails = Record<string, unknown>;
const mockGrassDetails: GenericTileDetails = { blades: [], grass: true };
const mockSwampDetails: GenericTileDetails = { puddles: [], swamp: true };
const mockWaterDetails: GenericTileDetails = { waves: [], water: true };

// Create a properly structured tile with required properties
const createMockTile = (x: number, y: number, type: TileType): any => {
  let walkable = true;
  let movementSpeed = 1.0;
  let details = mockGrassDetails;
  
  switch (type) {
    case TileType.GRASS:
      walkable = true;
      movementSpeed = 1.0;
      details = mockGrassDetails;
      break;
    case TileType.SWAMP:
      walkable = true;
      movementSpeed = 0.5;
      details = mockSwampDetails;
      break;
    case TileType.WATER:
      walkable = false;
      movementSpeed = 0;
      details = mockWaterDetails;
      break;
  }
  
  return { type, x, y, walkable, movementSpeed, details };
};

// Create mock map with proper tiles
const createMockMap = () => {
  // Define the map layout
  // 0 = grass (walkable), 1 = swamp (walkable, slow), 2 = water (unwalkable)
  const layout = [
    [TileType.GRASS, TileType.GRASS, TileType.WATER, TileType.GRASS, TileType.GRASS],
    [TileType.GRASS, TileType.SWAMP, TileType.SWAMP, TileType.SWAMP, TileType.GRASS],
    [TileType.WATER, TileType.SWAMP, TileType.GRASS, TileType.SWAMP, TileType.WATER],
    [TileType.GRASS, TileType.SWAMP, TileType.SWAMP, TileType.SWAMP, TileType.GRASS],
    [TileType.GRASS, TileType.GRASS, TileType.WATER, TileType.GRASS, TileType.GRASS]
  ];
  
  // Create tiles with proper x, y coordinates and details
  const tiles = layout.map((row, y) => 
    row.map((tileType, x) => createMockTile(x, y, tileType))
  );
  
  return {
    width: 5,
    height: 5,
    tiles
  };
};

// Mock the global setTimeout
const originalSetTimeout = global.setTimeout;
// Create a proper mock that includes the __promisify__ property
const mockedSetTimeout = vi.fn((callback, _delay) => {
  // Immediately invoke the callback instead of waiting
  callback();
  return 123; // mock timer id
}) as unknown as typeof setTimeout;

// Add required __promisify__ property
(mockedSetTimeout as any).__promisify__ = vi.fn();

beforeEach(() => {
  global.setTimeout = mockedSetTimeout;
});

afterEach(() => {
  // Restore the original setTimeout after tests
  global.setTimeout = originalSetTimeout;
  vi.restoreAllMocks();
});

describe('Player Creation', () => {
  it('should create a player with default name if none provided', () => {
    const mockMap = createMockMap();
    const player = createPlayer(mockMap);
    
    expect(player.id).toBe('test-uuid-123');
    expect(player.name).toBeDefined();
    expect(player.position).toBeDefined();
    expect(player.movement.direction).toBe(Direction.NONE);
    expect(player.stats.health).toBe(100);
  });
  
  it('should create a player with provided name', () => {
    const mockMap = createMockMap();
    const playerName = 'TestPlayer';
    const player = createPlayer(mockMap, playerName);
    
    expect(player.name).toBe(playerName);
  });
  
  it('should place the player on a walkable tile', () => {
    const mockMap = createMockMap();
    const player = createPlayer(mockMap);
    
    // The player should be placed on the center tile (2,2) which is grass and walkable
    expect(player.position.gridX).toBe(2);
    expect(player.position.gridY).toBe(2);
    expect(mockMap.tiles[player.position.gridY][player.position.gridX].walkable).toBe(true);
  });
});

describe('Player Movement', () => {
  it('should not move when no keys are pressed', () => {
    const mockMap = createMockMap();
    const player = createPlayer(mockMap);
    player.position.gridX = 2;
    player.position.gridY = 2;
    
    // No keys pressed
    const inputState = { up: false, down: false, left: false, right: false };
    
    updatePlayerMovement(player, inputState, mockMap, 100);
    
    // Position should not change
    expect(player.position.gridX).toBe(2);
    expect(player.position.gridY).toBe(2);
  });
  
  it('should move in the direction of pressed key', () => {
    const mockMap = createMockMap();
    const player = createPlayer(mockMap);
    player.position.gridX = 2;
    player.position.gridY = 2;
    player.movement.lastMoveTime = 0; // Ensure the player is ready to move
    player.currentTileType = TileType.GRASS; // Set current tile type to grass for normal movement speed
    
    // Press up key
    const inputState = { up: true, down: false, left: false, right: false };
    
    // Use a large enough time delta to ensure movement happens
    updatePlayerMovement(player, inputState, mockMap, 300);
    
    // Player should move up
    expect(player.position.gridX).toBe(2);
    expect(player.position.gridY).toBe(1);
    expect(player.movement.direction).toBe(Direction.UP);
  });
  
  it('should not move onto unwalkable tiles (water)', () => {
    const mockMap = createMockMap();
    const player = createPlayer(mockMap);
    player.position.gridX = 2;
    player.position.gridY = 1;
    
    // Press up key to try to move into water
    const inputState = { up: true, down: false, left: false, right: false };
    
    updatePlayerMovement(player, inputState, mockMap, 100);
    
    // Position should not change because there's water at (2,0)
    expect(player.position.gridX).toBe(2);
    expect(player.position.gridY).toBe(1);
  });
  
  it('should move slower on swamp tiles', () => {
    const mockMap = createMockMap();
    const player = createPlayer(mockMap);
    player.position.gridX = 2;
    player.position.gridY = 2;
    player.currentTileType = TileType.SWAMP;
    player.movement.lastMoveTime = 0;
    
    // Swamp requires more time to pass (delay = 500ms with movement speed 2)
    const inputState = { up: false, down: true, left: false, right: false };
    
    // Try to move with only 100ms elapsed (not enough on swamp)
    updatePlayerMovement(player, inputState, mockMap, 100);
    
    // Position should not change yet because not enough time has passed for swamp
    expect(player.position.gridX).toBe(2);
    expect(player.position.gridY).toBe(2);
    
    // Try again with 600ms elapsed (enough time for swamp)
    updatePlayerMovement(player, inputState, mockMap, 600);
    
    // Now the player should move
    expect(player.position.gridY).toBe(3);
  });
  
  it('should respect movement delay for normal tiles', () => {
    const mockMap = createMockMap();
    const player = createPlayer(mockMap);
    player.position.gridX = 2;
    player.position.gridY = 2;
    player.currentTileType = TileType.GRASS;
    player.movement.lastMoveTime = 0;
    
    // Grass has normal movement speed (delay = 250ms with movement speed 4)
    const inputState = { up: false, down: false, left: true, right: false };
    
    // Try to move with only 100ms elapsed (not enough)
    updatePlayerMovement(player, inputState, mockMap, 100);
    
    // Position should not change yet
    expect(player.position.gridX).toBe(2);
    
    // Try again with 300ms elapsed (enough time for grass)
    updatePlayerMovement(player, inputState, mockMap, 300);
    
    // Now the player should move
    expect(player.position.gridX).toBe(1);
  });
});
