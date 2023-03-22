import { ENV } from "@/utils/config";
import storage from "@/utils/storage";
import axios from "axios";

const baseUrl = ENV.API_URL;

const API = axios.create({
  baseURL: baseUrl,
});

API.interceptors.request.use((req) => {
  if (storage.get("token"))
    req.headers.Authorization = "Bearer " + storage.get("token");
  return req;
});

export default API;
