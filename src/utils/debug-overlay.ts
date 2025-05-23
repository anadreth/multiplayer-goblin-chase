/**
 * Debug overlay utility for displaying performance metrics
 * Uses Canvas API to render metrics in the corner of the screen
 */

/**
 * Configuration options for the debug overlay
 */
export interface DebugOverlayOptions {
  enabled: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  textColor: string;
  backgroundColor: string;
  fontSize: number;
  padding: number;
}

/**
 * Default options for the debug overlay
 */
const DEFAULT_OPTIONS: DebugOverlayOptions = {
  enabled: true,
  position: 'top-left',
  textColor: '#FFF',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  fontSize: 14,
  padding: 10,
};

/**
 * Class for managing a debug overlay
 */
export class DebugOverlay {
  private options: DebugOverlayOptions;
  private frameCount: number = 0;
  private fps: number = 0;
  private lastFpsUpdate: number = 0;
  private fpsUpdateInterval: number = 500; // Update FPS display every 500ms
  private metrics: Map<string, string | number> = new Map();

  /**
   * Create a new debug overlay
   * @param options - Configuration options
   */
  constructor(options: Partial<DebugOverlayOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Update the debug overlay with the current frame information
   * @param currentTime - Current time in milliseconds
   * @param delta - Time since last frame in milliseconds
   */
  public update(currentTime: number, delta: number): void {
    if (!this.options.enabled) return;

    // Increment frame count
    this.frameCount++;

    // Update FPS counter every interval
    if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval) {
      // Calculate FPS: frames / seconds
      const elapsedSeconds = (currentTime - this.lastFpsUpdate) / 1000;
      this.fps = Math.round(this.frameCount / elapsedSeconds);
      
      // Reset counters
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }

    // Update stored metrics
    this.setMetric('FPS', this.fps);
    this.setMetric('Frame Time', `${Math.round(delta)}ms`);
  }

  /**
   * Set a custom metric to display in the debug overlay
   * @param key - Metric name
   * @param value - Metric value
   */
  public setMetric(key: string, value: string | number): void {
    this.metrics.set(key, value);
  }

  /**
   * Render the debug overlay to the canvas
   * @param ctx - Canvas rendering context
   */
  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.options.enabled || !ctx) return;

    const { textColor, backgroundColor, fontSize, padding, position } = this.options;
    const canvas = ctx.canvas;
    
    // Prepare text to display
    const lines: string[] = [];
    this.metrics.forEach((value, key) => {
      lines.push(`${key}: ${value}`);
    });

    // Calculate metrics for rendering
    ctx.font = `${fontSize}px monospace`;
    const lineHeight = fontSize * 1.2;
    const maxWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
    const boxWidth = maxWidth + padding * 2;
    const boxHeight = lines.length * lineHeight + padding * 2;

    // Determine position coordinates
    let x = 0;
    let y = 0;
    
    switch (position) {
      case 'top-left':
        x = 0;
        y = 0;
        break;
      case 'top-right':
        x = canvas.width - boxWidth;
        y = 0;
        break;
      case 'bottom-left':
        x = 0;
        y = canvas.height - boxHeight;
        break;
      case 'bottom-right':
        x = canvas.width - boxWidth;
        y = canvas.height - boxHeight;
        break;
    }

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, boxWidth, boxHeight);

    // Draw text
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';
    
    lines.forEach((line, index) => {
      const textY = y + padding + index * lineHeight;
      ctx.fillText(line, x + padding, textY);
    });
  }

  /**
   * Toggle the debug overlay visibility
   */
  public toggle(): void {
    this.options.enabled = !this.options.enabled;
  }
}
