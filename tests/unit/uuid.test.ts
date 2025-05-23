/**
 * UUID Generator Unit Tests
 */
import { describe, it, expect } from 'vitest';
import { generateUUID } from '../../src/utils/id/uuid';

describe('UUID Generator', () => {
  it('should generate a valid UUID string', () => {
    const uuid = generateUUID();
    
    // UUID format should be: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    // where y is 8, 9, a, or b
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });
  
  it('should generate unique UUIDs', () => {
    const uuids = new Set();
    const iterations = 1000;
    
    // Generate multiple UUIDs and check for duplicates
    for (let i = 0; i < iterations; i++) {
      uuids.add(generateUUID());
    }
    
    // If all UUIDs are unique, the set size should equal the number of iterations
    expect(uuids.size).toBe(iterations);
  });
});
