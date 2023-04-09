import storage from "./storage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

export const hasLocalData = () =>
  ["access_token", "refresh_token", "id"].every((i) => storage.has(i));

export const getDayjs = () => {
  dayjs.extend(relativeTime);
  dayjs.locale("zh-cn");
  return dayjs;
};
