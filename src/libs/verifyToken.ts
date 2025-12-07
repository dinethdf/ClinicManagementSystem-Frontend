import "server-only";
import { cookies } from 'next/headers';

export async function verifyToken(): Promise<{
  valid: boolean
  payload?: any
  error?: string
}> {
  const token2  = (await cookies()).get('accessToken')?.value;
  
  const secretBase64 = process.env.JWT_SECRET

  if (!token2 || !secretBase64) {
    return { valid: false, error: 'Token and secret key are required.' }
  }

  const parts = token2.split('.')

  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid JWT format.' }
  }

  const [headerB64, payloadB64, signatureB64] = parts

  try {
    const payload = JSON.parse(atob(payloadB64))

    const secretKey = await crypto.subtle.importKey(
      'raw',
      Uint8Array.from(atob(secretBase64), c => c.charCodeAt(0)),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`)

    const signature: BufferSource = base64UrlToBufferSource(signatureB64)

    const isValid = await crypto.subtle.verify('HMAC', secretKey, signature, data)

    if (!isValid) {
      return { valid: false, error: '❌ Invalid token: Signature verification failed.' }
    }

    console.log('Tocken Verification')
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: '⚠️ Token is expired.', payload }
    }

    return { valid: true, payload }
  } catch (error: any) {
    return { valid: false, error: `Error verifying token: ${error.message}` }
  }
}

// /**
//  * Helper: decode Base64URL string to Uint8Array
//  */

function base64UrlToBufferSource(base64Url: string): BufferSource {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

  while (base64.length % 4 !== 0) base64 += '='
  const raw = atob(base64)
  const buffer = new Uint8Array(raw.length)

  for (let i = 0; i < raw.length; i++) {
    buffer[i] = raw.charCodeAt(i)
  }

  return buffer // BufferSource type
}
