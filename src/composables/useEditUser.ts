import { updateUserData } from '@/api/user'
import { useRequest } from 'alova'
import type { UserModifyParams } from '@/types'
import { useUserStore } from '@/stores/user'
import { useFeedback } from './useFeedback'

export const useEditUser = (callback?: () => void) => {
  const feedback = useFeedback()
  const userStore = useUserStore()
  const { loading, onSuccess, send } = useRequest(
    (data: Partial<UserModifyParams>) => updateUserData(userStore.userData.id, data),
    {
      immediate: false
    }
  )

  const submit = (data: Partial<UserModifyParams>) => {
    send(data)
  }

  onSuccess((res) => {
    feedback.success('修改成功')
    userStore.updateUserData(res.data.data)
    callback?.()
  })

  return { loading, submit }
}
