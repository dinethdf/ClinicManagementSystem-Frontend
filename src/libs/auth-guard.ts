import 'server-only'; 
import { redirect } from 'next/navigation';
import { verifyToken } from './verifyToken';

export async function requireUser(allowedRoles: string[]) {

  const auth = await verifyToken();

  if (!auth.valid || !auth.payload) {
    redirect('/en/login');
  }

  const userRole = auth.payload.role; 


  if (!allowedRoles.includes(userRole)) {

    redirect('/en/unauthorized'); 

  }


  return auth.payload;
}