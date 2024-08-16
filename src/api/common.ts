import type { Restful } from '@/types'
import api from './api'

export const waitBackend = () => api.Get<Restful<any>>(`/`)
