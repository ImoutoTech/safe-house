import api from './api'
import { ENV } from '@/utils/constants'

export const getDynamicConfig = <T = any>(slug: string) =>
  api.Get<T>(`${ENV.CONFIG_URL}/config/get?slug=${slug}`)
