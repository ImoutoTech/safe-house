import { createContext, type Dispatch, type SetStateAction } from "react";
import { IGlobalData } from "./types";

interface IGlobalContext {
  globalData: IGlobalData;
  updateGlobalData: Dispatch<SetStateAction<IGlobalData>>;
}

const GlobalContext = createContext<IGlobalContext>(<IGlobalContext>{});
export default GlobalContext;
