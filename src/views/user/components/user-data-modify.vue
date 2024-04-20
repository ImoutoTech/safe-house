<template>
  <n-modal v-model:show="visible">
    <n-card
      class="common-dialog"
      title="编辑信息"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <n-form ref="formRef" :model="value" :rules="formRules">
        <n-form-item label="用户名" path="nickname">
          <n-input v-model:value="value.nickname" :placeholder="userData.nickname"></n-input>
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="value.email" :placeholder="userData.email"></n-input>
        </n-form-item>
        <n-form-item label="更新头像" path="avatar">
          <n-flex style="width: 100%" vertical>
            <n-radio-group v-model:value="avatarType" name="radiogroup">
              <n-flex>
                <n-radio value="qq"> QQ </n-radio>
                <n-radio value="gravatar"> Gravatar </n-radio>
              </n-flex>
            </n-radio-group>
            <n-text depth="3">{{ avatarHint }}</n-text>
            <n-input v-model:value="avatar" :placeholder="avatarPlaceholder"></n-input>
          </n-flex>
        </n-form-item>
      </n-form>
      <n-button :loading="loading" block secondary type="info" @click="handleSubmit">保存</n-button>
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
import { useUserData } from '@/composables/useUserData'
import type { FormInst } from 'naive-ui'
import { ENV } from '@/utils/constants'
import { Md5 } from 'ts-md5'
import type { UserModifyParams } from '@/types'
import { useEditUser } from '@/composables/useEditUser'

defineOptions({
  name: 'UserDataModify'
})

type AvatarType = 'gravatar' | 'qq'

const visible = defineModel('visible', { type: Boolean })
const { userData } = useUserData()
const formRef = ref<FormInst>()
const avatarType = ref<AvatarType>('gravatar')
const avatar = ref('')
const { loading, submit } = useEditUser(() => (visible.value = false))

const value = ref({ ...userData.value })

const formRules = {
  nickname: [{ required: true, message: '请输入用户名' }],
  email: [{ required: true, message: '请输入邮箱' }]
}

const avatarPlaceholder = computed(() =>
  avatarType.value === 'gravatar' ? '请输入自定义邮箱' : '请输入QQ号'
)

const avatarHint = computed(() =>
  avatarType.value === 'gravatar'
    ? '默认根据当前用户邮箱获取Gravatar头像'
    : '在下方输入QQ号获取对应账号头像'
)

const getUserAvatarUrl = (type: AvatarType, val: string) => {
  if (type === 'gravatar') {
    return `${ENV.AVATAR.GRAVATAR}${Md5.hashStr(val || value.value.email)}?s=640`
  } else {
    return `${ENV.AVATAR.QQ}${val}`
  }
}

const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (errors) return

    const submitData: Partial<UserModifyParams> = {
      nickname: value.value.nickname,
      email: value.value.email
    }

    if (avatarType.value !== 'qq' || avatar.value) {
      submitData.avatar = getUserAvatarUrl(avatarType.value, avatar.value)
    }

    submit(submitData)
  })
}

const restoreData = () => {
  value.value = { ...userData.value }
}

watch(
  () => userData.value,
  () => {
    restoreData()
  },
  {
    deep: true
  }
)

watch(
  () => visible.value,
  (val) => {
    if (val) restoreData()
    else avatar.value = ''
  },
  {
    deep: true
  }
)
</script>
