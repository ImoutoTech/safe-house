<script setup lang="ts">
import { X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle
} from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiDialog' })
const open = defineModel<boolean>('open', { default: false })
const props = withDefaults(
  defineProps<{ title: string; description?: string; class?: string; blocking?: boolean }>(),
  { blocking: false }
)
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <DialogContent
        :class="
          cn(
            'fixed left-1/2 top-1/2 z-50 grid max-h-[90vh] max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-hidden rounded-xl border bg-background p-6 shadow-lg duration-200 motion-reduce:duration-0 motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            props.class
          )
        "
        @pointer-down-outside="props.blocking && $event.preventDefault()"
        @escape-key-down="props.blocking && $event.preventDefault()"
      >
        <div class="grid gap-1.5 pr-8">
          <DialogTitle class="text-lg font-semibold leading-none tracking-tight">{{
            title
          }}</DialogTitle>
          <DialogDescription
            v-if="description"
            class="text-sm leading-relaxed text-muted-foreground"
            >{{ description }}</DialogDescription
          >
        </div>
        <div class="min-h-0 overflow-y-auto"><slot /></div>
        <footer
          v-if="$slots.footer"
          class="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end"
        >
          <slot name="footer" />
        </footer>
        <DialogClose
          v-if="!blocking"
          class="absolute right-4 top-4 rounded-sm p-1 text-muted-foreground opacity-70 outline-none transition-opacity hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <X class="size-4" aria-hidden="true" /><span class="sr-only">关闭</span>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
