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
  fpsUpdateIntervalMs: number;
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
  fpsUpdateIntervalMs: 500,
};

/**
 * Class for managing a debug overlay
 */
export class DebugOverlay {
  private options: DebugOverlayOptions;
  private frameCount: number = 0;
  private fps: number = 0;
  private lastFpsUpdate: number = 0;
  // Constants are now from options
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
    if (currentTime - this.lastFpsUpdate >= this.options.fpsUpdateIntervalMs) {
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
    if (!this.options.enabled) return;
    if (!ctx) {
      console.warn('DebugOverlay: Cannot render without a valid canvas context');
      return;
    }

    const { textColor, backgroundColor, fontSize, padding, position } = this.options;
    const canvas = ctx.canvas;
    
    // Prepare text to display
    const lines: string[] = [];
    this.metrics.forEach((value, key) => {
      lines.push(`${key}: ${value}`);
    });

    // Calculate metrics for rendering
    ctx.font = `${fontSize}px monospace`;
    const LINE_HEIGHT_SCALE: number = 1.2;
    const lineHeight: number = fontSize * LINE_HEIGHT_SCALE;
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
   * Toggle the debug overlay visibility or set it explicitly
   * @param forceState - Optional boolean to explicitly set the enabled state
   */
  public toggle(forceState?: boolean): void {
    this.options.enabled = forceState !== undefined ? forceState : !this.options.enabled;
  }
}
