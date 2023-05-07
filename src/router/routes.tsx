import type { RouteObject } from "react-router-dom";
import App from "../App";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import User from "@/pages/User";
import Info from "@/pages/User/Info";
import SubApp from "@/pages/User/SubApp";
import Index from "@/pages/Index";

/**
 * 路由
 */
const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/user",
        element: <User />,
        children: [
          {
            index: true,
            element: <Info />,
          },
          {
            path: "/user/app",
            element: <SubApp />,
          },
        ],
      },
    ],
  },
];

export default routes;
