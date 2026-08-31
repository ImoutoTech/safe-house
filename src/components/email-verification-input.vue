<script setup lang="ts">
import UiAlert from '@/components/ui/ui-alert.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiInput from '@/components/ui/ui-input.vue'

defineOptions({ name: 'EmailVerificationInput' })
defineProps<{
  id: string
  code: string
  secondsRemaining: number
  sending: boolean
  verifying: boolean
  verified: boolean
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
}>()
defineEmits<{ 'update:code': [value: string]; send: []; verify: [] }>()
</script>

<template>
  <div class="grid w-full gap-2">
    <div class="flex gap-2">
      <UiInput
        :id="id"
        :model-value="code"
        maxlength="6"
        inputmode="numeric"
        autocomplete="one-time-code"
        placeholder="6 位验证码"
        :disabled="disabled || verified"
        :invalid="invalid"
        :aria-describedby="describedBy"
        class="min-w-0 flex-1"
        @update:model-value="$emit('update:code', String($event ?? ''))"
      />
      <UiButton
        variant="outline"
        :disabled="disabled || secondsRemaining > 0"
        :loading="sending"
        @click="$emit('send')"
        >{{ secondsRemaining > 0 ? `${secondsRemaining}s` : '发送验证码' }}</UiButton
      >
    </div>
    <UiButton
      v-if="!verified"
      variant="secondary"
      block
      :disabled="disabled || code.length !== 6"
      :loading="verifying"
      @click="$emit('verify')"
      >验证邮箱</UiButton
    >
    <UiAlert v-else variant="success">邮箱已验证</UiAlert>
    <span class="sr-only" aria-live="polite">{{
      secondsRemaining > 0 ? `${secondsRemaining} 秒后可重新发送` : '可以发送验证码'
    }}</span>
  </div>
</template>
