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
  <n-spin :show="loading">
    <n-flex v-if="error" vertical align="start">
      <n-alert type="error" title="身份操作失败">{{ error.message }}</n-alert>
      <n-button @click="refresh()">重试</n-button>
    </n-flex>
    <n-empty v-else-if="!identities.length" description="尚未绑定外部身份" />
    <n-list v-else bordered>
      <n-list-item v-for="identity in identities" :key="identity.id">
        <n-thing
          :title="identity.provider"
          :description="identity.email || identity.displayName || '已绑定'"
        />
        <template #suffix>
          <n-button type="error" text :disabled="loading" @click="confirmUnbind(identity)"
            >解绑</n-button
          >
        </template>
      </n-list-item>
    </n-list>
    <n-flex class="bind-actions" wrap>
      <n-button
        v-for="provider in availableProviders"
        :key="provider.provider"
        :disabled="loading"
        @click="startBinding(provider.provider, route.fullPath)"
      >
        绑定 {{ provider.provider }}
      </n-button>
    </n-flex>
  </n-spin>
</template>

<style scoped>
.bind-actions {
  margin-top: 16px;
}
</style>
