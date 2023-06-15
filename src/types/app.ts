export interface AppInfo {
  name: string;
  id: string;
  callback: string;
  owner: string;
  created_at: string;
  updated_at: string;
}

export interface AppCallbackResult {
  ticket: string;
}
