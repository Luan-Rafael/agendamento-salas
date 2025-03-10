import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth-store'

const api = axios.create({ baseURL: 'http://localhost:3001/api' })

export default defineBoot(({ app , router}) => {
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  api.interceptors.response.use(
    response => response,
   async  (error) => {
      const useAuth = useAuthStore()

      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 400:
            console.error("Erro 400: Requisição inválida");
            break;
          case 401:
            case 403:
            console.error("Erro 401: Não autorizado");
            useAuth.logout()
            router.push('/login')
            break;
          case 500:
            console.error("Erro 500: Erro interno no servidor");
            break;
          default:
            console.error("Erro desconhecido:", error.response.data.message);
        }
      }

      return Promise.reject(error.response.data); // Rejeita a promise para que o erro possa ser tratado onde a requisição for chamada
    }
  );

  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api

})




export { api }
