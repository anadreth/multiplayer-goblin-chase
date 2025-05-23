/**
 * Main entry point for the Multiplayer Goblin Chase game
 * Initializes the canvas and starts the render loop
 */
import { DebugOverlay } from './utils/debug-overlay';
import { ROTATION_SPEED } from './constants/game-constants';
import { MapSystem } from './game/map/map-system';

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
  
  // Clean up map system
  if (mapSystem) {
    mapSystem.cleanup();
  }
});

// Game loop variables
let frameCount = 0;
let lastTime = 0;
let totalRotation = 0; // Track total rotation angle

// Initialize map system
let mapSystem: MapSystem | null = null;

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
  
  // Use delta for frame-rate independent animation
  totalRotation += ROTATION_SPEED * delta;
  totalRotation %= Math.PI * 2; // Keep within 0-2π range for precision
  
  // Clear canvas
  if (ctx) {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render the map
    if (mapSystem) {
      mapSystem.render();
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
  // Initialize map system if we have a context
  if (ctx) {
    mapSystem = new MapSystem(ctx);
  }
  
  requestAnimationFrame(gameLoop);
};

// Initialize the game
initializeGameLoop();
