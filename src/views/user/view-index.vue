<template>
  <flex-center-layout>
    <div class="user-container">
      <n-card>
        <n-flex vertical>
          <n-thing>
            <template #avatar>
              <n-avatar v-if="userData.avatar" :size="64" :src="userData.avatar"></n-avatar>
              <n-avatar v-else :size="64">{{ userData.nickname.slice(0, 1) }}</n-avatar>
            </template>
            <template #header>{{ userData.nickname }}</template>
            <template #header-extra>
              <n-tag circle size="small" :bordered="false" type="info"> #{{ userData.id }} </n-tag>
            </template>
            <template #description>
              <n-flex>
                <user-role-tag :role="userData.role"></user-role-tag>
              </n-flex>
            </template>
          </n-thing>
          <n-tabs type="line" :value="tabValue" @update:value="router.push({ name: $event })">
            <n-tab v-for="item in tabList" :key="item.value" :name="item.value">
              {{ item.name }}
            </n-tab>
          </n-tabs>
          <router-view></router-view>
        </n-flex>
      </n-card>
    </div>
  </flex-center-layout>
</template>
<script setup lang="ts">
import UserRoleTag from '@/components/user-role-tag.vue'
import { useUserData } from '@/composables/useUserData'
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
import { userRoutes } from '@/router/user-routes'

defineOptions({
  name: 'UserIndex'
})
const route = useRoute()
const router = useRouter()
const tabValue = ref('')
const { userData } = useUserData(true)

const tabList = computed(() =>
  userRoutes.map((r) => ({
    name: r.meta?.title || '',
    value: r.name as string
  }))
)

watch(
  () => route.name,
  (val) => {
    tabValue.value = val as string
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
.user-container {
  width: 768px;

  padding: 60px 0;

  @media (max-width: 768px) {
    width: 95%;
  }
}
</style>
