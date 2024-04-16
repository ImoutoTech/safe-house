<template>
  <n-flex class="flex-center-layout" justify="center" align="center">
    <slot v-if="type === 'slot'" />
    <router-view v-if="type === 'router'"></router-view>
  </n-flex>
</template>
<script setup lang="ts">
defineOptions({
  name: 'FlexCenterLayout'
})

withDefaults(
  defineProps<{
    type?: 'router' | 'slot'
  }>(),
  {
    type: 'slot'
  }
)
</script>
<style lang="scss" scoped>
.flex-center-layout {
  width: 100%;
  height: 100%;
}
</style>
