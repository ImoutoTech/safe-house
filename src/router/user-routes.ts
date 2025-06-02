import type { RouteRecordRaw } from 'vue-router'
import { PERMISSION_CODE_MAP } from '@/utils/constants'

export const userRoutes: RouteRecordRaw[] = [
  {
    name: 'user-info',
    path: '',
    component: () => import('@/views/user/pages/user-info.vue'),
    meta: {
      title: '🧐 基本信息',
      permission: PERMISSION_CODE_MAP['查看用户']
    }
  },
  {
    name: 'user-app',
    path: 'app',
    component: () => import('@/views/user/pages/user-app.vue'),
    meta: {
      title: '📦 子应用',
      permission: PERMISSION_CODE_MAP['查看子应用']
    }
  }
]
