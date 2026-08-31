<script setup lang="ts">
import { Code2 } from 'lucide-vue-next'
import dayjs from 'dayjs'
import UiBadge from '@/components/ui/ui-badge.vue'
import { ENV } from '@/utils/constants'

defineOptions({ name: 'BaseLayout' })
const router = useRouter()
</script>

<template>
  <div class="grid min-h-dvh grid-rows-[4rem_minmax(0,1fr)_auto] bg-muted/20">
    <!-- THESIS: Safe House is a calm digital foyer; refuse the generic enterprise dashboard. OWN-WORLD: Origin New York neutral surfaces, crisp borders, compact controls. STORY: recognize the house, complete the identity task, understand the security consequence. FIRST VIEWPORT: centered product masthead over a focused task surface. FORM: operational identity workspace, seed safe-house-origin-neutral. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->
    <header
      class="sticky top-0 z-30 flex items-center justify-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <button
        class="rounded-md px-3 py-2 text-xl font-semibold tracking-tight outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        @click="router.push('/')"
      >
        {{ ENV.TITLE }}
      </button>
    </header>
    <main class="min-h-0"><router-view /></main>
    <footer
      class="flex min-h-14 flex-wrap items-center justify-between gap-2 border-t bg-background px-4 py-3 text-xs text-muted-foreground sm:px-6"
    >
      <span
        >Copyright © {{ ENV.COPYRIGHT.YEAR }} - {{ dayjs().format('YYYY') }} ·
        <strong class="text-foreground">{{ ENV.COPYRIGHT.NAME }}</strong></span
      >
      <div class="flex items-center gap-3">
        <UiBadge variant="secondary"
          ><Code2 class="size-3" aria-hidden="true" />{{ ENV.BUILD.COMMIT }}@{{
            ENV.BUILD.BRANCH
          }}</UiBadge
        ><span class="hidden sm:inline">Made with ❤️ by youranreus</span>
      </div>
    </footer>
  </div>
</template>
