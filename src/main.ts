/**
 * Main entry point for the Multiplayer Goblin Chase game
 * Initializes the canvas and starts the render loop
 */
import { DebugOverlay } from './utils/debug-overlay';
import { MapSystem } from './game/map/map-system';
import { PlayerSystem } from './game/player/player-system';

// Canvas setup
const canvas = document.querySelector('#game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

// Initialize debug overlay
const debugOverlay = new DebugOverlay({
  position: 'top-left',
  backgroundColor: 'rgba(0, 0, 0, 0.7)'
});

// Set canvas size to match window (fullscreen responsive)
const setCanvasSize = (): void => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

// Initialize canvas size
setCanvasSize();

// Add window resize handler
window.addEventListener('resize', setCanvasSize);

// Clean up event listener when page unloads
window.addEventListener('beforeunload', () => {
  window.removeEventListener('resize', setCanvasSize);
  
  // Clean up game systems
  if (mapSystem) {
    mapSystem.cleanup();
  }
  
  if (playerSystem) {
    playerSystem.cleanup();
  }
});

// Game loop variables
let frameCount = 0;
let lastTime = 0;

// Game systems
let mapSystem: MapSystem | null = null;
let playerSystem: PlayerSystem | null = null;

/**
 * Calculate delta time between frames with protection against negative values
 * @param currentTime - Current timestamp from requestAnimationFrame
 * @param previousTime - Previous frame timestamp
 * @returns Non-negative delta time in milliseconds
 */
const calculateDelta = (currentTime: number, previousTime: number): number => {
  // In rare cases, when browser tab loses focus or when the browser throttles inactive tabs,
  // the timestamp might be inconsistent, causing negative delta values
  return Math.max(0, currentTime - previousTime);
};

/**
 * Main render loop using requestAnimationFrame
 * @param currentTime - Current timestamp
 */
const gameLoop = (currentTime: number): void => {
  // Calculate delta time (ms)
  const delta = calculateDelta(currentTime, lastTime);
  lastTime = currentTime;
  
  // Update debug overlay
  debugOverlay.update(currentTime, delta);
  
  // Update game systems
  if (playerSystem) {
    playerSystem.update(currentTime);
  }
  
  // Clear canvas
  if (ctx) {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render the map
    if (mapSystem) {
      mapSystem.render();
      
      // Render the player (after the map)
      if (playerSystem) {
        playerSystem.render();
      }
    }
    
    // Increment frame count
    frameCount++;
    
    // Render debug overlay
    debugOverlay.render(ctx);
  }
  
  // Continue the loop
  requestAnimationFrame(gameLoop);
};

/**
 * Initialize the game loop
 * Only called once at startup
 */
const initializeGameLoop = (): void => {
  // Initialize game systems if we have a context
  if (ctx) {
    // Create map system first
    mapSystem = new MapSystem(ctx);
    
    // Create player system with reference to the map
    if (mapSystem) {
      const map = mapSystem.getMap();
      playerSystem = new PlayerSystem(ctx, map);
      
      // Handle map regeneration to ensure player position is updated
      // We can safely use non-null assertion here as we've already checked mapSystem above
      const originalRegenerateMap = mapSystem.regenerateMap.bind(mapSystem);
      mapSystem.regenerateMap = (params) => {
        // Call the original method first
        originalRegenerateMap(params);
        
        // Update player's map reference after regeneration
        if (playerSystem && mapSystem) {
          playerSystem.setMap(mapSystem.getMap());
        }
      };
    }
  }
  
  requestAnimationFrame(gameLoop);
};

// Initialize the game
initializeGameLoop();
