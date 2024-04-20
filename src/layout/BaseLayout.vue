<template>
  <n-layout position="absolute">
    <n-layout-header class="layout-header" bordered>
      <n-flex justify="center" align="center">
        <span class="layout-header-title" @click="router.push('/')">{{ ENV.TITLE }}</span>
      </n-flex>
    </n-layout-header>
    <n-layout position="absolute" class="layout-content-wrapper">
      <router-view></router-view>
    </n-layout>
    <n-layout-footer class="layout-footer" bordered position="absolute">
      <template v-if="!isMobile">
        <n-flex align="center">
          <span> Copyright © {{ ENV.COPYRIGHT.YEAR }} - {{ dayjs().format('YYYY') }} </span>
          <n-text strong>{{ ENV.COPYRIGHT.NAME }}</n-text>
          <n-tag :bordered="false" type="warning">
            <template #icon>
              <n-icon :component="Code" />
            </template>
            {{ ENV.BUILD.COMMIT }}@{{ ENV.BUILD.BRANCH }}
          </n-tag>
        </n-flex>

        <span>Made with ❤️ by youranreus</span>
      </template>
      <template v-else>
        <n-tag :bordered="false" type="warning">
          <template #icon>
            <n-icon :component="Code" />
          </template>
          {{ ENV.BUILD.COMMIT }}@{{ ENV.BUILD.BRANCH }}
        </n-tag>
        <span>Made with ❤️ by youranreus</span>
      </template>
    </n-layout-footer>
  </n-layout>
</template>
<script setup lang="ts">
import { useConfigStore } from '@/stores/config'
import { ENV } from '@/utils/constants'
import { CodeSlashOutline as Code } from '@vicons/ionicons5'
import dayjs from 'dayjs'

defineOptions({
  name: 'BaseLayout'
})

const router = useRouter()
const { isMobile } = useConfigStore()
</script>
<style lang="scss" scoped>
$headerHeight: 64px;
$footerHeight: 64px;

.layout-content-wrapper {
  top: $headerHeight;
  height: calc(100% - $headerHeight - $footerHeight);
  bottom: $footerHeight;
}

.layout-header {
  height: $headerHeight;

  .n-flex {
    height: 100%;
  }

  &-title {
    font-size: 28px;
    font-weight: 600;
    user-select: none;
    cursor: pointer;
  }
}

.layout-footer {
  height: $footerHeight;
  line-height: $footerHeight;
  padding-inline: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
