<script setup lang="ts">
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
import { useConfig } from '@/composables/useConfig'
import { useUserStore } from '@/stores/user'
import { useUserData } from '@/composables/useUserData'

defineOptions({
  name: 'HomeView'
})

const router = useRouter()

const { config } = useConfig(true)
const userStore = useUserStore()
useUserData(true)

const defaultActions = {
  register: {
    btn: '注册',
    description: '注册新账号'
  },
  login: {
    btn: '登录',
    description: '登录已有账号'
  }
}

const displayTitle = computed(() =>
  config.value?.title?.length ? config.value.title : ['少女祈祷中']
)
const registerAction = computed(() => config.value?.register ?? defaultActions.register)
const loginAction = computed(() => config.value?.login ?? defaultActions.login)

const handleDirect = (name: 'login' | 'register') => {
  if (name === 'login' && userStore.hasLogin) {
    router.push({ name: 'user-layout' })
    return
  }

  router.push({ name })
}
</script>

<template>
  <flex-center-layout>
    <main>
      <n-flex vertical :size="24">
        <span v-for="line in displayTitle" :key="line" class="welcome-title">
          {{ line }}
        </span>
        <n-flex justify="center" :size="24">
          <n-tooltip v-if="!userStore.hasLogin" trigger="hover">
            <template #trigger>
              <n-button strong secondary type="primary" @click="handleDirect('register')">
                {{ registerAction.btn }}
              </n-button>
            </template>
            {{ registerAction.description }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button strong tertiary @click="handleDirect('login')">
                {{ loginAction.btn }}
              </n-button>
            </template>
            {{ loginAction.description }}
          </n-tooltip>
        </n-flex>
      </n-flex>
    </main>
  </flex-center-layout>
</template>
