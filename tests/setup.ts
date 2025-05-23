/**
 * Global test setup for Vitest
 */
import { afterEach, vi } from 'vitest';

// Mock canvas global
global.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  fillText: vi.fn(),
  strokeText: vi.fn(),
  ellipse: vi.fn(),
}));

// Clean up after each test
afterEach(() => {
  vi.restoreAllMocks();
});
