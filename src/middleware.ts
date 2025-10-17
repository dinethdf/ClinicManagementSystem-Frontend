import { NextResponse } from 'next/server'

export async function middleware() {
  console.log(`Middleware triggered`)

  return NextResponse.next()
}

// async function validateTokenWithBackend(token: string): Promise<boolean> {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validate-token`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`Validation failed with status ${response.status}`);
//     }

//     const data = await response.json();
//     return data.valid;
//   } catch (error) {
//     console.error('Error validating tokenss:');
//       console.log(error);
//     throw error;
//   }
// }

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)']
}
