import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth-store'

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    authStore.check()

    if (to.path === '/login' && authStore.isAuthenticated) {
      return next('/home')
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      if (to.path === '/login') {
        return next()
      }
      next('/login')
    }

    return next()
  })

  return Router
})
