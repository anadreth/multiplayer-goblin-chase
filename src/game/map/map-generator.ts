/**
 * Map Generator - Generates tile-based maps procedurally
 */
import { TileType, DEFAULT_MAP_WIDTH, DEFAULT_MAP_HEIGHT, TILE_WIDTH, TILE_HEIGHT } from '../../constants/game-constants';
import { GameMap, Tile, MapGenerationParams, DEFAULT_GENERATION_PARAMS, GrassDetails, SwampDetails, WaterDetails, TileDetails } from './map-types';

/**
 * Creates grass details for a tile
 * @returns Generated grass details
 */
const generateGrassDetails = (): GrassDetails => {
  const blades = [];
  
  // Generate 5 random grass blades
  for (let i = 0; i < 5; i++) {
    blades.push({
      offsetX: (Math.random() - 0.5) * (TILE_WIDTH * 0.6),
      offsetY: (Math.random() - 0.5) * (TILE_HEIGHT * 0.6),
      height: 3 + Math.random() * 5,
      angleOffset: (Math.random() - 0.5) * 3
    });
  }
  
  return { blades };
};

/**
 * Creates swamp details for a tile
 * @returns Generated swamp details
 */
const generateSwampDetails = (): SwampDetails => {
  const puddles = [];
  
  // Generate 2-3 random puddles
  const puddleCount = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < puddleCount; i++) {
    puddles.push({
      offsetX: (Math.random() - 0.5) * (TILE_WIDTH * 0.6),
      offsetY: (Math.random() - 0.5) * (TILE_HEIGHT * 0.6),
      radius: 2 + Math.random() * 4
    });
  }
  
  return { puddles };
};

/**
 * Creates water details for a tile
 * @returns Generated water details
 */
const generateWaterDetails = (): WaterDetails => {
  const waves = [];
  
  // Generate 3 wave lines
  for (let i = 0; i < 3; i++) {
    const amplitudes = [];
    
    // Store amplitudes for wave points
    for (let j = 0; j < 3; j++) {
      amplitudes.push(j % 2 === 0 ? 2 : -2);
    }
    
    waves.push({
      offsetY: (i - 1) * 5,
      amplitudes
    });
  }
  
  return { waves };
};

/**
 * Creates a new tile with specified parameters
 * @param type - Type of terrain
 * @param x - X position
 * @param y - Y position
 * @returns New tile instance
 */
export const createTile = (type: TileType, x: number, y: number): Tile => {
  // Determine if the tile is walkable and its movement speed based on type
  let walkable = true;
  let movementSpeed = 1.0;
  let details;
  
  switch (type) {
    case TileType.GRASS:
      walkable = true;
      movementSpeed = 1.0; // Normal speed
      details = generateGrassDetails();
      break;
    case TileType.SWAMP:
      walkable = true;
      movementSpeed = 0.5; // Half speed in swamp
      details = generateSwampDetails();
      break;
    case TileType.WATER:
      walkable = false;
      movementSpeed = 0; // Can't move in water
      details = generateWaterDetails();
      break;
  }
  
  return {
    type,
    x,
    y,
    walkable,
    movementSpeed,
    details
  };
};

/**
 * Creates an initial empty map filled with grass
 * @param width - Width of the map in tiles
 * @param height - Height of the map in tiles
 * @returns An initialized game map
 */
export const createEmptyMap = (width = DEFAULT_MAP_WIDTH, height = DEFAULT_MAP_HEIGHT): GameMap => {
  const tiles: Tile[][] = [];
  
  // Initialize the map with grass tiles
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < width; x++) {
      row.push(createTile(TileType.GRASS, x, y));
    }
    tiles.push(row);
  }
  
  return {
    width,
    height,
    tiles
  };
};

/**
 * Creates a deep clone of a tile
 * @param tile - The tile to clone
 * @returns A new tile with the same properties
 */
const cloneTile = (tile: Tile): Tile => {
  // Clone tile details based on type
  let clonedDetails: TileDetails;
  
  if (tile.type === TileType.GRASS) {
    const details = tile.details as GrassDetails;
    clonedDetails = {
      blades: details.blades.map(blade => ({...blade}))
    };
  } else if (tile.type === TileType.SWAMP) {
    const details = tile.details as SwampDetails;
    clonedDetails = {
      puddles: details.puddles.map(puddle => ({...puddle}))
    };
  } else { // Must be water
    const details = tile.details as WaterDetails;
    clonedDetails = {
      waves: details.waves.map(wave => ({
        offsetY: wave.offsetY,
        amplitudes: [...wave.amplitudes]
      }))
    };
  }
  
  // Return a new tile with cloned properties
  return {
    type: tile.type,
    x: tile.x,
    y: tile.y,
    walkable: tile.walkable,
    movementSpeed: tile.movementSpeed,
    details: clonedDetails
  };
};

