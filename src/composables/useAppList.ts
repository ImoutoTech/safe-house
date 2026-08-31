import { GetUserApp } from '@/api/app'
import { usePagination } from '@alova/scene-vue'
import { useFeedback } from './useFeedback'

export const useAppList = () => {
  const feedback = useFeedback()
  const searchValue = ref('')

  const { refresh, data, loading, page, pageSize, total, onError } = usePagination(
    (page: number, size: number) => GetUserApp(page, size, searchValue.value),
    {
      initialPage: 1,
      initialPageSize: 10,
      initialData: {
        code: 0,
        msg: '',
        data: {
          count: 0,
          items: []
        }
      },
      total: (res) => res.data.count,
      data: (res) => res.data.items,
      watchingStates: [searchValue],
      debounce: 300
    }
  )

  onError((e) => {
    feedback.error(e.error.message)
  })

  return { refresh, loading, data, searchValue, page, pageSize, total }
}
