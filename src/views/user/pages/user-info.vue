<script setup lang="ts">
import UiAlert from '@/components/ui/ui-alert.vue'
import UiButton from '@/components/ui/ui-button.vue'
import { useUserActivity } from '@/composables/useUserActivity'
import { useUserData } from '@/composables/useUserData'
import { useUserOverview } from '@/composables/useUserOverview'
import { useUserStore } from '@/stores/user'
import DeveloperMetrics from '../components/developer-metrics.vue'
import UserAccountDetails from '../components/user-account-details.vue'
import UserActivityList from '../components/user-activity-list.vue'
import UserDataModify from '../components/user-data-modify.vue'
import UserSecurityOverview from '../components/user-security-overview.vue'

defineOptions({ name: 'UserInfo' })
const router = useRouter()
const { userData } = useUserData()
const {
  overview,
  loading: overviewLoading,
  error: overviewError,
  refresh: refreshOverview
} = useUserOverview()
const {
  items: activityItems,
  loading: activityLoading,
  error: activityError,
  hasMore: activityHasMore,
  loadMore: loadMoreActivity,
  retry: retryActivity
} = useUserActivity()
const { updateUserData, updateToken, updateUserPermissions } = useUserStore()
const modifyVisible = shallowRef(false)
const logout = () => {
  updateUserData()
  updateToken()
  updateUserPermissions([])
  void router.push('/')
}
const openUserTab = (name: 'user-app' | 'user-identities') => void router.push({ name })
</script>

<template>
  <section class="grid gap-8">
    <div class="grid gap-4 md:grid-cols-2">
      <UserAccountDetails
        :email="userData.email"
        :created-at="userData.created_at"
        :updated-at="userData.updated_at"
        @edit="modifyVisible = true"
        @logout="logout"
      />
      <UserSecurityOverview
        :account="overview?.account"
        :fallback-email-verified="userData.emailVerified"
        :fallback-has-password="userData.hasPassword"
        :loading="overviewLoading && !overview"
        @manage-identities="openUserTab('user-identities')"
      />
    </div>

    <UiAlert v-if="overviewError" variant="warning" title="账号概览加载失败">
      <div class="grid justify-items-start gap-3">
        <span>账号资料仍可使用，安全关联信息和子应用指标暂不可用。</span>
        <UiButton variant="outline" size="sm" :loading="overviewLoading" @click="refreshOverview"
          >重试</UiButton
        >
      </div>
    </UiAlert>

    <DeveloperMetrics
      v-if="overview?.apps"
      :apps="overview.apps"
      :window-days="overview.windowDays"
      @manage-apps="openUserTab('user-app')"
    />

    <UserActivityList
      :items="activityItems"
      :loading="activityLoading"
      :error="activityError"
      :has-more="activityHasMore"
      @load-more="loadMoreActivity"
      @retry="retryActivity"
    />
  </section>
  <UserDataModify v-model:visible="modifyVisible" />
</template>
