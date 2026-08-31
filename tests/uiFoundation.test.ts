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

test('keeps non-submit actions safe inside forms', () => {
  assert.match(buttonSource, /type\?: 'button' \| 'submit' \| 'reset'/)
  assert.match(buttonSource, /type: 'button'/)
  assert.match(buttonSource, /:type="as === 'button' \? type : undefined"/)
})

test('keeps dialogs scrollable within legacy and dynamic viewport units', () => {
  assert.match(dialogSource, /max-h-\[90vh\] max-h-\[90dvh\]/)
  assert.match(dialogSource, /min-h-0 overflow-y-auto/)
})

test('uses the project-owned Zod validation adapter', () => {
  assert.match(validationSource, /schema: z\.ZodType<T>/)
  assert.match(validationSource, /schema\.safeParse\(value\)/)
  assert.match(validationSource, /Partial<Record<keyof T, string>>/)
})
