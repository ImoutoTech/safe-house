import storage from "./storage";

export const hasLocalData = () =>
  ["access_token", "refresh_token", "id"].every((i) => storage.has(i));
