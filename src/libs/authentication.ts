import axios from 'axios'

interface LoginResponse {
  accessToken: string
  refreshToken: string
}

interface LoginResult {
  success: boolean
  message: string
  data?: any
}

export const setSiteCookie = (cookieName: string, value: string, days: number) => {
  const date = new Date()

  date.setTime(date.getTime() + days * 1000 * 60 * 60 * 24)

  // const expires = `expires=${date.toUTCString()}`;

  document.cookie = `${cookieName}=${value}; path=/; SameSite=Strict;`
}

const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const response = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/userSignIn`, {
      username: email,
      password: password,
      loginType: 'USER'
    })

    return { success: true, message: 'Login successful', data: response.data }
  } catch (error: any) {
    return { success: false, message: error.response.data }
  }
}

export { loginUser }

export const setLoginCookie = (access: string, refresh: string) => {
  setSiteCookie('accessToken', access, 7)
  setSiteCookie('refreshToken', refresh, 7)
}

export function logoutAndRedirect() {
  document.cookie = 'accessToken=; Max-Age=0; path=/;'
  document.cookie = 'refreshToken=; Max-Age=0; path=/;'

  localStorage.clear()
  sessionStorage.clear()

  if ('caches' in window) {
    caches.keys().then(names => names.forEach(name => caches.delete(name)))
  }

  // window.location.replace('/en/login');
}

// Basic token validation (already existing)
// export async function validateToken(authToken: string) {
//   try {
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_BACK_END_API_URL}/validate-token`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     )

//     if (response.data.valid) {
//       return response.data
//     } else {
//       return { valid: false }
//     }
//   } catch (error) {
//     console.error('Token validation failed:')

//     return { valid: false }
//   }
// }

/**
 * Verify a JWT token using HMAC SHA-256 and a Base64-encoded secret.
 * Returns an object with `valid` and `payload` or `error`.
 */

/**
 * Verify JWT token using HMAC SHA-256 and a Base64-encoded secret.
 * Returns an object with `valid` and `payload` or `error`.
 */
export async function verifyToken(token: string | undefined): Promise<{
  valid: boolean
  payload?: any
  error?: string
}> {
  // Get the secret from environment variable
  const secretBase64 = process.env.JWT_SECRET

  if (!token || !secretBase64) {
    return { valid: false, error: 'Token and secret key are required.' }
  }

  const parts = token.split('.')

  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid JWT format.' }
  }

  const [headerB64, payloadB64, signatureB64] = parts

  try {
    // Decode header and payload
    // const header = JSON.parse(atob(headerB64))
    const payload = JSON.parse(atob(payloadB64))

    // Convert secret from Base64 to ArrayBuffer
    const secretKey = await crypto.subtle.importKey(
      'raw',
      Uint8Array.from(atob(secretBase64), c => c.charCodeAt(0)),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Generate the data string (header.payload)
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`)

    // Decode the JWT signature from Base64URL to Uint8Array
    const signature: BufferSource = base64UrlToBufferSource(signatureB64)

    // Verify signature using Web Crypto API
    const isValid = await crypto.subtle.verify('HMAC', secretKey, signature, data)

    if (!isValid) {
      return { valid: false, error: '❌ Invalid token: Signature verification failed.' }
    }

    // Check expiration

    const now = Math.floor(Date.now() / 1000)

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: '⚠️ Token is expired.', payload }
    }

    return { valid: true, payload }
  } catch (error: any) {
    return { valid: false, error: `Error verifying token: ${error.message}` }
  }
}

/**
 * Helper: decode Base64URL string to Uint8Array
 */

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
