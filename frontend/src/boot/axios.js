import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth-store'

const baseURL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api' // No desenvolvimento, use a porta 3001

const api = axios.create({ baseURL })

export default defineBoot(({ app, router }) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const useAuth = useAuthStore()
      let message = 'Erro desconhecido'

      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 400:
            message = 'Requisição inválida'
            console.error('Erro 400: Requisição inválida')
            break
          case 401:
          case 403:
            message = 'Não autorizado'
            console.error('Erro 401: Não autorizado')
            useAuth.logout()
            router.push('/login')
            break
          case 500:
            message = 'Erro interno no servidor'
            console.error('Erro 500: Erro interno no servidor')
            break
          default:
            console.error('Erro desconhecido:', error.response?.data?.message)
        }
      }

      return Promise.reject({ message: error.response?.data?.message ?? message })
    },
  )

  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api
})

export { api }
