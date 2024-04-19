<template>
  <div class="user-info">
    <n-descriptions label-placement="top" :columns="2">
      <n-descriptions-item label="邮箱"> {{ userData.email }} </n-descriptions-item>
      <n-descriptions-item label="ID"> {{ userData.id }} </n-descriptions-item>
      <n-descriptions-item label="加入时间">
        {{ dayjs(userData.created_at).format('YYYY-MM-DD') }}
      </n-descriptions-item>
      <n-descriptions-item label="上次编辑于">
        {{ dayjs(userData.updated_at).format('YYYY-MM-DD') }}
      </n-descriptions-item>
    </n-descriptions>
    <n-divider></n-divider>
    <n-flex justify="space-between">
      <n-button type="info" secondary @click="modifyVisible = true">编辑</n-button>
      <n-button type="error" secondary @click="logout">退出登录</n-button>
    </n-flex>
  </div>
  <user-data-modify v-model:visible="modifyVisible"></user-data-modify>
</template>
<script lang="ts" setup>
import UserDataModify from './components/user-data-modify.vue'
import { useUserData } from '@/composables/useUserData'
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'

defineOptions({
  name: 'UserInfo'
})

const router = useRouter()
const { userData } = useUserData()
const { updateUserData, updateToken } = useUserStore()

const modifyVisible = ref(false)

const logout = () => {
  updateUserData()
  updateToken()
  router.push('/')
}
</script>
<style lang="scss" scoped>
.user-info {
  margin-top: 8px;
}
</style>
