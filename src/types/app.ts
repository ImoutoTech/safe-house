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

export interface UserAppUpdateParams extends UserAppRegParams {
  status: AppStatus
}

export interface UserAppSecretCreateRes {
  value: string
  enabled: boolean
}

export interface UserAppSecret extends UserAppSecretCreateRes {
  id: number
}

export interface AuthorizeParam {
  client_id: string
  redirect_uri: string
  state: string
}

export interface AuthorizeRes {
  access_token: string
  state: string
}
