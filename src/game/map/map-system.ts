/**
 * Map System - Central map management system
 */
import { GameMap, MapGenerationParams, DEFAULT_GENERATION_PARAMS } from './map-types';
import { generateMap } from './map-generator';
import { renderMap } from './map-renderer';
import { DEFAULT_MAP_WIDTH, DEFAULT_MAP_HEIGHT } from '../../constants/game-constants';

/**
 * Manages the game map, including generation and rendering
 */
export class MapSystem {
  private map: GameMap;
  private ctx: CanvasRenderingContext2D;
  private regenerateButton: HTMLButtonElement | null = null;
  
  /**
   * Create a new map system
   * @param ctx - Canvas rendering context
   * @param width - Map width in tiles
   * @param height - Map height in tiles
   */
  constructor(ctx: CanvasRenderingContext2D, width = DEFAULT_MAP_WIDTH, height = DEFAULT_MAP_HEIGHT) {
    this.ctx = ctx;
    // Generate initial map
    this.map = generateMap(width, height);
    
    // Add UI elements
    this.createUI();
  }
  
  /**
   * Create UI elements for the map system
   */
  private createUI(): void {
    // Create regenerate button
    this.regenerateButton = document.createElement('button');
    this.regenerateButton.textContent = 'Generate New Map';
    this.regenerateButton.classList.add('map-button');
    this.regenerateButton.addEventListener('click', () => this.regenerateMap());
    
    // Position button in top-right corner
    this.regenerateButton.style.position = 'absolute';
    this.regenerateButton.style.top = '10px';
    this.regenerateButton.style.right = '10px';
    this.regenerateButton.style.padding = '8px 16px';
    this.regenerateButton.style.backgroundColor = '#4CAF50';
    this.regenerateButton.style.color = 'white';
    this.regenerateButton.style.border = 'none';
    this.regenerateButton.style.borderRadius = '4px';
    this.regenerateButton.style.cursor = 'pointer';
    this.regenerateButton.style.fontWeight = 'bold';
    this.regenerateButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    
    // Add hover effect
    this.regenerateButton.addEventListener('mouseover', () => {
      if (this.regenerateButton) {
        this.regenerateButton.style.backgroundColor = '#45a049';
      }
    });
    
    this.regenerateButton.addEventListener('mouseout', () => {
      if (this.regenerateButton) {
        this.regenerateButton.style.backgroundColor = '#4CAF50';
      }
    });
    
    // Add to document
    document.body.appendChild(this.regenerateButton);
  }
  
  /**
   * Render the current map
   */
  public render(): void {
    renderMap(this.ctx, this.map);
  }
  
  /**
   * Regenerate the map with new parameters
   * @param params - Optional map generation parameters
   */
  public regenerateMap(params?: MapGenerationParams): void {
    // Generate a new map with the same dimensions
    this.map = generateMap(
      this.map.width, 
      this.map.height, 
      params || DEFAULT_GENERATION_PARAMS
    );
    
    // Render the new map immediately
    this.render();
  }
  
  /**
   * Get the current map
   * @returns The current game map
   */
  public getMap(): GameMap {
    return this.map;
  }
  
  /**
   * Clean up resources when destroying the map system
   */
  public cleanup(): void {
    // Remove UI elements
    if (this.regenerateButton && document.body.contains(this.regenerateButton)) {
      document.body.removeChild(this.regenerateButton);
    }
  }
}
