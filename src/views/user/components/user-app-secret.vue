<template>
  <n-modal v-model:show="visible">
    <n-card
      class="common-dialog credential-dialog"
      title="子应用凭据"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <n-flex vertical>
        <div>
          <n-text strong>应用名</n-text>
          <n-p class="user-app-name">{{ app?.name }}</n-p>
        </div>

        <n-flex justify="space-between" align="center">
          <div>
            <n-text strong>OIDC Client Secret</n-text>
            <n-text class="credential-description" depth="3">用于 OIDC 客户端认证。</n-text>
          </div>
          <n-button
            v-permission="PERMISSION_CODE_MAP['修改子应用']"
            text
            type="info"
            :loading="createLoading"
            @click="create"
            >新建</n-button
          >
        </n-flex>

        <n-spin :show="loading">
          <n-list bordered hoverable>
            <n-list-item v-for="secret in secrets" :key="secret.value">
              {{ secret.value }}

              <template #suffix>
                <n-flex align="center" :wrap="false">
                  <n-tooltip>
                    <template #trigger>
                      <n-switch
                        v-permission="{
                          permission: PERMISSION_CODE_MAP['修改子应用'],
                          mode: 'disable'
                        }"
                        :value="secret.enabled"
                        size="small"
                        @update:value="toggle(secret.id)"
                      />
                    </template>
                    是否启用
                  </n-tooltip>
                  <n-popconfirm
                    placement="top-end"
                    :negative-text="null"
                    positive-text="确认"
                    :positive-button-props="{ type: 'error', secondary: true }"
                    @positive-click="del(secret.id)"
                  >
                    <template #trigger>
                      <n-button
                        v-permission="PERMISSION_CODE_MAP['修改子应用']"
                        type="error"
                        size="small"
                        tertiary
                      >
                        <n-icon :component="TrashOutline"></n-icon>
                      </n-button>
                    </template>
                    确定要删除该秘钥吗
                  </n-popconfirm>
                </n-flex>
              </template>
            </n-list-item>

            <n-empty v-if="!secrets.length" class="user-app-secrets-empty">暂无秘钥</n-empty>
          </n-list>
        </n-spin>
        <NotificationApiKeys v-if="app" :app-id="app.id" :active="Boolean(visible)" />
      </n-flex>
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
import { useAppSecret } from '@/composables/useAppSecret'
import { TrashOutline } from '@vicons/ionicons5'
import { type AppInfo } from '@/types'
import { PERMISSION_CODE_MAP } from '@/utils/constants'
import NotificationApiKeys from './notification-api-keys.vue'

defineOptions({
  name: 'UserAppSecret'
})

const visible = defineModel('visible', { type: Boolean })
const props = defineProps<{
  app?: AppInfo
}>()

const { data, loading, createLoading, updateApp, create, del, toggle } = useAppSecret()

const secrets = computed(() => data.value?.data || [])

watch(
  () => visible.value,
  (val) => {
    if (props.app && val) {
      updateApp(props.app.id)
    }
  },
  {
    immediate: true
  }
)
</script>
<style scoped lang="scss">
.user-app-name {
  margin-top: 0;
}

.user-app-secrets-empty {
  margin: 20px 0;
}

.credential-description {
  display: block;
  margin-top: 4px;
}

.credential-dialog {
  display: flex;
  width: min(640px, 95vw);
  max-height: 90vh;
  max-height: 90dvh;
}

.credential-dialog :deep(.n-card__content) {
  min-height: 0;
  overflow-y: auto;
}
</style>
