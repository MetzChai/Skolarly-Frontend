import axios from "axios";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Prevent infinite loops
    if (
      originalRequest.url?.includes("/refresh-token") ||
      originalRequest.url?.includes("/me")
    ) {
      try {
        await axios.post(
          `${backendURL}/api/auth/v1/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

    if (status === 401) {

      try {
        await axios.post(
          `${backendURL}/api/auth/v1/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
