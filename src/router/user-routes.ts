import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw[] = [
  {
    name: 'user-info',
    path: '',
    component: () => import('@/views/user/user-info.vue'),
    meta: {
      title: '🏷 身份证件'
    }
  },
  {
    name: 'user-app',
    path: 'app',
    component: () => import('@/views/user/user-app.vue'),
    meta: {
      title: '📦 子应用'
    }
  }
]
