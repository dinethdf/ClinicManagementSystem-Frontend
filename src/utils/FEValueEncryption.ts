import crypto from 'crypto';

/**
 * FEValueEncryption utility to match Backend AES-256-ECB encryption/decryption.
 * This utility is publicly reusable and provides methods to encrypt/decrypt strings and objects.
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

/**
 * Encrypts a plain string into a Base64 AES string.
 */
export function encodeString(plainText: string | null | undefined, customKey?: string): string | null {
  if (plainText === null || plainText === undefined) return null;
  try {
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
 * Decrypts a Base64 AES string back into plain text.
 */
export function decodeString(encryptedText: string | null | undefined, customKey?: string): string | null {
  if (!encryptedText) return null;
  try {
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
