export enum AppStatus {
  CLOSED = 0,
  RUNNING = 1,
  BANNED = 2
}

export interface AppInfo {
  name: string
  id: string
  callback: string
  owner: string
  description: string
  visitNum: number
  created_at: string
  updated_at: string
  meta: {
    visitNum: number
    status: AppStatus
  }
}

export interface AppCallbackResult {
  ticket: string
}

export interface UserAppRegParams {
  callback: string
  name: string
  description: string
}

export type UserAppUpdateParams = UserAppRegParams
