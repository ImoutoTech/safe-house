<script setup lang="ts">
import { useNotificationKeys } from '@/composables/useNotificationKeys'
import { PERMISSION_CODE_MAP } from '@/utils/constants'
import { CopyOutline, TrashOutline } from '@vicons/ionicons5'
import { useClipboard } from '@vueuse/core'
import dayjs from 'dayjs'

defineOptions({ name: 'NotificationApiKeys' })

const props = defineProps<{
  appId: string
  active: boolean
}>()

const { keys, loading, createLoading, error, updateApp, refresh, create, toggle, remove } =
  useNotificationKeys()
const plaintextVisible = shallowRef(false)
const plaintext = shallowRef('')
const { copy } = useClipboard()
const message = useMessage()

watch(
  [() => props.active, () => props.appId],
  ([active, appId]) => {
    plaintextVisible.value = false
    plaintext.value = ''
    if (active && appId) void updateApp(appId)
  },
  { immediate: true }
)

watch(plaintextVisible, (visible) => {
  if (!visible) plaintext.value = ''
})

onBeforeUnmount(() => {
  plaintext.value = ''
})

const handleCreate = async () => {
  const value = await create()
  if (!value) return
  plaintext.value = value
  plaintextVisible.value = true
}

const copyPlaintext = async () => {
  if (!plaintext.value) return
  await copy(plaintext.value)
  message.success('通知 API Key 已复制')
}
</script>

<template>
  <section class="notification-keys">
    <n-flex justify="space-between" align="center">
      <div>
        <n-text strong>通知 API Key</n-text>
        <n-text class="notification-keys__description" depth="3">
          仅用于调用通知 API，不复用 OIDC Client Secret。
        </n-text>
      </div>
      <n-button
        v-permission="PERMISSION_CODE_MAP['修改子应用']"
        text
        type="info"
        :loading="createLoading"
        :disabled="loading"
        @click="handleCreate"
      >
        新建
      </n-button>
    </n-flex>

    <n-alert v-if="error" class="notification-keys__alert" type="error" title="加载失败">
      <n-button size="small" @click="refresh">重试</n-button>
    </n-alert>
    <n-spin :show="loading">
      <n-list class="notification-keys__list" bordered hoverable>
        <n-list-item v-for="key in keys" :key="key.id">
          <n-thing :title="key.hint">
            <template #description>
              创建于 {{ dayjs(key.createdAt).format('YYYY-MM-DD HH:mm') }}
              <template v-if="key.lastUsedAt">
                · 最后使用 {{ dayjs(key.lastUsedAt).fromNow() }}
              </template>
            </template>
          </n-thing>
          <template #suffix>
            <n-flex align="center" :wrap="false">
              <n-switch
                v-permission="{
                  permission: PERMISSION_CODE_MAP['修改子应用'],
                  mode: 'disable'
                }"
                :value="key.enabled"
                size="small"
                :disabled="loading"
                :aria-label="`${key.hint}启用状态`"
                @update:value="toggle(key.id, $event)"
              />
              <n-popconfirm
                placement="top-end"
                :negative-text="null"
                positive-text="确认吊销"
                :positive-button-props="{ type: 'error', secondary: true }"
                @positive-click="remove(key.id)"
              >
                <template #trigger>
                  <n-button
                    v-permission="PERMISSION_CODE_MAP['修改子应用']"
                    type="error"
                    size="small"
                    tertiary
                    :disabled="loading"
                    aria-label="吊销通知 API Key"
                  >
                    <n-icon :component="TrashOutline" />
                  </n-button>
                </template>
                吊销后无法恢复，确定继续吗？
              </n-popconfirm>
            </n-flex>
          </template>
        </n-list-item>
        <n-empty v-if="!keys.length && !error" class="notification-keys__empty">
          暂无通知 API Key
        </n-empty>
      </n-list>
    </n-spin>

    <n-modal v-model:show="plaintextVisible" :mask-closable="false">
      <n-card
        class="plaintext-dialog"
        title="保存新的通知 API Key"
        :bordered="false"
        role="dialog"
        aria-modal="true"
      >
        <n-alert type="warning" title="明文仅显示这一次">
          关闭后 Safe House 会立即清除本地临时值，之后只能重新创建 Key。
        </n-alert>
        <n-input-group class="plaintext-dialog__value">
          <n-input :value="plaintext" readonly type="password" show-password-on="click" />
          <n-button type="primary" aria-label="复制通知 API Key" @click="copyPlaintext">
            <template #icon><n-icon :component="CopyOutline" /></template>
            复制
          </n-button>
        </n-input-group>
        <n-flex justify="end">
          <n-button type="primary" @click="plaintextVisible = false">我已保存</n-button>
        </n-flex>
      </n-card>
    </n-modal>
  </section>
</template>

<style scoped lang="scss">
.notification-keys {
  padding-top: 18px;
  border-top: 1px solid rgb(239, 239, 245);
}

.notification-keys__description {
  display: block;
  margin-top: 4px;
}

.notification-keys__alert,
.notification-keys__list {
  margin-top: 12px;
}

.notification-keys__empty {
  margin: 20px 0;
}

.plaintext-dialog {
  width: min(560px, 95vw);
}

.plaintext-dialog__value {
  margin: 20px 0;
}
</style>
