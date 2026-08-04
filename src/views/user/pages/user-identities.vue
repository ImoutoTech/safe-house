<script setup lang="ts">
import { useExternalIdentities } from '@/composables/useExternalIdentities'
import { useExternalLogin } from '@/composables/useExternalLogin'
import type { LinkedIdentity } from '@/types'

defineOptions({ name: 'UserIdentities' })

const dialog = useDialog()
const route = useRoute()
const { identities, loading, error, unbind, startBinding, refresh } = useExternalIdentities()
const { providers } = useExternalLogin()

const linkedProviders = computed(() => new Set(identities.value.map((item) => item.provider)))
const availableProviders = computed(() =>
  providers.value.filter((item) => !linkedProviders.value.has(item.provider))
)
const providerLabel = (provider: string) => {
  if (provider === 'github') return 'GitHub'
  if (provider === 'google') return 'Google'
  return provider
}

const confirmUnbind = (identity: LinkedIdentity) => {
  dialog.warning({
    title: '确认解绑',
    content: `确定解绑 ${identity.provider} 身份吗？`,
    positiveText: '解绑',
    negativeText: '取消',
    onPositiveClick: () => unbind(identity.id)
  })
}
</script>

<template>
  <n-spin class="identity-page" :show="loading">
    <n-flex v-if="error" vertical align="start">
      <n-alert type="error" title="身份操作失败">{{ error.message }}</n-alert>
      <n-button @click="refresh()">重试</n-button>
    </n-flex>
    <n-empty
      v-else-if="!identities.length && !availableProviders.length"
      description="暂无可用的外部登录方式"
    />
    <n-list v-else :bordered="false">
      <n-list-item
        v-for="identity in identities"
        :key="`linked-${identity.id}`"
        class="identity-line identity-line--hierarchy"
      >
        <div class="identity-line__copy">
          <strong class="identity-line__provider">{{ providerLabel(identity.provider) }}</strong>
          <span class="identity-line__separator" aria-hidden="true">·</span>
          <span class="identity-line__account">{{
            identity.email || identity.displayName || '已绑定'
          }}</span>
        </div>
        <template #suffix>
          <n-button type="error" text :disabled="loading" @click="confirmUnbind(identity)"
            >解绑</n-button
          >
        </template>
      </n-list-item>
      <n-list-item
        v-for="provider in availableProviders"
        :key="`available-${provider.provider}`"
        class="identity-line identity-line--hierarchy"
      >
        <div class="identity-line__copy">
          <strong class="identity-line__provider">{{ providerLabel(provider.provider) }}</strong>
          <span class="identity-line__separator" aria-hidden="true">·</span>
          <span class="identity-line__account">未绑定</span>
        </div>
        <template #suffix>
          <n-button
            type="primary"
            text
            :disabled="loading"
            @click="startBinding(provider.provider, route.fullPath)"
            >去绑定</n-button
          >
        </template>
      </n-list-item>
    </n-list>
  </n-spin>
</template>

<style scoped>
.identity-page {
  display: block;
  margin-top: 12px;
}

.identity-line {
  min-height: 52px;
  padding-block: 10px;
}

.identity-line__copy {
  display: flex;
  align-items: baseline;
  min-width: 0;
  gap: 8px;
  font-size: 14px;
  line-height: 1.6;
}

.identity-line__provider {
  color: rgb(31, 34, 37);
  font-size: 15px;
  font-weight: 600;
}

.identity-line__separator,
.identity-line__account {
  color: rgb(118, 124, 130);
}

@media (max-width: 560px) {
  .identity-line__copy {
    align-items: flex-start;
    flex-direction: column;
    gap: 1px;
  }

  .identity-line__separator {
    display: none;
  }
}
</style>
