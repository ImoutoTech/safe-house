export interface AppInfo {
  name: string;
  id: string;
  callback: string;
  owner: string;
  description: string;
  visitNum: number;
  created_at: string;
  updated_at: string;
}

export interface AppCallbackResult {
  ticket: string;
}
