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

test('exposes the guide next to the create action without a permission directive', () => {
  assert.match(pageSource, /aria-label="查看 OIDC \/ SSO 接入说明"/)
  assert.match(pageSource, /@click="guideVisible = true"/)
  assert.match(
    pageSource,
    /@click="guideVisible = true"[\s\S]*?v-permission="PERMISSION_CODE_MAP\['新建子应用'\]"/
  )
  assert.doesNotMatch(pageSource, /v-permission[^>]*>[\s\S]*?@click="guideVisible = true"/)
})

test('uses a compact rounded rectangle for the guide icon action', () => {
  assert.match(pageSource, /<n-button[\s\S]*?class="guide-button"[\s\S]*?tertiary/)
  assert.doesNotMatch(pageSource, /class="guide-button"[\s\S]*?\bcircle\b[\s\S]*?aria-label/)
  assert.match(
    pageSource,
    /\.guide-button\s*{[\s\S]*?width: 34px;[\s\S]*?padding: 0;[\s\S]*?border-radius: 3px;/
  )
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
  assert.match(dialogSource, /<iframe[^>]*:src="guidePath"/)
})

test('provides absolute-link copy feedback and a stable HTML download', () => {
  assert.match(dialogSource, /new URL\(guidePath, window\.location\.href\)\.href/)
  assert.match(dialogSource, /navigator\.clipboard\.writeText\(guideUrl\)/)
  assert.match(dialogSource, /message\.success\('说明链接已复制'\)/)
  assert.match(dialogSource, /message\.error\('复制失败，请稍后重试'\)/)
  assert.match(dialogSource, /download="third-party-oidc-integration-guide\.html"/)
})

test('keeps the dialog accessible and the mobile preview actions visible', () => {
  assert.match(dialogSource, /role="dialog"/)
  assert.match(dialogSource, /aria-modal="true"/)
  assert.match(dialogSource, /<iframe[^>]*title="OIDC \/ SSO 接入说明"/)
  assert.match(dialogSource, /@media \(max-width: 768px\)/)
  assert.match(dialogSource, /height: calc\(100dvh - 16px\)/)
  assert.match(dialogSource, /\.oidc-guide-toolbar :deep\(\.n-button\)[\s\S]*?flex: 1/)
})

test('separates the guide toolbar from the iframe content', () => {
  assert.match(dialogSource, /\.oidc-guide-toolbar\s*{[\s\S]*?padding-top: 12px;/)
})
