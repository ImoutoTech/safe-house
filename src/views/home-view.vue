<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import UiButton from '@/components/ui/ui-button.vue'
import { useConfig } from '@/composables/useConfig'
import { useUserData } from '@/composables/useUserData'
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
import { useUserStore } from '@/stores/user'

defineOptions({ name: 'HomeView' })
const router = useRouter()
const { config } = useConfig(true)
const userStore = useUserStore()
useUserData(true)
const defaultActions = {
  register: { btn: '注册', description: '注册新账号' },
  login: { btn: '登录', description: '登录已有账号' }
}
const displayTitle = computed(() =>
  config.value?.title?.length ? config.value.title : ['少女祈祷中']
)
const registerAction = computed(() => config.value?.register ?? defaultActions.register)
const loginAction = computed(() => config.value?.login ?? defaultActions.login)
const handleDirect = (name: 'login' | 'register') =>
  router.push(name === 'login' && userStore.hasLogin ? { name: 'user-layout' } : { name })
</script>

<template>
  <FlexCenterLayout>
    <section class="grid w-full max-w-2xl justify-items-center gap-8 text-center">
      <h1 class="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
        <span v-for="line in displayTitle" :key="line" class="block">{{ line }}</span>
      </h1>
      <div class="flex flex-wrap justify-center gap-3">
        <UiButton
          v-if="!userStore.hasLogin"
          :title="registerAction.description"
          variant="secondary"
          @click="handleDirect('register')"
          >{{ registerAction.btn }}</UiButton
        >
        <UiButton :title="loginAction.description" @click="handleDirect('login')"
          >{{ userStore.hasLogin ? '进入我的空间' : loginAction.btn
          }}<ArrowRight aria-hidden="true"
        /></UiButton>
      </div>
    </section>
  </FlexCenterLayout>
</template>
