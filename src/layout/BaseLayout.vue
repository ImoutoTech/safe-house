<template>
  <n-layout position="absolute">
    <n-layout-header class="layout-header" bordered>
      <n-flex justify="center" align="center">
        <span class="layout-header-title">{{ ENV.TITLE }}</span>
      </n-flex>
    </n-layout-header>
    <n-layout position="absolute" class="layout-content">
      <n-layout :native-scrollbar="false">
        <router-view></router-view>
      </n-layout>
    </n-layout>
    <n-layout-footer class="layout-footer" bordered position="absolute">
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
    </n-layout-footer>
  </n-layout>
</template>
<script setup lang="ts">
import { ENV } from '@/utils/constants'
import { CodeSlashOutline as Code } from '@vicons/ionicons5'
import dayjs from 'dayjs'
</script>
<style lang="scss" scoped>
$headerHeight: 64px;
$footerHeight: 64px;

.layout-content {
  top: $headerHeight;
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
