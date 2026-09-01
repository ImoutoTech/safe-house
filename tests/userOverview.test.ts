import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const readSource = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

test('keeps overview and activity requests typed and independently orchestrated', () => {
  const apiSource = readSource('../src/api/user.ts')
  const overviewSource = readSource('../src/composables/useUserOverview.ts')
  const activitySource = readSource('../src/composables/useUserActivity.ts')

  assert.match(apiSource, /api\.Get<Restful<UserOverview>>\(['"]\/user\/me\/overview['"]\)/)
  assert.match(apiSource, /api\.Get<Restful<UserActivityPage>>\(['"]\/user\/me\/activity['"]/)
  assert.match(overviewSource, /getUserOverview/)
  assert.match(overviewSource, /immediate:\s*true/)
  assert.match(activitySource, /getUserActivity/)
  assert.match(activitySource, /initialPageSize\s*=\s*20/)
  assert.match(activitySource, /items\.value\s*=\s*\[\.\.\.items\.value,/)
})

test('renders permission, zero-app, metric and partial-error states without visitNum', () => {
  const pageSource = readSource('../src/views/user/pages/user-info.vue')
  const accountSource = readSource('../src/views/user/components/user-account-details.vue')
  const metricsSource = readSource('../src/views/user/components/developer-metrics.vue')
  const statisticCardSource = readSource('../src/views/user/components/user-statistic-card.vue')

  assert.match(pageSource, /overview\?\.apps/)
  assert.doesNotMatch(pageSource, /:user-id=/)
  assert.doesNotMatch(accountSource, /用户 ID|userId/)
  assert.match(metricsSource, /apps\.total\s*===\s*0/)
  assert.match(metricsSource, /近 \$\{props\.windowDays\} 天成功登录/)
  assert.match(metricsSource, /近 \$\{props\.windowDays\} 天授权同意/)
  assert.match(metricsSource, /近 \$\{props\.windowDays\} 天授权拒绝/)
  assert.match(metricsSource, /登录和授权指标统计最近 \{\{ windowDays \}\} 天/)
  assert.doesNotMatch(metricsSource, /lucide-vue-next|#icon|metric\.icon/)
  assert.doesNotMatch(
    metricsSource,
    /完成授权码换取令牌的登录流程|用户明确同意的授权决策|用户明确拒绝的授权决策|运行 \$\{props\.apps\.running\}/
  )
  assert.doesNotMatch(statisticCardSource, /description|#icon|<slot|tone/)
  assert.doesNotMatch(`${pageSource}\n${metricsSource}`, /visitNum|已访问/)
})

test('uses semantic activity items with stable keys and textual outcomes', () => {
  const activitySource = readSource('../src/views/user/components/user-activity-list.vue')

  assert.match(activitySource, /<ol/)
  assert.match(activitySource, /:key="item\.id"/)
  assert.match(activitySource, /加载更多/)
  assert.match(activitySource, /重试/)
  assert.match(activitySource, /已同意/)
  assert.match(activitySource, /已拒绝/)
})
