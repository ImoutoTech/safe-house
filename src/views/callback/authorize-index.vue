<script setup lang="ts">
import { useOidcInteraction } from '@/composables/useOidcInteraction'
import { useUserData } from '@/composables/useUserData'

defineOptions({ name: 'AuthorizeIndex' })
const route = useRoute()
const uid = String(route.params.uid ?? '')
const { interaction, loading, interactionError, completionError, complete, refresh } =
  useOidcInteraction(uid)
const { loading: userLoading, userData } = useUserData(true)
const pageLoading = computed(() => loading.value || userLoading.value)
const scopes = computed(() => interaction.value?.scope.split(' ').filter(Boolean) ?? [])
const userName = computed(() => userData.value.nickname || userData.value.email)
const avatarFallback = computed(() => userName.value.slice(0, 1).toUpperCase())

const scopeDescriptions: Record<string, string> = {
  openid: '确认你的身份',
  profile: '查看你的基本资料',
  email: '查看你的邮箱地址',
  offline_access: '在你离开后继续访问已授权的信息'
}

const decide = async (approved: boolean) => {
  await complete(approved)
}
</script>

<template>
  <n-spin :show="pageLoading">
    <n-result
      v-if="interactionError"
      status="warning"
      title="授权请求不可用"
      :description="interactionError.message"
    >
      <template #footer><n-button @click="refresh()">重试</n-button></template>
    </n-result>
    <main v-else-if="interaction" class="interaction-page">
      <n-flex vertical align="center" :size="24">
        <n-avatar v-if="userData.avatar" round :size="72" :src="userData.avatar" />
        <n-avatar v-else round :size="72">
          {{ avatarFallback }}
        </n-avatar>
        <p class="login-relation">
          <strong>{{ userName }}</strong>
          正在登录到
          <strong>{{ interaction.client.name }}</strong>
        </p>
        <p v-if="interaction.client.description" class="client-description">
          {{ interaction.client.description }}
        </p>
        <section class="permission-section" aria-labelledby="permission-title">
          <h2 id="permission-title" class="permission-title">相关权限</h2>
          <n-table :single-line="false" size="small">
            <thead>
              <tr>
                <th>权限</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="scope in scopes" :key="scope">
                <td>{{ scope }}</td>
                <td>{{ scopeDescriptions[scope] || '使用此权限范围内的信息' }}</td>
              </tr>
            </tbody>
          </n-table>
        </section>
        <n-alert v-if="completionError" class="completion-error" type="error" title="提交失败">
          {{ completionError.message }}，请重试。
        </n-alert>
        <n-flex class="interaction-actions" :wrap="false">
          <n-button block :disabled="pageLoading" @click="decide(false)">取消</n-button>
          <n-button block type="primary" :loading="pageLoading" @click="decide(true)">
            继续
          </n-button>
        </n-flex>
      </n-flex>
    </main>
  </n-spin>
</template>

<style scoped lang="scss">
.interaction-page {
  width: min(92vw, 520px);
  padding: 32px 0;
}

.login-relation {
  margin: 0;
  text-align: center;
  font-size: 18px;
}

.client-description {
  margin: -12px 0 0;
  opacity: 0.72;
  text-align: center;
}

.permission-section,
.completion-error,
.interaction-actions {
  width: 100%;
}

.permission-title {
  margin: 0 0 12px;
  font-size: 16px;
}

.interaction-actions :deep(.n-button) {
  flex: 1;
}

@media (max-width: 768px) {
  .interaction-page {
    padding: 24px 16px;
  }
}
</style>
