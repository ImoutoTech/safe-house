<template>
  <n-spin :show="appLoading || userLoading">
    <n-card v-if="!appError" class="callback">
      <n-flex vertical :size="32">
        <div class="callback-title">登录到「{{ app.name }}」</div>
        <div v-if="hasLogin" class="callback-avatar">
          <n-avatar v-if="userData.avatar" :size="128" round :src="userData.avatar"></n-avatar>
          <n-avatar v-else :size="128" round>{{ userData.nickname.slice(0, 3) }}</n-avatar>
        </div>
        <n-alert v-else title="当前无登录用户" type="warning" :bordered="false"></n-alert>
        <n-card embedded size="small" :title="`${app.name}将获得你的部分信息`" :bordered="false">
          <n-ul>
            <n-li v-for="item in DATA_ACCESS_LIST" :key="item">{{ item }}</n-li>
          </n-ul>
        </n-card>
        <n-flex v-if="isAppRunning" vertical :size="16">
          <template v-if="hasLogin">
            <n-button block type="info" secondary :loading="cbLoading" @click="authorize">
              使用{{ userData.nickname }}登录
            </n-button>
            <n-button block type="warning" text @click="switchAccount">切换账号</n-button>
          </template>
          <template v-else>
            <n-button block type="info" secondary @click="redirect('login')">登录</n-button>
            <n-button block type="warning" text @click="redirect('register')">注册</n-button>
          </template>
        </n-flex>
        <n-alert v-else title="当前应用不可用" type="error" :bordered="false">
          {{ STATUS_DES_MAP[app.meta.status] }}
        </n-alert>
      </n-flex>
    </n-card>
    <n-result v-else status="500" title="出了点问题" :description="appError.message">
      <template #footer>
        <n-button text type="info" @click="cancel">返回首页</n-button>
      </template>
    </n-result>
  </n-spin>
</template>
<script setup lang="ts">
import { useAuthorizeApp } from '@/composables/useAuthorizeApp'
import { useUserData } from '@/composables/useUserData'
import { useUserStore } from '@/stores/user'
import { AppStatus, type AuthorizeParam } from '@/types'
import { STATUS_DES_MAP } from '@/utils/constants'

defineOptions({
  name: 'AuthorizeIndex'
})

const route = useRoute()
const router = useRouter()
const appParams = ref<AuthorizeParam>({
  client_id: String(route.query.client_id),
  redirect_uri: String(route.query.redirect_uri),
  state: String(route.query.state) === 'undefined' ? '' : String(route.query.state)
})
const { loading: userLoading, userData, hasLogin } = useUserData(true)
const { updateToken, updateUserData } = useUserStore()

const { app, appLoading, cbLoading, appError, authorize, updateApp } = useAuthorizeApp(
  appParams.value.client_id,
  appParams.value.state,
  appParams.value.redirect_uri
)

const DATA_ACCESS_LIST = ['邮箱', '用户ID', '头像', '用户名', '角色（管理员/用户）']

const isAppRunning = computed(() => app.value.meta.status === AppStatus.RUNNING)

const redirect = (name: string) => {
  router.push({ name })
}

const switchAccount = () => {
  updateUserData()
  updateToken()
  redirect('login')
}

const cancel = () => {
  updateApp()
  redirect('home')
}
</script>
<style scoped lang="scss">
.callback {
  width: 400px;

  &-title {
    font-size: 24px;
    font-weight: 500;
    text-align: center;
  }

  &-avatar {
    text-align: center;
  }
}
</style>
