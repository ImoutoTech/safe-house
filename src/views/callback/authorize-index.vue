<script setup lang="ts">
import UiAlert from '@/components/ui/ui-alert.vue'
import UiAvatar from '@/components/ui/ui-avatar.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiCard from '@/components/ui/ui-card.vue'
import UiSpinner from '@/components/ui/ui-spinner.vue'
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
const scopeDescriptions: Record<string, string> = {
  openid: '确认你的身份',
  profile: '查看你的基本资料',
  email: '查看你的邮箱地址',
  offline_access: '在你离开后继续访问已授权的信息'
}
</script>

<template>
  <div v-if="pageLoading && !interaction" class="grid justify-items-center py-20">
    <UiSpinner label="正在读取授权范围" />
  </div>
  <UiCard v-else-if="interactionError" class="w-[min(92vw,32rem)]"
    ><div class="grid gap-4">
      <UiAlert variant="warning" title="授权请求不可用">{{ interactionError.message }}</UiAlert
      ><UiButton variant="outline" @click="refresh()">重试</UiButton>
    </div></UiCard
  >
  <UiCard v-else-if="interaction" class="w-[min(92vw,34rem)]"
    ><template #header
      ><div class="grid w-full justify-items-center gap-4 text-center">
        <UiAvatar
          :src="userData.avatar"
          :alt="userName"
          :fallback="userName.slice(0, 1).toUpperCase()"
          size="lg"
        />
        <div class="grid gap-1">
          <h1 class="text-xl font-semibold">登录到 {{ interaction.client.name }}</h1>
          <p class="text-sm text-muted-foreground">
            将使用 <strong class="text-foreground">{{ userName }}</strong> 完成授权
          </p>
        </div>
      </div></template
    >
    <div class="grid gap-5">
      <p v-if="interaction.client.description" class="text-center text-sm text-muted-foreground">
        {{ interaction.client.description }}
      </p>
      <section class="overflow-hidden rounded-lg border" aria-labelledby="permission-title">
        <h2 id="permission-title" class="border-b bg-muted/40 px-4 py-3 text-sm font-medium">
          请求的权限
        </h2>
        <dl class="divide-y">
          <div
            v-for="scope in scopes"
            :key="scope"
            class="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_1fr]"
          >
            <dt class="font-mono text-sm">{{ scope }}</dt>
            <dd class="text-sm text-muted-foreground">
              {{ scopeDescriptions[scope] || '使用此权限范围内的信息' }}
            </dd>
          </div>
        </dl>
      </section>
      <UiAlert v-if="completionError" variant="destructive" title="提交失败"
        >{{ completionError.message }}，请重试。</UiAlert
      >
      <div class="grid grid-cols-2 gap-3">
        <UiButton variant="outline" :disabled="pageLoading" @click="complete(false)">拒绝</UiButton
        ><UiButton :loading="pageLoading" @click="complete(true)">批准并继续</UiButton>
      </div>
    </div></UiCard
  >
</template>
