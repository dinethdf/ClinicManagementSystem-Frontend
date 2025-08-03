import axios from 'axios';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface LoginResult {
  success: boolean;
  message: string;
  data?: any;
}

export const setSiteCookie = (cookieName: string, value: string, days: number) => {
 
  const date = new Date();
 
  date.setTime(date.getTime() + days * 1000 * 60 * 60 * 24);
 
  // const expires = `expires=${date.toUTCString()}`;
 
  document.cookie = `${cookieName}=${value}; path=/; SameSite=Strict;`;
};

const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  try { 
    const response = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/userSignIn`, {
    
      username : email,
      password: password,
      loginType: "USER"
    });
   
    const { accessToken, refreshToken } = response.data;

    setSiteCookie('accessToken', accessToken, 7);  
    setSiteCookie('refreshToken', refreshToken, 7); 

    return { success: true, message: 'Login successful', data: response };
 
  } catch (error:any) {
  
    return { success: false, message: error.response.data };
  }

};

export { loginUser };


export function logoutAndRedirect() {
   
  document.cookie = 'accessToken=; Max-Age=0; path=/;';
  document.cookie = 'refreshToken=; Max-Age=0; path=/;';
 
  localStorage.clear();
  sessionStorage.clear();
 
  if ('caches' in window) {
    caches.keys().then(names => names.forEach(name => caches.delete(name)));
  }
  
  // window.location.replace('/en/login');

}



// Basic token validation (already existing)
export async function validateToken(authToken: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACK_END_API_URL}/validate-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if(response.data.valid){
      
      return response.data; 
    }else{
      return {valid: false }
    }

  } catch (error) {
    
    console.error('Token validation failed:');
   
    return { valid: false };
  }
}
