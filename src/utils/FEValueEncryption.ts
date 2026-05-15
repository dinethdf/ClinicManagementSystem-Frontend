import crypto from 'crypto';

/**
 * FEValueEncryption utility to match Backend AES-256-ECB encryption/decryption.
 * This utility provides methods to encrypt/decrypt strings and objects.
 * It also includes universal methods that work in both Node.js and Browser environments.
 */

const DEFAULT_AES_ALGORITHM = 'aes-256-ecb';
// This key MUST match the AES_ENCRYPTION_KEY in the Backend (exactly 32 characters for AES-256)
const DEFAULT_KEY = 'CureGuardFeKey123456789012345678';

/**
 * Ensures the key is exactly 32 bytes for AES-256.
 */
const getValidatedKey = (customKey?: string): Buffer => {
  const key = Buffer.from(customKey || DEFAULT_KEY, 'utf8');
  const validatedKey = Buffer.alloc(32, 0);
  key.copy(validatedKey, 0, 0, Math.min(key.length, 32));
  return validatedKey;
};

// --- NODE-ONLY METHODS (AES-256-ECB) ---
// These use the 'crypto' module and are intended for server-side use.

/**
 * Encrypts a plain string into a Base64 AES string. (Server-side only)
 */
export function encodeString(plainText: string | null | undefined, customKey?: string): string | null {
  if (plainText === null || plainText === undefined) return null;
  try {
    // Only use crypto on the server
    if (typeof window !== 'undefined') {
        return transportEncrypt(plainText, customKey);
    }

    const key = getValidatedKey(customKey);
    const cipher = crypto.createCipheriv(DEFAULT_AES_ALGORITHM, key, null);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  } catch (error) {
    console.error('FEValueEncryption: Error encrypting string:', error);
    return null;
  }
}

/**
 * Decrypts a Base64 AES string back into plain text. (Server-side only)
 */
export function decodeString(encryptedText: string | null | undefined, customKey?: string): string | null {
  if (!encryptedText) return null;
  try {
    // Only use crypto on the server
    if (typeof window !== 'undefined') {
        return transportDecrypt(encryptedText, customKey);
    }

    const key = getValidatedKey(customKey);
    const decipher = crypto.createDecipheriv(DEFAULT_AES_ALGORITHM, key, null);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('FEValueEncryption: Error decrypting string:', error);
    return null;
  }
}

/**
 * Encrypts an object by stringifying it first.
 */
export function encodeObject(obj: any, customKey?: string): string | null {
  if (!obj) return null;
  try {
    return encodeString(JSON.stringify(obj), customKey);
  } catch (error) {
    console.error('FEValueEncryption: Error stringifying object for encryption:', error);
    return null;
  }
}

/**
 * Decrypts a Base64 AES string and parses it into an object.
 */
export function decodeObject<T = any>(encryptedText: string | null | undefined, customKey?: string): T | null {
  const decrypted = decodeString(encryptedText, customKey);
  if (!decrypted) return null;
  try {
    return JSON.parse(decrypted) as T;
  } catch (error) {
    console.error('FEValueEncryption: Error parsing decrypted text into object:', error);
    return null;
  }
}

// --- UNIVERSAL METHODS (XOR Obfuscation) ---
// These work in both Browser and Node.js. 
// Used primarily for "Transport Encryption" to hide data from the Network tab.

/**
 * Universally compatible encryption (XOR + Base64).
 * Works in both Browser and Node.
 */
export function transportEncrypt(text: string | null | undefined, customKey?: string): string | null {
  if (!text) return null;
  try {
    const key = customKey || DEFAULT_KEY;
    const result = [];
    for (let i = 0; i < text.length; i++) {
      result.push(String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length)));
    }
    return btoa(result.join(''));
  } catch (error) {
    console.error('FEValueEncryption: Universal encryption failed:', error);
    return null;
  }
}

/**
 * Universally compatible decryption (XOR + Base64).
 * Works in both Browser and Node.
 */
export function transportDecrypt(encryptedText: string | null | undefined, customKey?: string): string | null {
  if (!encryptedText) return null;
  try {
    const key = customKey || DEFAULT_KEY;
    const decoded = atob(encryptedText);
    const result = [];
    for (let i = 0; i < decoded.length; i++) {
      result.push(String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)));
    }
    return result.join('');
  } catch (error) {
    console.error('FEValueEncryption: Universal decryption failed:', error);
    return null;
  }
}
