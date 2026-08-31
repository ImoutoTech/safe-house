import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const homeViewSource = readFileSync(new URL('../src/views/home-view.vue', import.meta.url), 'utf8')
const authPanelSource = readFileSync(
  new URL('../src/components/patterns/auth-panel.vue', import.meta.url),
  'utf8'
)

test('keeps the home actions visible with default copy when dynamic config is unavailable', () => {
  assert.doesNotMatch(homeViewSource, /v-if="!isNil\(config\)"/)
  assert.match(homeViewSource, /btn:\s*['"]注册['"]/)
  assert.match(homeViewSource, /btn:\s*['"]登录['"]/)
  assert.match(homeViewSource, /config\.value\?\.register\s*\?\?\s*defaultActions\.register/)
  assert.match(homeViewSource, /config\.value\?\.login\s*\?\?\s*defaultActions\.login/)
})

test('drops the decorative home key icon and tagline', () => {
  assert.doesNotMatch(homeViewSource, /KeyRound/)
  assert.doesNotMatch(homeViewSource, /一把钥匙，安全进入属于你的应用与身份空间。/)
})

test('drops the decorative auth key icon without changing 钥匙 copy sites', () => {
  assert.doesNotMatch(authPanelSource, /KeyRound/)
})
