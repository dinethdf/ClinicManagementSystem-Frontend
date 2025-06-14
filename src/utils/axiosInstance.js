import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout:1000
});

// Attach tokens to requests
axiosInstance.interceptors.request.use((config) => {
  const accessToken = getCookie('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle token refreshing
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 (Unauthorized) and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie('refreshToken');
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, { refreshToken });

        // Update access token
        setCookie('accessToken', response.data.accessToken, 0.01);  // 15 minutes

        // Retry request with new token
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
