<script setup lang="ts">
import dayjs from 'dayjs'
import UiButton from '@/components/ui/ui-button.vue'
import UiCard from '@/components/ui/ui-card.vue'
import { PERMISSION_CODE_MAP } from '@/utils/constants'

defineOptions({ name: 'UserAccountDetails' })
const props = defineProps<{
  email: string
  createdAt: string
  updatedAt: string
}>()
const emit = defineEmits<{
  (event: 'edit'): void
  (event: 'logout'): void
}>()

const formatDate = (value: string) => (value ? dayjs(value).format('YYYY-MM-DD') : '—')
const facts = computed(() => [
  { label: '邮箱', value: props.email },
  { label: '加入时间', value: formatDate(props.createdAt) },
  { label: '上次编辑', value: formatDate(props.updatedAt) }
])
</script>

<template>
  <UiCard class="flex h-full flex-col shadow-none [&>div]:flex-1">
    <template #title>账号资料</template>
    <template #description>你的基础账号信息</template>
    <dl class="divide-y">
      <div v-for="fact in facts" :key="fact.label" class="grid gap-1 py-3 first:pt-0 last:pb-0">
        <dt class="text-xs font-medium text-muted-foreground">{{ fact.label }}</dt>
        <dd class="break-all text-sm">{{ fact.value }}</dd>
      </div>
    </dl>
    <template #footer>
      <div class="flex w-full flex-wrap justify-between gap-3">
        <UiButton
          v-permission="PERMISSION_CODE_MAP['修改用户']"
          variant="outline"
          size="sm"
          @click="emit('edit')"
          >编辑资料</UiButton
        >
        <UiButton variant="destructive" size="sm" @click="emit('logout')">退出登录</UiButton>
      </div>
    </template>
  </UiCard>
</template>
