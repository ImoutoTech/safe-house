import { ENV, TOKEN_EXPIRED_TEXT } from "@/utils/config";
import storage from "@/utils/storage";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const baseUrl = ENV.PROXY_URL;

const API = axios.create({
  baseURL: baseUrl,
});

API.interceptors.request.use((req) => {
  if (storage.has("refresh_token") && storage.has("access_token"))
    req.headers.Authorization = storage.get("access_token");
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log("请求出错: ", error);

    if (
      error?.config?.url === "/user/refresh" &&
      error?.response?.status === 401
    ) {
      storage.clearSelf();
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const refreshToken = (failedRequest: any) => {
  console.log("token已经失效,尝试刷新token");
  return axios
    .get(`${baseUrl}/user/refresh`, {
      headers: {
        Authorization: storage.get("refresh_token"),
      },
    })
    .then((res) => {
      console.log("token刷新成功");
      storage.set("access_token", res.data.data.token);
      failedRequest.response.config.headers["Authorization"] =
        res.data.data.token;
      return Promise.resolve();
    });
};

createAuthRefreshInterceptor(API, refreshToken, {
  shouldRefresh: (error) =>
    (error?.response?.data as Record<string, string>)?.msg ===
    TOKEN_EXPIRED_TEXT,
});

export default API;
