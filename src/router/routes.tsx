import type { RouteObject } from "react-router-dom";
import App from "../App";
import Login from "@/pages/Login";

/**
 * 路由
 */
const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
];

export default routes;
