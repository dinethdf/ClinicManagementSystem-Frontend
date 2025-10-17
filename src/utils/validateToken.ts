import { cookies } from 'next/headers'

import { verifyToken } from '@/libs/authentication'

// This simple helper ensures the async function is only run once per request cycle.
// This is the key to preventing repeated validation logic.
let cachedAuthUser: { role: any; userName: any; email: any } | null = null

export async function getAuthUser() {
  // 1. Check if the user data is already cached for this request
  if (cachedAuthUser) {
    return cachedAuthUser
  }

  // 2. Fetch token securely from cookies
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value

  if (!token) {
    cachedAuthUser = null

    return null
  }

  // 3. Validate the token and get the full user object
  const userVerification = await verifyToken(token)

  if (userVerification?.valid && userVerification?.payload) {
    // 4. Destructure ONLY the essential fields (Role, Username, Email/Sub)
    const { role, userName, sub } = userVerification.payload

    const essentialUserInfo = { role, userName, email: sub } // Use 'email' for clarity

    // 5. Cache the result before returning
    cachedAuthUser = essentialUserInfo

    return essentialUserInfo
  }

  cachedAuthUser = null

  return null
}
