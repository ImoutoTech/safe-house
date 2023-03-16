export interface ENVData {
  TITLE: string;
  API_URL: string;
  MODE: string;
  PROD: boolean;
  [key: string]: string | boolean;
}
