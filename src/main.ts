/**
 * Main entry point for the Multiplayer Goblin Chase game
 * Initializes the canvas and starts the render loop
 */
import { DebugOverlay } from './utils/debug-overlay';

// Canvas setup
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
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
  const delta = currentTime - lastTime;
  lastTime = currentTime;
  
  // Update debug overlay
  debugOverlay.update(currentTime, delta);
  
  // Use delta for frame-rate independent animation
  const rotationSpeed = 0.001; // radians per millisecond
  totalRotation += rotationSpeed * delta;
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

// Start the game loop
requestAnimationFrame(gameLoop);
