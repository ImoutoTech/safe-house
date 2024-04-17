<template>
  <flex-center-layout>
    <div class="user-container">
      <n-flex vertical>
        <n-flex justify="center">
          <n-tabs
            :value="tabValue"
            class="user-tab"
            type="segment"
            @update:value="router.push({ name: $event })"
          >
            <n-tab v-for="item in tabList" :key="item.value" :name="item.value">{{
              item.name
            }}</n-tab>
          </n-tabs>
        </n-flex>
        <router-view></router-view>
      </n-flex>
    </div>
  </flex-center-layout>
</template>
<script setup lang="ts">
import FlexCenterLayout from '@/layout/FlexCenterLayout.vue'
import { userRoutes } from '@/router/user-routes'
import { useThemeVars } from 'naive-ui'

defineOptions({
  name: 'UserIndex'
})

const theme = useThemeVars()
const route = useRoute()
const router = useRouter()
const tabValue = ref('')

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

  .user-tab {
    width: v-bind('`${tabList.length * 120}px`');

    :deep(.n-tabs-rail) {
      background-color: v-bind('theme.bodyColor');
    }
    :deep(.n-tabs-capsule) {
      background-color: v-bind('theme.tabColor');
      box-shadow: none;
    }
  }
}
</style>
