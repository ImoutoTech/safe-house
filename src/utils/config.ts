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

export enum Role {
  ADMIN = "0",
  USER = "1",
}

export const DEFAULT_AVATAR = "https://cdn.exia.xyz/img/blog/kal.webp";

export const GRAVATAR_BASE = "https://sdn.geekzu.org/avatar/";

export const QQ_AVATAR_BASE = "https://q1.qlogo.cn/g?b=qq&s=5&nk=";
