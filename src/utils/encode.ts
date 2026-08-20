// utils/encoder.ts
const secret = process.env.NEXT_PUBLIC_APP_SECRET_KEY

export function encodeHideValue(value: string | number): string {
  const str = `${secret}-${value}`
  const base64 = Buffer.from(str, 'utf8').toString('base64')

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}


export function decodeHideValue(encoded: string): string {
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
  
  while (base64.length % 4) base64 += '='

  const decoded = Buffer.from(base64, 'base64').toString('utf8')
  
  return decoded.replace(`${secret}-`, '')
}


const OBFUSCATION_KEY = process.env.NEXT_PUBLIC_OBFUSCATION_KEY || 'MySimpleKey';

export function encryptClinicPlane(plainText: string | undefined | null): string | null {
  if (!plainText) return null;

  try {
    const inputBuffer = Buffer.from(plainText, 'utf-8');
    const keyBuffer = Buffer.from(OBFUSCATION_KEY, 'utf-8');

    const output = new Uint8Array(inputBuffer.length);

    for (let i = 0; i < inputBuffer.length; i++) {
      output[i] = inputBuffer[i] ^ keyBuffer[i % keyBuffer.length];
    }

    return Buffer.from(output).toString('base64');
  } catch (error) {
    console.error("Encryption failed:", error);
    
return null;
  }
}

export function decryptClinicPlane(encryptedValue: string | undefined | null): string | null {
  if (!encryptedValue) return null;

  try {
    const inputBuffer = Buffer.from(encryptedValue, 'base64');
    const keyBuffer = Buffer.from(OBFUSCATION_KEY, 'utf-8');

    const output = new Uint8Array(inputBuffer.length);

    for (let i = 0; i < inputBuffer.length; i++) {
      output[i] = inputBuffer[i] ^ keyBuffer[i % keyBuffer.length];
    }

    return new TextDecoder('utf-8').decode(output);
  } catch (error) {
    console.error("Decryption failed:", error);
    
return null;
  }
}