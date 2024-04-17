import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BaseLayout from '@/layout/BaseLayout.vue'
import { UserRole } from '@reus-able/types'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'base-layout',
      component: BaseLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/user/login-index.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/user/register-index.vue')
        },
        {
          path: 'user',
          name: 'user-layout',
          component: () => import('../views/user/view-index.vue'),
          meta: {
            role: UserRole.USER
          }
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const { hasLogin, userData } = useUserStore()
  console.log(to.matched)

  for (const route of [...to.matched].reverse()) {
    if (route.meta.role) {
      const authMap = {
        [UserRole.ADMIN]: hasLogin.value && userData.value.role === UserRole.ADMIN,
        [UserRole.USER]: hasLogin.value
      }

      return authMap[route.meta.role as UserRole] || { name: 'login' }
    }
  }

  return true
})

export default router
