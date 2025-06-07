import type { App } from 'vue'
import { permission } from './permission'

export default function setupDirectives(app: App) {
  // 注册权限指令
  app.directive('permission', permission)
}

export { permission } 