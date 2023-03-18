export interface ENVData {
  TITLE: string;
  API_URL: string;
  MODE: string;
  PROD: boolean;
  TOKEN_KEY: string;
  [key: string]: string | boolean;
}
