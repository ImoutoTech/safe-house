import API from "./base";
import qs from "qs";
import type { AxiosResult, UserInfo, Restful, UserLoginParams } from "@/types";

export const UserLogin = (data: UserLoginParams): AxiosResult<UserInfo> =>
  API.post<Restful<UserInfo>>("/user/login", qs.stringify(data));
