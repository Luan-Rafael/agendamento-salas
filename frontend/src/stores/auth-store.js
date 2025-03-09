import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
  const userName = ref(localStorage.getItem('userName') || null)

  async function signup(userNameInput, emailInput, password) {
    const { token } = await api
      .post('/v1/signup', {
        name: userNameInput,
        email: emailInput,
        password: password,
      })
      .then((data) => data.data)

    isAuthenticated.value = true
    userName.value = userNameInput
    localStorage.setItem('token', token)
    localStorage.setItem('userName', userNameInput)
    localStorage.setItem('isAuthenticated', 'true')
  }
  async function login(email, password) {
    const { user, token } = await api
      .post('/v1/login', {
        email: email,
        password: password,
      })
      .then((data) => data.data)

    isAuthenticated.value = true
    userName.value = user.name
    localStorage.setItem('token', token)
    localStorage.setItem('userName', user.name)
    localStorage.setItem('isAuthenticated', 'true')
  }

  async function logout() {
    isAuthenticated.value = false
    userName.value = ''

    localStorage.removeItem('userName')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('token')
  }

  function check() {
    const token = localStorage.getItem('token')
    isAuthenticated.value = token !== null
  }

  return {
    isAuthenticated,
    userName,
    login,
    signup,
    logout,
    check,
  }
})
