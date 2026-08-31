<script setup lang="ts">
import UiAlert from '@/components/ui/ui-alert.vue'
import UiAvatar from '@/components/ui/ui-avatar.vue'
import UiButton from '@/components/ui/ui-button.vue'
import UiCard from '@/components/ui/ui-card.vue'
import UiSpinner from '@/components/ui/ui-spinner.vue'
import { useCallbackApp } from '@/composables/useCallbackApp'
import { useUserData } from '@/composables/useUserData'
import { useUserStore } from '@/stores/user'
import { AppStatus } from '@/types'
import { STATUS_DES_MAP } from '@/utils/constants'

defineOptions({ name: 'CallbackIndex' })
const route = useRoute()
const router = useRouter()
const appId = String(route.params.id)
const { loading: userLoading, userData, hasLogin } = useUserData(true)
const { updateToken, updateUserData, updateUserPermissions } = useUserStore()
const { app, appLoading, cbLoading, appError, send, updateApp } = useCallbackApp(appId)
const DATA_ACCESS_LIST = ['邮箱', '用户 ID', '头像', '用户名', '角色（管理员/用户）']
const isAppRunning = computed(() => app.value.meta.status === AppStatus.RUNNING)
const redirect = (name: string) => router.push({ name })
const switchAccount = () => {
  updateUserData()
  updateToken()
  updateUserPermissions([])
  redirect('login')
}
const cancel = () => {
  updateApp()
  redirect('home')
}
</script>

<template>
  <div v-if="appLoading || userLoading" class="grid justify-items-center gap-3 py-20">
    <UiSpinner label="正在读取授权请求" />
  </div>
  <UiCard v-else-if="!appError" class="w-[min(92vw,30rem)]"
    ><template #title>登录到「{{ app.name }}」</template
    ><template #description>确认身份与即将共享的信息</template>
    <div class="grid gap-6">
      <div v-if="hasLogin" class="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
        <UiAvatar
          :src="userData.avatar"
          :alt="userData.nickname"
          :fallback="userData.nickname.slice(0, 2)"
          size="lg"
        />
        <div>
          <strong>{{ userData.nickname }}</strong>
          <p class="text-sm text-muted-foreground">{{ userData.email }}</p>
        </div>
      </div>
      <UiAlert v-else variant="warning" title="当前无登录用户"
        >请先登录或注册，再决定是否授权。</UiAlert
      >
      <section class="grid gap-3 rounded-lg border p-4">
        <h2 class="font-medium">{{ app.name }} 将获得</h2>
        <ul class="grid gap-2 text-sm text-muted-foreground">
          <li
            v-for="item in DATA_ACCESS_LIST"
            :key="item"
            class="flex items-center gap-2 before:size-1.5 before:rounded-full before:bg-foreground"
          >
            {{ item }}
          </li>
        </ul>
      </section>
      <div v-if="isAppRunning" class="grid gap-2">
        <template v-if="hasLogin"
          ><UiButton block :loading="cbLoading" @click="send"
            >使用 {{ userData.nickname }} 登录</UiButton
          ><UiButton block variant="ghost" @click="switchAccount">切换账号</UiButton></template
        ><template v-else
          ><UiButton block @click="redirect('login')">登录</UiButton
          ><UiButton block variant="secondary" @click="redirect('register')"
            >注册</UiButton
          ></template
        >
      </div>
      <UiAlert v-else variant="destructive" title="当前应用不可用">{{
        STATUS_DES_MAP[app.meta.status]
      }}</UiAlert>
    </div></UiCard
  >
  <UiCard v-else class="w-[min(92vw,30rem)]"
    ><div class="grid justify-items-center gap-4 py-4 text-center">
      <UiAlert variant="destructive" title="出了点问题">{{ appError.message }}</UiAlert
      ><UiButton variant="outline" @click="cancel">返回首页</UiButton>
    </div></UiCard
  >
</template>
