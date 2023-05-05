import API from "./base";
import qs from "qs";
import type {
  AxiosResult,
  LoginResult,
  Restful,
  UserInfo,
  UserLoginParams,
  UserModifyParams,
  UserRegisterParams,
} from "@/types";

export const UserLogin = (data: UserLoginParams): AxiosResult<LoginResult> =>
  API.post<Restful<LoginResult>>("/user/login?md5=true", qs.stringify(data));

export const UserRegister = (data: UserRegisterParams): AxiosResult<UserInfo> =>
  API.post<Restful<UserInfo>>("/user/register?md5=true", qs.stringify(data));

export const getUserData = (id: number): AxiosResult<UserInfo> =>
  API.get<Restful<UserInfo>>(`/user/${id}`);

export const updateUserData = (
  id: number,
  data: UserModifyParams
): AxiosResult<UserInfo> =>
  API.put<Restful<UserInfo>>(`/user/${id}`, qs.stringify(data));
