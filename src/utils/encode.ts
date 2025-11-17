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
