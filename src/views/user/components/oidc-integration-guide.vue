<template>
  <n-modal v-model:show="visible">
    <n-card
      class="oidc-guide-dialog"
      title="OIDC / SSO 接入说明"
      :bordered="false"
      role="dialog"
      aria-modal="true"
      closable
      @close="visible = false"
    >
      <iframe class="oidc-guide-frame" :src="guidePath" title="OIDC / SSO 接入说明"></iframe>

      <template #footer>
        <n-flex class="oidc-guide-toolbar" justify="end">
          <n-button secondary @click="copyGuideLink">
            <template #icon>
              <n-icon :component="LinkOutline" />
            </template>
            复制链接
          </n-button>
          <n-button
            tag="a"
            secondary
            :href="guidePath"
            download="third-party-oidc-integration-guide.html"
          >
            <template #icon>
              <n-icon :component="DownloadOutline" />
            </template>
            下载 HTML
          </n-button>
        </n-flex>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { DownloadOutline, LinkOutline } from '@vicons/ionicons5'

defineOptions({
  name: 'OidcIntegrationGuide'
})

const visible = defineModel('visible', { type: Boolean })
const message = useMessage()
const guidePath = `${import.meta.env.BASE_URL}third-party-oidc-integration-guide.html`

const copyGuideLink = async () => {
  const guideUrl = new URL(guidePath, window.location.href).href

  try {
    await navigator.clipboard.writeText(guideUrl)
    message.success('说明链接已复制')
  } catch {
    message.error('复制失败，请稍后重试')
  }
}
</script>

<style scoped lang="scss">
.oidc-guide-dialog {
  display: flex;
  flex-direction: column;
  width: min(1200px, calc(100vw - 48px));
  height: calc(100vh - 48px);
  height: calc(100dvh - 48px);
  border-radius: 3px;

  :deep(.n-card__content) {
    display: flex;
    flex: 1;
    min-height: 0;
    padding: 0;
  }
}

.oidc-guide-frame {
  width: 100%;
  height: 100%;
  border: 0;
  background: #fff;
}

.oidc-guide-toolbar {
  flex-wrap: wrap;
  padding-top: 12px;
}

@media (max-width: 768px) {
  .oidc-guide-dialog {
    width: calc(100vw - 16px);
    height: calc(100vh - 16px);
    height: calc(100dvh - 16px);
  }

  .oidc-guide-toolbar :deep(.n-button) {
    flex: 1;
  }
}
</style>
