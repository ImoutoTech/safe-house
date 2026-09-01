import { getUserActivity } from '@/api/user'
import type { UserActivityItem } from '@/types'
import { useRequest } from 'alova'

export const useUserActivity = () => {
  const initialPageSize = 20
  const items = shallowRef<UserActivityItem[]>([])
  const page = shallowRef(0)
  const count = shallowRef(0)
  const requestPage = shallowRef(1)
  const serverHasMore = shallowRef(false)

  const request = useRequest(
    (targetPage = 1) => {
      requestPage.value = targetPage
      return getUserActivity(targetPage, initialPageSize)
    },
    { immediate: true }
  )

  request.onSuccess((event) => {
    const result = event.data.data
    if (result.page === 1) {
      items.value = [...result.items]
    } else {
      const loadedIds = new Set(items.value.map((item) => item.id))
      const nextItems = result.items.filter((item) => !loadedIds.has(item.id))
      items.value = [...items.value, ...nextItems]
    }
    page.value = result.page
    count.value = result.count
    serverHasMore.value = result.hasMore
  })

  const sendPage = async (targetPage: number) => {
    try {
      await request.send(targetPage)
    } catch {
      // Keep the loaded items and expose the request error beside the list.
    }
  }

  const loadMore = async () => {
    if (request.loading.value || !serverHasMore.value) return
    await sendPage(page.value + 1)
  }

  const retry = async () => {
    if (request.loading.value) return
    await sendPage(requestPage.value)
  }

  return {
    items: readonly(items),
    loading: computed(() => request.loading.value),
    error: computed(() => request.error.value),
    hasMore: computed(() => serverHasMore.value && items.value.length < count.value),
    loadMore,
    retry
  }
}
