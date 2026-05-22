import { encodeHideValue } from './encode'


export function generateQueueTrackingCode(scheduleId: number, queueNo: number, patientId: number): string {
  const data = `${scheduleId}:${queueNo}:${patientId}`

  
return encodeHideValue(data)
}


export function generateQueueTrackingUrl(
  scheduleId: number, 
  queueNo: number,  
  patientNo:number,
  baseUrl?: string
): string {
  const encoded = generateQueueTrackingCode(scheduleId, queueNo, patientNo)
  
  // Use provided baseUrl, or try to get from window/env
  const base = baseUrl 
    || (typeof window !== 'undefined' ? window.location.origin : '') 
    || process.env.NEXT_PUBLIC_APP_URL 
    || 'http://localhost:3000'
  
  // Assuming default locale is 'en'
  return `${base}/en/queue-tracker/${encoded}`
}

/**
 * Example usage in your appointment/bill component:
 * 
 * import QRCode from 'qrcode' // or 'react-qr-code'
 * import { generateQueueTrackingUrl } from '@/utils/qrcode'
 * 
 * const url = generateQueueTrackingUrl(scheduleId, queueNo)
 * 
 * // With qrcode library:
 * QRCode.toDataURL(url, (err, dataUrl) => {
 *   // Use dataUrl in <img src={dataUrl} />
 * })
 * 
 * // Or with react-qr-code:
 * <QRCode value={url} size={200} />
 */