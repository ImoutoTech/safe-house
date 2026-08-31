<script setup lang="ts">
import { Copy } from 'lucide-vue-next'
import { useClipboard } from '@vueuse/core'
import dayjs from 'dayjs'
import AppStatus from '@/components/app-status.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiCard from '@/components/ui/ui-card.vue'
import UiConfirmDialog from '@/components/ui/ui-confirm-dialog.vue'
import { useDeleteApp } from '@/composables/useDeleteApp'
import { useFeedback } from '@/composables/useFeedback'
import type { AppInfo } from '@/types'
import { PERMISSION_CODE_MAP } from '@/utils/constants'

defineOptions({ name: 'UserAppItem' })
const props = defineProps<{ app: AppInfo }>()
const emit = defineEmits<{ delete: []; update: []; inspect: [] }>()
const confirmOpen = shallowRef(false)
const { submit, loading } = useDeleteApp(props.app, () => {
  confirmOpen.value = false
  emit('delete')
})
const { copy } = useClipboard()
const feedback = useFeedback()
const copyId = async () => {
  await copy(props.app.id)
  feedback.success('应用 ID 已复制')
}
</script>

<template>
  <UiCard
    ><template #header
      ><div class="flex w-full items-start justify-between gap-4">
        <div class="grid gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="font-semibold">{{ app.name }}</h3>
            <AppStatus :status="app.meta.status" />
          </div>
          <p class="text-sm text-muted-foreground">{{ app.description || '暂无介绍' }}</p>
        </div>
        <UiButton size="sm" variant="ghost" :title="app.id" @click="copyId"
          ><Copy />复制 ID</UiButton
        >
      </div></template
    >
    <dl class="grid gap-3 text-sm">
      <div>
        <dt class="text-xs font-medium text-muted-foreground">回调地址</dt>
        <dd class="mt-1 break-all font-mono text-xs">{{ app.callback }}</dd>
      </div>
      <div class="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span>已访问 {{ app.visitNum }} 次</span
        ><span>创建于 {{ dayjs(app.created_at).format('YYYY-MM-DD') }}</span
        ><span>最后编辑 {{ dayjs(app.updated_at).fromNow() }}</span>
      </div>
    </dl>
    <template #footer
      ><div class="ml-auto flex flex-wrap gap-2">
        <UiButton
          v-permission="PERMISSION_CODE_MAP['查看子应用']"
          size="sm"
          variant="outline"
          @click="emit('inspect')"
          >凭据</UiButton
        ><UiButton
          v-permission="PERMISSION_CODE_MAP['修改子应用']"
          size="sm"
          variant="outline"
          @click="emit('update')"
          >编辑</UiButton
        ><UiButton
          v-permission="PERMISSION_CODE_MAP['删除子应用']"
          size="sm"
          variant="destructive"
          @click="confirmOpen = true"
          >删除</UiButton
        >
      </div></template
    ></UiCard
  ><UiConfirmDialog
    v-model:open="confirmOpen"
    title="删除子应用"
    :description="`确定要删除「${app.name}」吗？此操作无法撤销。`"
    confirm-text="删除"
    destructive
    :loading="loading"
    @confirm="submit"
  />
</template>
