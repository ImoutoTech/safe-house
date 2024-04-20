import { AppStatus } from '@/types'
import { UserRole } from '@reus-able/types'

export const ENV = {
  API_URL: import.meta.env.VITE_API_URL,
  MODE: import.meta.env.MODE,
  TITLE: import.meta.env.VITE_APP_TITLE,
  CONFIG_URL: import.meta.env.VITE_CONFIG_URL,
  COPYRIGHT: {
    NAME: import.meta.env.VITE_COPYRIGHT_NAME,
    YEAR: Number(import.meta.env.VITE_COPYRIGHT_YEAR)
  },
  BUILD: {
    COMMIT: import.meta.env.VITE_BUILD_COMMIT,
    BRANCH: import.meta.env.VITE_BUILD_BRANCH
  },
  AVATAR: {
    GRAVATAR: import.meta.env.VITE_GRAVATAR_BASE,
    QQ: import.meta.env.VITE_QQ_AVATAR_BASE
  }
}

export const ROLE_NAME_MAP: Record<UserRole, string> = {
  [UserRole.USER]: '用户',
  [UserRole.ADMIN]: '管理员'
}

export const STATUS_NAME_MAP = {
  [AppStatus.BANNED]: '禁用',
  [AppStatus.CLOSED]: '关闭',
  [AppStatus.RUNNING]: '正常'
}
