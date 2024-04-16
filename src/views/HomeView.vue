<script setup lang="ts">
import { getUserData } from '@/api/user'

onMounted(() => {
  getUserData(26).then((res) => {
    console.log('🤔 res 是 ', res)
  })
})
</script>

<template>
  <main>haha</main>
</template>
