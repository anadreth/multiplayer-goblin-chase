/**
 * Main entry point for the Multiplayer Goblin Chase game
 * Initializes the canvas and starts the render loop
 */
import { DebugOverlay } from './utils/debug-overlay';
import { ROTATION_SPEED } from './constants/game-constants';

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
window.addEventListener('unload', () => {
  window.removeEventListener('resize', setCanvasSize);
});

// Game loop variables
let frameCount = 0;
let lastTime = 0;
let totalRotation = 0; // Track total rotation angle

/**
 * Main render loop using requestAnimationFrame
 * @param currentTime - Current timestamp
 */
const gameLoop = (currentTime: number): void => {
  // Calculate delta time (ms)
  // In rare cases, when browser tab loses focus or when the browser throttles inactive tabs,
  // the timestamp might be inconsistent, causing negative delta values
  const delta = Math.max(0, currentTime - lastTime);
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
    
    // Draw a rotating indicator to show animation is working
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(totalRotation);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(-25, -25, 50, 50);
    ctx.restore();
    
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
  requestAnimationFrame(gameLoop);
};

// Initialize the game
initializeGameLoop();
