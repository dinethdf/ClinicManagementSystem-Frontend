export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null // SSR safety

  const cookies: string = document.cookie
  const nameEQ: string = `${name}=`
  const ca: string[] = cookies.split(';') // split all cookies

  for (let i = 0; i < ca.length; i++) {
    const c: string = ca[i].trim()

    if (c.startsWith(nameEQ)) {
      return c.substring(nameEQ.length)
    }
  }

  return null
}
