import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const pageSource = readFileSync(
  new URL('../src/views/user/pages/user-app.vue', import.meta.url),
  'utf8'
)
const dialogSource = readFileSync(
  new URL('../src/views/user/components/oidc-integration-guide.vue', import.meta.url),
  'utf8'
)
const guideUrl = new URL('../public/third-party-oidc-integration-guide.html', import.meta.url)

test('exposes the guide independently from create permission', () => {
  assert.match(pageSource, /aria-label="查看接入说明"/)
  assert.match(pageSource, /@click="guideVisible = true"/)
  assert.match(
    pageSource,
    /@click="guideVisible = true"[\s\S]*?v-permission="PERMISSION_CODE_MAP\['新建子应用'\]"/
  )
  assert.doesNotMatch(pageSource, /<n-/)
})

test('uses an accessible Origin icon action for the guide', () => {
  assert.match(
    pageSource,
    /<UiButton[^>]*variant="outline"[^>]*size="icon"[^>]*aria-label="查看接入说明"/
  )
  assert.match(dialogSource, /<UiDialog[^>]*title="接入说明"/)
})

test('serves the original guide from the public directory', () => {
  assert.equal(existsSync(guideUrl), true)
  const guideSource = readFileSync(guideUrl, 'utf8')
  assert.equal(
    createHash('sha256').update(guideSource).digest('hex'),
    '30ce3e5af547b6502f004bdf807f6b20ecbd0951640338f9ca0ee0ecee6751db'
  )
  assert.match(guideSource, /https:\/\/sf\.imouto\.tech\/oidc/)
  assert.doesNotMatch(guideSource, /h\.exia\.xyz/)
  assert.match(dialogSource, /import\.meta\.env\.BASE_URL}third-party-oidc-integration-guide\.html/)
  assert.match(dialogSource, /<iframe[^>]*:src="guides\.login\.path"/)
  assert.match(dialogSource, /<iframe[^>]*:src="guides\.notification\.path"/)
})

test('provides absolute-link copy feedback and stable downloads', () => {
  assert.match(dialogSource, /new URL\(currentGuide\.value\.path, window\.location\.href\)\.href/)
  assert.match(dialogSource, /navigator\.clipboard\.writeText/)
  assert.match(dialogSource, /feedback\.success\('说明链接已复制'\)/)
  assert.match(dialogSource, /feedback\.error\('复制失败，请稍后重试'\)/)
  assert.match(dialogSource, /:download="currentGuide\.fileName"/)
})

test('keeps the preview within the dynamic viewport and labels tabs', () => {
  assert.match(dialogSource, /h-\[calc\(100vh-2rem\)\]/)
  assert.match(dialogSource, /h-\[calc\(100dvh-2rem\)\]/)
  assert.match(dialogSource, /TabsRoot v-model="activeGuide"/)
  assert.match(dialogSource, /TabsList[^>]*aria-label="接入说明类型"/)
  assert.match(dialogSource, /TabsTrigger[^>]*value="login"/)
  assert.match(dialogSource, /TabsTrigger[^>]*value="notification"/)
  assert.match(dialogSource, /TabsContent value="login"/)
  assert.match(dialogSource, /TabsContent value="notification"/)
})
