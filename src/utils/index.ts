import storage from "./storage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import routes from "@/router/rawRoutes";
import "dayjs/locale/zh-cn";
import { cloneDeep, startsWith } from "lodash-es";

export const hasLocalData = () =>
  ["access_token", "refresh_token", "id"].every((i) => storage.has(i));

export const getDayjs = () => {
  dayjs.extend(relativeTime);
  dayjs.locale("zh-cn");
  return dayjs;
};

export type authType = "login" | "admin" | "";

export const pathNeedAuth = (pathName: string): authType => {
  let needAuth: authType = "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queue: any[] = cloneDeep(routes);

  while (queue.length) {
    const current = queue.shift();
    if (current?.meta?.needAdmin) {
      if (current.path === pathName || startsWith(pathName, current.path)) {
        needAuth = "login";
        break;
      }
    }

    if (current?.meta?.needAuth) {
      if (current.path === pathName || startsWith(pathName, current.path)) {
        needAuth = "login";
        break;
      }
    }

    if (current.children) {
      while (current.children.length) {
        queue.push(current.children.shift());
      }
    }
  }

  return needAuth;
};
