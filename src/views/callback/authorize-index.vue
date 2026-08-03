<script setup lang="ts">
import { useOidcInteraction } from '@/composables/useOidcInteraction'
import { useUserStore } from '@/stores/user'

defineOptions({ name: 'AuthorizeIndex' })
const route = useRoute()
const router = useRouter()
const uid = String(route.params.uid ?? '')
const { interaction, loading, error, complete, refresh } = useOidcInteraction(uid)
const userStore = useUserStore()
const scopes = computed(() => interaction.value?.scope.split(' ').filter(Boolean) ?? [])

const decide = async (approved: boolean) => {
  await complete(approved)
}
</script>

<template>
  <n-spin :show="loading">
    <n-result v-if="error" status="warning" title="授权请求不可用" :description="error.message">
      <template #footer><n-button @click="refresh()">重试</n-button></template>
    </n-result>
    <n-card v-else-if="interaction" class="interaction-card">
      <n-flex vertical :size="24">
        <n-thing
          :title="`登录到「${interaction.client.name}」`"
          :description="interaction.client.description || undefined"
        />
        <n-alert v-if="!userStore.hasLogin" type="warning" title="请先登录">
          登录后将回到本授权请求。
        </n-alert>
        <n-card embedded title="应用将获得">
          <n-ul
            ><n-li v-for="scope in scopes" :key="scope">{{ scope }}</n-li></n-ul
          >
        </n-card>
        <n-flex v-if="userStore.hasLogin" justify="end">
          <n-button :disabled="loading" @click="decide(false)">拒绝</n-button>
          <n-button type="primary" :loading="loading" @click="decide(true)">批准</n-button>
        </n-flex>
        <n-button
          v-else
          type="primary"
          @click="router.push({ name: 'login', query: { return_to: route.fullPath } })"
          >登录</n-button
        >
      </n-flex>
    </n-card>
  </n-spin>
</template>

<style scoped>
.interaction-card {
  width: min(92vw, 460px);
}
</style>
