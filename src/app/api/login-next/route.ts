// Next Imports
import { NextResponse } from 'next/server'

// @@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//   This File need To check Again
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@
// Mock data for demo purpose
import { loginUser } from '@/libs/authentication'

export async function POST(req: Request) {
  // Vars
  const { email, password } = await req.json()
  const res = await loginUser(email, password)

  return NextResponse.json(res, { status: 200 })

  // } else {
  //   // We return 401 status code and error message if user is not found
  //   return NextResponse.json(
  //     {
  //       // We create object here to separate each error message for each field in case of multiple errors
  //       message: ['Email or Password is invalid']
  //     },
  //     {
  //       status: 401,
  //       statusText: 'Unauthorized Access'
  //     }
  //   )
  // }
}
