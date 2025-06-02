import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home-view.vue'
import BaseLayout from '@/layout/BaseLayout.vue'
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
import { UserRole } from '@reus-able/types'
import { useUserStore } from '@/stores/user'
import { userRoutes } from './user-routes'

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
          component: () => import('../views/user/pages/login-index.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/user/pages/register-index.vue')
        },
        {
          path: 'user',
          name: 'user-layout',
          component: () => import('../views/user/view-index.vue'),
          meta: {
            role: UserRole.USER
          },
          redirect: { name: 'user-info' },
          children: userRoutes
        },
        {
          path: 'callback',
          name: 'callback-layout',
          component: FlexCenterLayout,
          props: {
            type: 'router'
          },
          redirect: { name: 'home' },
          children: [
            {
              path: ':id',
              name: 'callback-index',
              component: () => import('../views/callback/view-index.vue')
            }
          ]
        },
        {
          path: 'oauth',
          name: 'oauth-layout',
          component: FlexCenterLayout,
          props: {
            type: 'router'
          },
          redirect: { name: 'home' },
          children: [
            {
              path: 'authorize',
              name: 'authorize-index',
              component: () => import('../views/callback/authorize-index.vue')
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const { hasLogin, userData } = useUserStore()

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
