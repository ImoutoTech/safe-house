import type { RouteRecordRaw } from 'vue-router'
import { NOTIFICATION_PERMISSION, PERMISSION_CODE_MAP } from '@/utils/constants'
import { UserRole } from '@reus-able/types'

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
  },
  {
    name: 'user-identities',
    path: 'identities',
    component: () => import('@/views/user/pages/user-identities.vue'),
    meta: { title: '🔗 登录方式', role: UserRole.USER }
  },
  {
    name: 'user-manage',
    path: 'manage',
    component: () => import('@/views/user/pages/user-manage.vue'),
    meta: {
      title: '🛠️ 管理',
      permissions: [
        'oauth-provider-admin',
        NOTIFICATION_PERMISSION.channel,
        NOTIFICATION_PERMISSION.template,
        NOTIFICATION_PERMISSION.policy
      ],
      hideTabWithoutPermission: true
    }
  }
]
