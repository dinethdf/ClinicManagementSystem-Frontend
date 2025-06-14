import axios from 'axios';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface LoginResult {
  success: boolean;
  message: string;
  data?: LoginResponse;
}

const setSiteCookie = (cookieName: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 1000 * 60 * 60 * 24);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${cookieName}=${value}; ${expires}; path=/; SameSite=Strict;`;
};

const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  try { 
    
    const response = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_API_URL}/userSignIn`, {
      username : email,
      password: password,
      loginType: "USER"
    });

    const { accessToken, refreshToken } = response.data;

    
    setSiteCookie('accessToken', accessToken, 7);  // 7 days expiration
    setSiteCookie('refreshToken', refreshToken, 7);  // 7 days expiration

    return { success: true, message: 'Login successful', data: response.data };
  } catch (error:any) {
    return { success: false, message: error.response.data };
  }
};

export { loginUser };
