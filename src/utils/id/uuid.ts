/**
 * UUID Generation Utility
 * Provides robust UUID generation for entity identification
 */

/**
 * Generates a RFC4122 compliant v4 UUID
 * This implementation creates a cryptographically strong random UUID
 * @returns A UUID string in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export function generateUUID(): string {
  // Use crypto API if available for better randomness
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    return generateCryptoUUID();
  }
  
  // Fallback to Math.random() if crypto API is not available
  return generateFallbackUUID();
}

/**
 * Generate a UUID using the crypto API
 * @returns A cryptographically strong random UUID
 */
function generateCryptoUUID(): string {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c => {
    const randomValue = crypto.getRandomValues(new Uint8Array(1))[0];
    return (parseInt(c) ^ (randomValue & 15) >> parseInt(c) / 4).toString(16);
  });
}

/**
 * Generate a UUID using Math.random()
 * This is a fallback method and less secure than using crypto API
 * @returns A random UUID
 */
function generateFallbackUUID(): string {
  let d = new Date().getTime();
  
  // Use high-precision timer if available
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now();
  }
  
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
