<script setup lang="ts">
import dayjs from 'dayjs'
import UiTooltip from '@/components/ui/ui-tooltip.vue'
import { ENV } from '@/utils/constants'

defineOptions({ name: 'BaseLayout' })
const buildLabel = `${ENV.BUILD.COMMIT}@${ENV.BUILD.BRANCH}`
</script>

<template>
  <div class="grid min-h-dvh grid-rows-[auto_minmax(0,1fr)_auto] bg-muted/20">
    <!-- THESIS: Safe House is a calm digital foyer; refuse the generic enterprise dashboard. OWN-WORLD: Origin New York neutral surfaces, crisp borders, compact controls. STORY: recognize the house, complete the identity task, understand the security consequence. FIRST VIEWPORT: centered product masthead over a focused task surface. FORM: operational identity workspace, seed safe-house-origin-neutral. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->
    <header class="flex justify-center px-4 pb-2 pt-8 sm:pt-10">
      <RouterLink
        to="/"
        class="min-w-0 max-w-full rounded-sm px-2 py-1 text-center text-xl font-semibold tracking-tight break-words outline-none transition-colors hover:text-foreground/70 focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {{ ENV.TITLE }}
      </RouterLink>
    </header>
    <main class="min-h-0"><router-view /></main>
    <footer>
      <div
        class="mx-auto flex w-full max-w-4xl flex-col gap-1.5 px-4 py-3 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-baseline md:justify-between md:gap-6"
      >
        <p>
          Copyright © {{ ENV.COPYRIGHT.YEAR }} - {{ dayjs().format('YYYY') }} ·
          {{ ENV.COPYRIGHT.NAME }}
        </p>
        <UiTooltip :content="buildLabel" class="font-mono">
          <button
            type="button"
            class="w-fit cursor-help rounded-sm text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-right"
          >
            Made with ❤️ by youranreus
          </button>
        </UiTooltip>
      </div>
    </footer>
  </div>
</template>
