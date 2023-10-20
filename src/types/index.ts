import type { AxiosResponse } from "axios";

export * from "./user";
export * from "./app";
export * from "./auth";

export interface ENVData {
  TITLE: string;
  API_URL: string;
  MODE: string;
  PROD: boolean;
  LOCALHOST_PREFIX: string;
  PROXY_URL: string;
  [key: string]: string | boolean;
}

export interface Restful<T> {
  code: 0 | 100;
  msg: string;
  data: T;
}

export interface Pagination<T> {
  items: T[];
  count: number;
}

export type RestfulPagination<T> = Restful<Pagination<T>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AxiosResult<T> = Promise<AxiosResponse<Restful<T>, any>>;

export type AxiosPagination<T> = Promise<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AxiosResponse<RestfulPagination<T>, any>
>;
