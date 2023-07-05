import API from "./base";
import qs from "qs";
import type {
  AxiosResult,
  Restful,
  AppInfo,
  UserAppRegParams,
  UserAppUpdateParams,
  AppCallbackResult,
} from "@/types";

export const getUserApp = (): AxiosResult<AppInfo[]> =>
  API.get<Restful<AppInfo[]>>(`/app/my`);

export const delUserApp = (id: string): AxiosResult<Record<string, never>> =>
  API.delete<Restful<Record<string, never>>>(`/app/${id}`);

export const regUserApp = (data: UserAppRegParams): AxiosResult<AppInfo> =>
  API.post<Restful<AppInfo>>(`/app/reg`, qs.stringify(data));

export const updateUserApp = (
  id: string,
  data: UserAppUpdateParams
): AxiosResult<AppInfo> =>
  API.put<Restful<AppInfo>>(`/app/${id}`, qs.stringify(data));

export const getUserAppData = (id: string): AxiosResult<AppInfo> =>
  API.get<Restful<AppInfo>>(`/app/${id}`);

export const callbackUserApp = (id: string): AxiosResult<AppCallbackResult> =>
  API.post<Restful<AppCallbackResult>>(`/app/${id}`);

export const getAllApp = (page = 1, size = 10): AxiosResult<AppInfo[]> =>
  API.get<Restful<AppInfo[]>>(`/app/all`, { params: { page, size } });
