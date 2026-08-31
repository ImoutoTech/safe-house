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
