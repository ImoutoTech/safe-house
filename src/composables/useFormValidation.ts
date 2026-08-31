import { shallowRef, type Ref } from 'vue'
import type { z } from 'zod'

export type FieldErrors<T extends object> = Partial<Record<keyof T, string>>

export const useFormValidation = <T extends object>(schema: z.ZodType<T>) => {
  const errors = shallowRef<FieldErrors<T>>({})

  const validate = (value: T) => {
    const result = schema.safeParse(value)
    if (result.success) {
      errors.value = {}
      return result.data
    }
    const next: FieldErrors<T> = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof T | undefined
      if (key !== undefined && !next[key]) next[key] = issue.message
    }
    errors.value = next
    return null
  }

  const clear = (key?: keyof T) => {
    if (key === undefined) errors.value = {}
    else errors.value = { ...errors.value, [key]: undefined }
  }

  return { errors: errors as Ref<FieldErrors<T>>, validate, clear }
}
