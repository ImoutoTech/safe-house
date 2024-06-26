import { GetUserApp } from '@/api/app'
import { usePagination } from '@alova/scene-vue'

export const useAppList = () => {
  const msg = useMessage()
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

  const pageBindings = computed(() => ({
    page: page.value,
    itemCount: total.value,
    pageSize: pageSize.value,
    'on-update:page': (val: number) => (page.value = val),
    'on-update:page-size': (val: number) => (pageSize.value = val),
    loading: loading.value,
    disabled: loading.value
  }))

  const searchBindings = computed(() => ({
    value: searchValue.value,
    'on-input': (val: string) => (searchValue.value = val),
    loading: loading.value,
    disabled: loading.value
  }))

  onError((e) => {
    msg.error(e.error.message)
  })

  return { refresh, loading, data, searchBindings, pageBindings }
}
