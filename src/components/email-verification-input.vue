<template>
  <n-flex class="email-verification-input" vertical>
    <n-flex class="verification-row" :wrap="false">
      <n-input
        class="verification-code"
        :value="code"
        maxlength="6"
        inputmode="numeric"
        autocomplete="one-time-code"
        placeholder="6 位验证码"
        :disabled="disabled || verified"
        @update:value="$emit('update:code', $event)"
      />
      <n-button
        class="send-button"
        :disabled="disabled || secondsRemaining > 0"
        :loading="sending"
        @click="$emit('send')"
      >
        {{ secondsRemaining > 0 ? `${secondsRemaining}s` : '发送验证码' }}
      </n-button>
    </n-flex>
    <n-button
      v-if="!verified"
      secondary
      type="primary"
      :disabled="disabled || code.length !== 6"
      :loading="verifying"
      @click="$emit('verify')"
    >
      验证邮箱
    </n-button>
    <n-alert v-else type="success" :show-icon="false">邮箱已验证</n-alert>
    <span class="sr-status" aria-live="polite">
      {{ secondsRemaining > 0 ? `${secondsRemaining} 秒后可重新发送` : '可以发送验证码' }}
    </span>
  </n-flex>
</template>

<script setup lang="ts">
defineOptions({ name: 'EmailVerificationInput' })

defineProps<{
  code: string
  secondsRemaining: number
  sending: boolean
  verifying: boolean
  verified: boolean
  disabled?: boolean
}>()

defineEmits<{
  'update:code': [value: string]
  send: []
  verify: []
}>()
</script>

<style scoped lang="scss">
.email-verification-input {
  width: 100%;
}

.verification-row {
  width: 100%;
}

.verification-code {
  min-width: 0;
  flex: 1;
}

.send-button {
  flex: none;
}

.sr-status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
</style>
