import type { RouteObject } from "react-router-dom";
import App from "../App";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

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
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
];

export default routes;
