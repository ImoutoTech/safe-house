<script setup lang="ts">
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle
} from 'reka-ui'
import UiButton from './ui-button.vue'

defineOptions({ name: 'UiConfirmDialog' })
const open = defineModel<boolean>('open', { default: false })
withDefaults(
  defineProps<{
    title: string
    description: string
    confirmText?: string
    loading?: boolean
    destructive?: boolean
  }>(),
  { confirmText: '确认', loading: false, destructive: false }
)
const emit = defineEmits<{ confirm: [] }>()
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <AlertDialogContent
        class="fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border bg-background p-6 shadow-lg"
      >
        <AlertDialogTitle class="text-lg font-semibold">{{ title }}</AlertDialogTitle>
        <AlertDialogDescription class="text-sm leading-relaxed text-muted-foreground">{{
          description
        }}</AlertDialogDescription>
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel as-child
            ><UiButton variant="outline" :disabled="loading">取消</UiButton></AlertDialogCancel
          >
          <AlertDialogAction as-child>
            <UiButton
              :variant="destructive ? 'destructive' : 'default'"
              :loading="loading"
              @click.prevent="emit('confirm')"
              >{{ confirmText }}</UiButton
            >
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
