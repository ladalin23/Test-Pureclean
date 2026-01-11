import axios from 'axios';
import Cookies from 'js-cookie';
export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();
  const isProd = config.public.MODE === 'production';
  const UserPublicAPI = isProd ? config.public.ADMIN_PUBLIC_API : config.public.ADMIN_PUBLIC_API_DEV;
  const UserPrivateAPI = isProd ? config.public.ADMIN_PRIVATE_API : config.public.ADMIN_PRIVATE_API_DEV;

  // Public Axios instance (no token required), with credentials enabled for CORS
  const AdminPublicAPIAxiosInstance = axios.create({
    baseURL: UserPublicAPI,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true,
  });

  // Private Axios instance (with token)
  const AdminPrivateAPIAxiosInstance = axios.create({
    baseURL: UserPrivateAPI,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  
  // Attach token to the private Axios instance (if needed)
  AdminPrivateAPIAxiosInstance.interceptors.request.use(config => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Provide all instances globally
  nuxtApp.provide('AdminPublicAxios', AdminPublicAPIAxiosInstance);
  nuxtApp.provide('AdminPrivateAxios', AdminPrivateAPIAxiosInstance);
  // inject('AdminPublicAxios', AdminPublicAPIAxiosInstance);
  // inject('AdminPrivateAxios', AdminPrivateAPIAxiosInstance);
});
