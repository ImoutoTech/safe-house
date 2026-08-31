<script setup lang="ts">
import { Download, Link } from 'lucide-vue-next'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import UiButton from '@/components/ui/ui-button.vue'
import UiDialog from '@/components/ui/ui-dialog.vue'
import { useFeedback } from '@/composables/useFeedback'

defineOptions({ name: 'OidcIntegrationGuide' })
const visible = defineModel('visible', { type: Boolean })
const feedback = useFeedback()
const activeGuide = shallowRef<'login' | 'notification'>('login')
const guides = {
  login: {
    path: `${import.meta.env.BASE_URL}third-party-oidc-integration-guide.html`,
    fileName: 'third-party-oidc-integration-guide.html',
    iframeTitle: 'H 登录接入说明'
  },
  notification: {
    path: `${import.meta.env.BASE_URL}third-party-notification-integration-guide.html`,
    fileName: 'third-party-notification-integration-guide.html',
    iframeTitle: 'H 通知服务接入说明'
  }
} as const
const currentGuide = computed(() => guides[activeGuide.value])
watch(visible, (shown) => {
  if (shown) activeGuide.value = 'login'
})
const copyGuideLink = async () => {
  try {
    await navigator.clipboard.writeText(new URL(currentGuide.value.path, window.location.href).href)
    feedback.success('说明链接已复制')
  } catch {
    feedback.error('复制失败，请稍后重试')
  }
}
</script>

<template>
  <UiDialog
    v-model:open="visible"
    title="接入说明"
    class="h-[calc(100vh-2rem)] h-[calc(100dvh-2rem)] max-w-6xl"
    ><TabsRoot v-model="activeGuide" class="flex h-full min-h-0 flex-col">
      <TabsList class="flex shrink-0 border-b" aria-label="接入说明类型">
        <TabsTrigger
          value="login"
          class="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=active]:border-foreground data-[state=active]:text-foreground"
          >登录接入</TabsTrigger
        ><TabsTrigger
          value="notification"
          class="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=active]:border-foreground data-[state=active]:text-foreground"
          >通知服务</TabsTrigger
        >
      </TabsList>
      <TabsContent value="login" class="flex min-h-0 flex-1 flex-col outline-none">
        <iframe
          class="h-full w-full border-0 bg-white"
          :src="guides.login.path"
          :title="guides.login.iframeTitle"
        />
      </TabsContent>
      <TabsContent value="notification" class="flex min-h-0 flex-1 flex-col outline-none">
        <iframe
          class="h-full w-full border-0 bg-white"
          :src="guides.notification.path"
          :title="guides.notification.iframeTitle"
        />
      </TabsContent>
    </TabsRoot>
    <template #footer
      ><UiButton variant="outline" @click="copyGuideLink"><Link />复制链接</UiButton
      ><UiButton
        as="a"
        variant="outline"
        :href="currentGuide.path"
        :download="currentGuide.fileName"
        ><Download />下载 HTML</UiButton
      ></template
    ></UiDialog
  >
</template>
