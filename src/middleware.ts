import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PUBLIC_ROUTES, LOGIN, ROOT, PROTECTED_SUB_ROUTES } from "@/lib/routes";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = req.cookies.get('accessToken')?.value;
  const pathname = nextUrl.pathname;


  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route)) && 
                       !PROTECTED_SUB_ROUTES.includes(pathname);

  console.log(`Middleware triggered for ${pathname}`);


  if (isPublicRoute && !token) {
    return NextResponse.next();
  }


  // if (isPublicRoute && token) {
   
  //   try {
  //     const isValid = await validateTokenWithBackend(token);
  //     if (isValid) {
  //       return NextResponse.redirect(new URL('/dashboard', nextUrl));
  //     }
  //   } catch (error) {
  //     console.error('Token validation error:', error);
   
  //     return NextResponse.next();
  //   }
  // }

  // For protected routes
  if (!isPublicRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', nextUrl));
    }

    try {
      const isValid = await validateTokenWithBackend(token);
      if (!isValid) {
     
        const response = NextResponse.redirect(new URL('/signin', req.url));
        response.cookies.delete('accessToken');
        return response;
      }

      console.log("MiddleWare run")
      return NextResponse.next();
    } catch (error) {
      console.error('Token validation error:');
      const response = NextResponse.redirect(new URL('/signin?reason=session-expired', nextUrl));
      response.cookies.delete('accessToken');
      
      return response;
    }
  }

  return NextResponse.next();
}

async function validateTokenWithBackend(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Validation failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error('Error validating tokenss:');
      console.log(error);
    throw error;
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", ]
};