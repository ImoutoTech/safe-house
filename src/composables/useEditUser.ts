import { updateUserData } from '@/api/user'
import { useRequest } from 'alova'
import type { UserModifyParams } from '@/types'
import { useUserStore } from '@/stores/user'

export const useEditUser = (callback?: () => void) => {
  const msg = useMessage()
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
    msg.success('修改成功')
    userStore.updateUserData(res.data.data)
    callback?.()
  })

  return { loading, submit }
}
