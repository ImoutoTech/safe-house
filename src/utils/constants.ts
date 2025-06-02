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

export const STATUS_DES_MAP = {
  [AppStatus.BANNED]: '当前应用已被禁用',
  [AppStatus.CLOSED]: '当前应用被创建者关闭',
  [AppStatus.RUNNING]: '当前应用正在正常运行'
}

export const PERMISSION_LIST = [
  {
    name: '新建子应用',
    description: '新建子应用',
    code: 'mwGSuMXj'
  },
  {
    name: '删除子应用',
    description: '删除子应用',
    code: 'qtNiAVBF'
  },
  {
    name: '修改子应用',
    description: '修改子应用',
    code: 'QffBvVPP'
  },
  {
    name: '查看子应用',
    description: '查看子应用',
    code: 'PeqSazMt'
  },
  {
    name: '查看所有子应用',
    description: '查看所有子应用',
    code: 'hZLbqmHh'
  },
  {
    name: '新建角色',
    description: '新建角色',
    code: 'YXoSxbuX'
  },
  {
    name: '删除角色',
    description: '删除角色',
    code: 'YSvHQoAP'
  },
  {
    name: '修改角色',
    description: '修改角色',
    code: 'wKCXLYZD'
  },
  {
    name: '查看角色',
    description: '查看角色',
    code: 'ipqXqrGn'
  },
  {
    name: '新建权限',
    description: '新建权限',
    code: 'EKajZHAS'
  },
  {
    name: '删除权限',
    description: '删除权限',
    code: 'bDjPzdgF'
  },
  {
    name: '修改权限',
    description: '修改权限',
    code: 'tJrACEgJ'
  },
  {
    name: '查看权限',
    description: '查看权限',
    code: 'cfqYFXaQ'
  },
  {
    name: '新建用户',
    description: '新建用户',
    code: 'UcysHdkT'
  },
  {
    name: '删除用户',
    description: '删除用户',
    code: 'AuVdoGwA'
  },
  {
    name: '修改用户',
    description: '修改用户',
    code: 'gnhNAwmj'
  },
  {
    name: '查看用户',
    description: '查看用户',
    code: 'pedimtLB'
  },
  {
    name: '查看所有用户',
    description: '查看所有用户',
    code: 'bJqZjnMW'
  }
]

export const PERMISSION_CODE_MAP = PERMISSION_LIST.reduce<Record<string, string>>(
  (acc, curr) => {
    acc[curr.name] = curr.code
    return acc
  },
  {}
)
