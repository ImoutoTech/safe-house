import { proxy } from "valtio";
import { IGlobalStore } from "./types";

const store = proxy<IGlobalStore>(<IGlobalStore>{});

export const updateGlobalUser = (data: IGlobalStore["userData"]) => {
  store.userData = data;
};

export default store;
