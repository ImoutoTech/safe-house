import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const homeViewSource = readFileSync(new URL('../src/views/home-view.vue', import.meta.url), 'utf8')

test('keeps the home actions visible with default copy when dynamic config is unavailable', () => {
  assert.doesNotMatch(homeViewSource, /v-if="!isNil\(config\)"/)
  assert.match(homeViewSource, /btn:\s*['"]注册['"]/)
  assert.match(homeViewSource, /btn:\s*['"]登录['"]/)
  assert.match(homeViewSource, /config\.value\?\.register\s*\?\?\s*defaultActions\.register/)
  assert.match(homeViewSource, /config\.value\?\.login\s*\?\?\s*defaultActions\.login/)
})
