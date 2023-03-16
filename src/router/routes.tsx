import type { RouteItem } from "./types";
import App from "../App";

/**
 * 路由
 */
const routes: RouteItem[] = [
  {
    path: "/",
    element: <App />,
    children: [],
    meta: {
      title: "Safe House",
    },
  },
];

export default routes;
