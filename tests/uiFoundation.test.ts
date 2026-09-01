import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const buttonSource = readFileSync(
  new URL('../src/components/ui/ui-button.vue', import.meta.url),
  'utf8'
)
const dialogSource = readFileSync(
  new URL('../src/components/ui/ui-dialog.vue', import.meta.url),
  'utf8'
)
const validationSource = readFileSync(
  new URL('../src/composables/useFormValidation.ts', import.meta.url),
  'utf8'
)
const mainSource = readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8')
const radioCardsSource = readFileSync(
  new URL('../src/components/ui/ui-radio-cards.vue', import.meta.url),
  'utf8'
)
const radioItemSource = readFileSync(
  new URL('../src/components/ui/ui-radio-group-item.vue', import.meta.url),
  'utf8'
)
const userAppItemSource = readFileSync(
  new URL('../src/views/user/components/user-app-item.vue', import.meta.url),
  'utf8'
)
const tooltipSource = readFileSync(
  new URL('../src/components/ui/ui-tooltip.vue', import.meta.url),
  'utf8'
)
const baseLayoutSource = readFileSync(
  new URL('../src/layout/BaseLayout.vue', import.meta.url),
  'utf8'
)
const tabsSource = readFileSync(
  new URL('../src/components/ui/ui-tabs.vue', import.meta.url),
  'utf8'
)
const tabsListSource = readFileSync(
  new URL('../src/components/ui/ui-tabs-list.vue', import.meta.url),
  'utf8'
)
const tabsTriggerSource = readFileSync(
  new URL('../src/components/ui/ui-tabs-trigger.vue', import.meta.url),
  'utf8'
)
const tabsContentSource = readFileSync(
  new URL('../src/components/ui/ui-tabs-content.vue', import.meta.url),
  'utf8'
)
const userViewSource = readFileSync(
  new URL('../src/views/user/view-index.vue', import.meta.url),
  'utf8'
)

test('keeps non-submit actions safe inside forms', () => {
  assert.match(buttonSource, /type\?: 'button' \| 'submit' \| 'reset'/)
  assert.match(buttonSource, /type: 'button'/)
  assert.match(buttonSource, /:type="as === 'button' \? type : undefined"/)
})

test('keeps dialogs scrollable within legacy and dynamic viewport units', () => {
  assert.match(dialogSource, /max-h-\[90vh\] max-h-\[90dvh\]/)
  assert.match(dialogSource, /min-h-0 flex-1 overflow-y-auto p-1\.5/)
})

test('loads vue-sonner styles so toasts are visible', () => {
  assert.match(mainSource, /import 'vue-sonner\/style\.css'/)
})

