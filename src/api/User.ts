import API from "./base";
import qs from "qs";
import type {
  AxiosResult,
  LoginResult,
  Restful,
  UserInfo,
  UserLoginParams,
  UserRegisterParams,
} from "@/types";

export const UserLogin = (data: UserLoginParams): AxiosResult<LoginResult> =>
  API.post<Restful<LoginResult>>("/user/login", qs.stringify(data));

export const UserRegister = (data: UserRegisterParams): AxiosResult<UserInfo> =>
  API.post<Restful<UserInfo>>("/user/reg", qs.stringify(data));

export const getUserData = (id: number): AxiosResult<UserInfo> =>
  API.get<Restful<UserInfo>>(`/user/${id}`);
