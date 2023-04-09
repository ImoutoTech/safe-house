import type { ENVData } from "../types";

export const ENV: ENVData = {
  API_URL: import.meta.env.SH_API_URL,
  TITLE: import.meta.env.SH_TITLE,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  LOCALHOST_PREFIX: import.meta.env.SH_LOCALHOST_PREFIX,
  PROXY_URL: import.meta.env.SH_PROXY_URL,
};

export const TOKEN_EXPIRED_TEXT = "token 已经过期";
