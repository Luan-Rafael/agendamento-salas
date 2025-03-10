const routes = [
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: 'rooms', component: () => import('pages/RoomsPage.vue') },
      { path: 'users', component: () => import('pages/UsersPage.vue') },

    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: "/signup",
    component: () => import('pages/SignupPage.vue')
  },
  {
    path: "/:catchAll(.*)",
    redirect: "login"
  }
]

export default routes
