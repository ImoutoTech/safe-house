<script setup lang="ts">
import { z } from 'zod'
import UiButton from '@/components/ui/ui-button.vue'
import UiDialog from '@/components/ui/ui-dialog.vue'
import UiField from '@/components/ui/ui-field.vue'
import UiInput from '@/components/ui/ui-input.vue'
import UiRadioCards from '@/components/ui/ui-radio-cards.vue'
import { useEditUser } from '@/composables/useEditUser'
import { useFormValidation } from '@/composables/useFormValidation'
import { useUserData } from '@/composables/useUserData'
import type { UserModifyParams } from '@/types'
import { ENV } from '@/utils/constants'
import { Md5 } from 'ts-md5'
import ChangeEmailModal from './change-email-modal.vue'
import ChangePasswordModal from './change-password-modal.vue'

defineOptions({ name: 'UserDataModify' })
type AvatarType = 'gravatar' | 'qq'
const visible = defineModel('visible', { type: Boolean })
const { userData } = useUserData()
const avatarType = shallowRef<AvatarType>('gravatar')
const avatar = shallowRef('')
const emailVisible = shallowRef(false)
const passwordVisible = shallowRef(false)
const value = ref({ ...userData.value })
const { loading, submit } = useEditUser(() => (visible.value = false))
const schema = z.object({ nickname: z.string().trim().min(1, '请输入用户名') })
const { errors, validate, clear } = useFormValidation(schema)
const avatarPlaceholder = computed(() =>
  avatarType.value === 'gravatar' ? '请输入自定义邮箱' : '请输入 QQ 号'
)
const avatarHint = computed(() =>
  avatarType.value === 'gravatar'
    ? '默认根据当前用户邮箱获取 Gravatar 头像'
    : '输入 QQ 号获取对应头像'
)
const getUserAvatarUrl = (type: AvatarType, val: string) =>
  type === 'gravatar'
    ? `${ENV.AVATAR.GRAVATAR}${Md5.hashStr(val || value.value.email)}?s=640`
    : `${ENV.AVATAR.QQ}${val}`
const handleSubmit = () => {
  if (!validate({ nickname: value.value.nickname })) return
  const data: Partial<UserModifyParams> = { nickname: value.value.nickname }
  if (avatarType.value !== 'qq' || avatar.value)
    data.avatar = getUserAvatarUrl(avatarType.value, avatar.value)
  submit(data)
}
const openSecurityModal = async (target: 'email' | 'password') => {
  visible.value = false
  await nextTick()
  emailVisible.value = target === 'email'
  passwordVisible.value = target === 'password'
}
const restore = () => {
  value.value = { ...userData.value }
  avatar.value = ''
  clear()
}
watch(userData, restore, { deep: true })
watch(visible, (shown) => {
  if (shown) restore()
})
</script>

<template>
  <UiDialog
    v-model:open="visible"
    title="编辑资料"
    description="更新显示名称、头像来源和账号安全设置。"
    ><form class="grid gap-5" @submit.prevent="handleSubmit">
      <UiField label="用户名" for="profile-nickname" :error="errors.nickname"
        ><template #default="field"
          ><UiInput
            id="profile-nickname"
            v-model="value.nickname"
            :placeholder="userData.nickname"
            :invalid="field.invalid"
            :aria-describedby="field.describedBy"
            @update:model-value="clear('nickname')" /></template
      ></UiField>
      <fieldset class="grid gap-3">
        <legend class="text-sm font-medium leading-none">更新头像</legend>
        <p class="text-xs leading-relaxed text-muted-foreground">{{ avatarHint }}</p>
        <div class="grid gap-3">
          <UiRadioCards
            v-model="avatarType"
            :items="[
              { value: 'gravatar', label: 'Gravatar' },
              { value: 'qq', label: 'QQ' }
            ]"
          />
          <UiInput
            v-model="avatar"
            :placeholder="avatarPlaceholder"
            :aria-label="avatarType === 'qq' ? 'QQ 号' : 'Gravatar 邮箱'"
          />
        </div>
      </fieldset>
      <div class="grid grid-cols-2 gap-2">
        <UiButton type="button" variant="outline" @click="openSecurityModal('email')"
          >更换邮箱</UiButton
        ><UiButton type="button" variant="outline" @click="openSecurityModal('password')">{{
          userData.hasPassword ? '修改密码' : '设置密码'
        }}</UiButton>
      </div>
      <UiButton type="submit" block :loading="loading">保存资料</UiButton>
    </form></UiDialog
  ><ChangeEmailModal v-model:visible="emailVisible" /><ChangePasswordModal
    v-model:visible="passwordVisible"
  />
</template>