/**
 * Applies a smoothing pass to the map to create more natural terrain
 * @param map - The map to smooth
 * @returns The smoothed map
 */
const smoothMap = (map: GameMap): GameMap => {
  // Create a new 2D array for tiles with proper deep cloning
  const newTiles: Tile[][] = Array(map.height).fill(null).map(() => Array(map.width).fill(null));
  
  // Initialize with cloned tiles
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      newTiles[y][x] = cloneTile(map.tiles[y][x]);
    }
  }
  
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const neighborCounts = {
        [TileType.GRASS]: 0,
        [TileType.SWAMP]: 0,
        [TileType.WATER]: 0
      };
      
      // Count neighboring tile types (including diagonals)
      for (let ny = Math.max(0, y - 1); ny <= Math.min(map.height - 1, y + 1); ny++) {
        for (let nx = Math.max(0, x - 1); nx <= Math.min(map.width - 1, x + 1); nx++) {
          if (nx !== x || ny !== y) { // Don't count the tile itself
            neighborCounts[map.tiles[ny][nx].type]++;
          }
        }
      }
      
      // Apply smoothing rules
      const currentType = map.tiles[y][x].type;
      let newType = currentType;
      
      // Water expands if surrounded by mostly water
      if (neighborCounts[TileType.WATER] >= 5) {
        newType = TileType.WATER;
      }
      // Swamp forms at the edges of water
      else if (currentType === TileType.GRASS && neighborCounts[TileType.WATER] >= 2) {
        newType = TileType.SWAMP;
      }
      // Isolated swamp or water converts to grass
      else if (currentType !== TileType.GRASS && neighborCounts[TileType.GRASS] >= 6) {
        newType = TileType.GRASS;
      }
      
      if (newType !== currentType) {
        newTiles[y][x] = createTile(newType, x, y);
      }
    }
  }
  
  return {
    ...map,
    tiles: newTiles
  };
};

/**
 * Generates a new random map
 * @param width - Width of the map in tiles
 * @param height - Height of the map in tiles
 * @param params - Generation parameters
 * @returns A newly generated map
 */
export const generateMap = (
  width = DEFAULT_MAP_WIDTH, 
  height = DEFAULT_MAP_HEIGHT, 
  params: MapGenerationParams = DEFAULT_GENERATION_PARAMS
): GameMap => {
  // Create random seed for reproducible maps
  const seed = Math.floor(Math.random() * 1000000);
  // Use seed to initialize random state if needed
  const random = () => Math.random(); // We could use a seeded random here
  
  // Start with an empty map
  let map = createEmptyMap(width, height);
  
  // Add water
  const waterTileCount = Math.floor(width * height * params.waterPercentage);
  for (let i = 0; i < waterTileCount; i++) {
    const x = Math.floor(random() * width);
    const y = Math.floor(random() * height);
    map.tiles[y][x] = createTile(TileType.WATER, x, y);
  }
  
  // Add swamp
  const swampTileCount = Math.floor(width * height * params.swampPercentage);
  for (let i = 0; i < swampTileCount; i++) {
    const x = Math.floor(random() * width);
    const y = Math.floor(random() * height);
    // Only place swamp on grass (not water)
    if (map.tiles[y][x].type === TileType.GRASS) {
      map.tiles[y][x] = createTile(TileType.SWAMP, x, y);
    }
  }
  
  // Apply noise based on noise factor
  const noiseTileCount = Math.floor(width * height * params.noiseFactor);
  for (let i = 0; i < noiseTileCount; i++) {
    const x = Math.floor(random() * width);
    const y = Math.floor(random() * height);
    const tileType = Math.floor(random() * 3) as TileType; // Random tile type
    map.tiles[y][x] = createTile(tileType, x, y);
  }
  
  // Apply smoothing passes
  for (let i = 0; i < params.smoothingPasses; i++) {
    map = smoothMap(map);
  }
  
  // Store the generation parameters and seed
  map.seed = seed;
  map.generationParams = params;
  
  return map;
};
