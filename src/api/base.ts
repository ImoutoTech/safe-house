import { ENV } from "@/utils/config";
import storage from "@/utils/storage";
import axios from "axios";

const baseUrl = ENV.PROXY_URL;

const API = axios.create({
  baseURL: baseUrl,
});

API.interceptors.request.use((req) => {
  if (storage.has("access_token"))
    req.headers.Authorization = storage.get("access_token");
  return req;
});

export default API;
