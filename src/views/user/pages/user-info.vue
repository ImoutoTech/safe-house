<script setup lang="ts">
import dayjs from 'dayjs'
import UiButton from '@/components/ui/ui-button.vue'
import { useUserData } from '@/composables/useUserData'
import { useUserStore } from '@/stores/user'
import { PERMISSION_CODE_MAP } from '@/utils/constants'
import UserDataModify from '../components/user-data-modify.vue'

defineOptions({ name: 'UserInfo' })
const router = useRouter()
const { userData } = useUserData()
const { updateUserData, updateToken, updateUserPermissions } = useUserStore()
const modifyVisible = shallowRef(false)
const facts = computed(() => [
  { label: '邮箱', value: userData.value.email },
  { label: '用户 ID', value: userData.value.id },
  { label: '加入时间', value: dayjs(userData.value.created_at).format('YYYY-MM-DD') },
  { label: '上次编辑', value: dayjs(userData.value.updated_at).format('YYYY-MM-DD') }
])
const logout = () => {
  updateUserData()
  updateToken()
  updateUserPermissions([])
  router.push('/')
}
</script>

<template>
  <section class="grid gap-6">
    <dl class="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2">
      <div v-for="fact in facts" :key="fact.label" class="grid gap-1 bg-background p-4">
        <dt class="text-xs font-medium text-muted-foreground">{{ fact.label }}</dt>
        <dd class="break-all text-sm">{{ fact.value }}</dd>
      </div>
    </dl>
    <div class="flex flex-wrap justify-between gap-3 border-t pt-5">
      <UiButton
        v-permission="PERMISSION_CODE_MAP['修改用户']"
        variant="outline"
        @click="modifyVisible = true"
        >编辑资料</UiButton
      ><UiButton variant="destructive" @click="logout">退出登录</UiButton>
    </div>
  </section>
  <UserDataModify v-model:visible="modifyVisible" />
</template>
