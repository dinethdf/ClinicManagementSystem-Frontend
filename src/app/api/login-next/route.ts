// Next Imports
import { NextResponse } from 'next/server'

// Auth Services - Make sure all 4 functions are imported!
import { 
  loginUser, 
  loginPatient, 
  loginUserDefault, 
  loginPatientDefault 
} from '@/libs/authentication'

export async function POST(req: Request) {
  try {
    // 1. Parse Request Body
    const body = await req.json()
    const { email, password, type, clinicCode } = body

    // 2. Validate Basic Input
    if (!email || !password || !type) {
      return NextResponse.json(
        { message: 'Missing required fields (email, password, or type)' },
        { status: 400 }
      )
    }

    let res;

    // 3. Handle Login Types and Routing based on clinicCode
    if (type === "clinic") {
      
      if (clinicCode) {
        console.log(`[API] Clinic Login Request: ${email} for Clinic Code: ${clinicCode}`)
        // User provided a clinic code
        res = await loginUser(email, password, clinicCode)
      } else {
        console.log(`[API] Default Clinic Login Request: ${email}`)
        // No clinic code provided, use the default ENV setup
        res = await loginUserDefault(email, password)
      }

    } else if (type === "patient") {
      
      if (clinicCode) {
        console.log(`[API] Patient Login Request: ${email} for Clinic Code: ${clinicCode}`)
        // Patient provided a clinic code
        res = await loginPatient(email, password, clinicCode)
      } else {
        console.log(`[API] Default Patient Login Request: ${email}`)
        // No clinic code provided, use the default ENV setup
        res = await loginPatientDefault(email, password)
      }

    } else {
      return NextResponse.json({ message: "Invalid login type" }, { status: 400 })
    }

    // 4. Handle Response
    if (!res || res.success === false) {
      return NextResponse.json(
        res || { message: 'Invalid credentials' }, 
        { status: 401 }
      )
    }

    return NextResponse.json(res, { status: 200 })

  } catch (error) {
    console.error("[API] Login Error:", error)
    return NextResponse.json(
      { message: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}