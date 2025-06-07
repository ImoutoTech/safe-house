import type { Directive } from 'vue'
import { useHasPermission } from '@/utils/permission'

interface PermissionElement extends HTMLElement {
  _originalDisplay?: string
  _originalDisabled?: boolean
  _isPermissionHidden?: boolean
}

interface PermissionBinding {
  value: string | { permission: string; mode?: 'hide' | 'disable' }
}

export const permission: Directive = {
  mounted(el: PermissionElement, binding: PermissionBinding) {
    checkPermission(el, binding.value)
  },
  
  updated(el: PermissionElement, binding: PermissionBinding) {
    checkPermission(el, binding.value)
  }
}

function checkPermission(el: PermissionElement, bindingValue: string | { permission: string; mode?: 'hide' | 'disable' }) {
  // 解析绑定值
  let permissionValue: string
  let mode: 'hide' | 'disable' = 'hide' // 默认模式为隐藏
  
  if (typeof bindingValue === 'string') {
    permissionValue = bindingValue
  } else {
    permissionValue = bindingValue.permission
    mode = bindingValue.mode || 'hide'
  }
  
  const hasPermission = useHasPermission(permissionValue)
  
  if (!hasPermission) {
    // 如果没有权限
    if (!el._isPermissionHidden) {
      if (mode === 'hide') {
        // 隐藏模式：完全隐藏元素
        el._originalDisplay = el.style.display
        el.style.display = 'none'
      } else if (mode === 'disable') {
        // 禁用模式：禁用元素但保持可见
        if ('disabled' in el) {
          el._originalDisabled = (el as any).disabled
          ;(el as any).disabled = true
        }
        // 添加视觉样式表示禁用状态
        el.style.opacity = '0.5'
        el.style.pointerEvents = 'none'
        el.style.cursor = 'not-allowed'
      }
      
      el._isPermissionHidden = true
    }
  } else {
    // 如果有权限，恢复原始状态
    if (el._isPermissionHidden) {
      if (mode === 'hide') {
        // 恢复显示
        if (el._originalDisplay !== undefined) {
          el.style.display = el._originalDisplay
        } else {
          el.style.removeProperty('display')
        }
      } else if (mode === 'disable') {
        // 恢复启用状态
        if ('disabled' in el && el._originalDisabled !== undefined) {
          ;(el as any).disabled = el._originalDisabled
        }
        // 移除禁用样式
        el.style.removeProperty('opacity')
        el.style.removeProperty('pointer-events')
        el.style.removeProperty('cursor')
      }
      
      el._isPermissionHidden = false
    }
  }
}

// 导出指令以便在main.ts中注册
export default permission
