<script setup lang="ts">
import { Copy, Eye, EyeOff } from 'lucide-vue-next'
import { shallowRef } from 'vue'
import UiButton from '@/components/ui/ui-button.vue'

defineOptions({ name: 'CredentialSnippet' })
const props = withDefaults(defineProps<{ value: string; label?: string; secret?: boolean }>(), {
  label: '凭据',
  secret: true
})
const emit = defineEmits<{ copy: [value: string] }>()
const revealed = shallowRef(false)
</script>

<template>
  <div class="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100">
    <div
      class="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-zinc-400"
    >
      <span>{{ label }}</span>
      <div class="flex gap-1">
        <UiButton
          v-if="secret"
          variant="ghost"
          size="icon"
          class="size-7 text-zinc-300 hover:bg-white/10 hover:text-white"
          :aria-label="revealed ? '隐藏凭据' : '显示凭据'"
          @click="revealed = !revealed"
          ><EyeOff v-if="revealed" /><Eye v-else /></UiButton
        ><UiButton
          variant="ghost"
          size="icon"
          class="size-7 text-zinc-300 hover:bg-white/10 hover:text-white"
          aria-label="复制凭据"
          @click="emit('copy', props.value)"
          ><Copy
        /></UiButton>
      </div>
    </div>
    <code class="block overflow-x-auto px-4 py-3 font-mono text-sm">{{
      secret && !revealed ? '••••••••••••••••••••••••' : value
    }}</code>
  </div>
</template>