test('owns the Origin card-style radio primitive', () => {
  assert.match(radioCardsSource, /defineOptions\(\{\s*name: 'UiRadioCards'/)
  assert.match(radioCardsSource, /generic="T extends string \| number"/)
  assert.match(radioCardsSource, /sr-only after:absolute after:inset-0/)
  assert.match(radioCardsSource, /<div class="grid gap-2">/)
  assert.match(radioCardsSource, /<div v-if="legend" class="text-sm font-medium leading-none">/)
  assert.match(radioItemSource, /type="button"/)
})

test('opts the sub-app card out of the default UiCard shadow', () => {
  assert.match(userAppItemSource, /<UiCard class="shadow-none"/)
  assert.doesNotMatch(userAppItemSource, /#header>\s*>/)
})

test('uses the project-owned Zod validation adapter', () => {
  assert.match(validationSource, /schema: z\.ZodType<T>/)
  assert.match(validationSource, /schema\.safeParse\(value\)/)
  assert.match(validationSource, /Partial<Record<keyof T, string>>/)
})

test('owns a domain-free Origin tooltip primitive', () => {
  assert.match(tooltipSource, /defineOptions\(\{\s*name: 'UiTooltip'/)
  assert.match(tooltipSource, /from 'reka-ui'/)
  assert.match(tooltipSource, /TooltipProvider/)
  assert.match(tooltipSource, /TooltipTrigger as-child/)
  assert.match(tooltipSource, /bg-foreground/)
  assert.match(tooltipSource, /text-background/)
  assert.match(tooltipSource, /px-3 py-1\.5/)
  assert.doesNotMatch(tooltipSource, /from '@\/utils\/constants'/)
  assert.doesNotMatch(tooltipSource, /useUserStore/)
  assert.doesNotMatch(tooltipSource, /from '@\/api\//)
})

test('keeps global chrome as an identity plaque without session or build badge', () => {
  assert.match(baseLayoutSource, /<RouterLink/)
  assert.match(baseLayoutSource, /to="\/"/)
  assert.match(baseLayoutSource, /ENV\.TITLE/)
  assert.match(baseLayoutSource, /ENV\.COPYRIGHT\.NAME/)
  assert.match(baseLayoutSource, /ENV\.COPYRIGHT\.YEAR/)
  assert.match(baseLayoutSource, /ENV\.BUILD\.COMMIT/)
  assert.match(baseLayoutSource, /ENV\.BUILD\.BRANCH/)
  assert.match(baseLayoutSource, /Made with ❤️ by youranreus/)
  assert.match(baseLayoutSource, /UiTooltip/)
  assert.match(baseLayoutSource, /max-w-4xl/)
  assert.doesNotMatch(baseLayoutSource, /useUserStore/)
  assert.doesNotMatch(baseLayoutSource, /UiBadge/)
  assert.doesNotMatch(baseLayoutSource, /<strong/)
  assert.doesNotMatch(baseLayoutSource, /hidden sm:inline/)
  assert.doesNotMatch(baseLayoutSource, /KeyRound/)
  assert.doesNotMatch(baseLayoutSource, /border-t/)
  assert.doesNotMatch(baseLayoutSource, /sticky/)
})

test('owns a domain-free Origin tabs primitive used by account chrome', () => {
  for (const source of [tabsSource, tabsListSource, tabsTriggerSource, tabsContentSource]) {
    assert.match(source, /from 'reka-ui'/)
    assert.doesNotMatch(source, /useUserStore/)
    assert.doesNotMatch(source, /from '@\/utils\/constants'/)
    assert.doesNotMatch(source, /from '@\/api\//)
    assert.doesNotMatch(source, /UserRole/)
  }
  assert.match(tabsSource, /defineOptions\(\{\s*name: 'UiTabs'/)
  assert.match(tabsSource, /activationMode\?: 'automatic' \| 'manual'/)
  assert.match(tabsListSource, /defineOptions\(\{\s*name: 'UiTabsList'/)
  assert.match(tabsTriggerSource, /defineOptions\(\{\s*name: 'UiTabsTrigger'/)
  assert.match(tabsContentSource, /defineOptions\(\{\s*name: 'UiTabsContent'/)
  assert.match(tabsTriggerSource, /type="button"/)
  assert.match(tabsTriggerSource, /value: string \| number/)
  assert.match(tabsContentSource, /value: string \| number/)
  assert.match(userViewSource, /UiTabs/)
  assert.match(userViewSource, /items-start/)
  assert.match(userViewSource, /activation-mode="manual"/)
  assert.match(userViewSource, /data-\[state=active\]:bg-muted/)
  assert.match(userViewSource, /data-\[state=active\]:shadow-none/)
  assert.match(userViewSource, /bg-transparent/)
  assert.match(userViewSource, /overflow-x-auto/)
  assert.match(userViewSource, /p-1\.5/)
  assert.match(userViewSource, /router\.push\(\{ name: next \}\)/)
  assert.match(userViewSource, /<router-view \/>/)
  assert.match(userViewSource, /hideTabWithoutPermission/)
  assert.match(userViewSource, /userPermissions\.value\.includes/)
  assert.doesNotMatch(userViewSource, /UiTabsContent/)
})
