export * from './user'
export * from './app'
export * from './oauth'

export interface Restful<T> {
  code: number
  msg: string
  data: T
}

export interface Pagination<T> {
  items: T[]
  count: number
}
