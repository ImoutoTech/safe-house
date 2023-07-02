import type { RouteItem } from "./types";
import { Outlet } from "react-router-dom";
import App from "../App";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import User from "@/pages/User";
import Info from "@/pages/User/Info";
import SubApp from "@/pages/User/SubApp";
import Index from "@/pages/Index";

import Manage from "@/pages/User/SubApp/manage";
import Callback from "@/pages/Callback";

import Admin from "@/pages/User/Admin/Index";

/**
 * 路由
 */
const routes: RouteItem[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
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
        path: "/callback/:appId",
        element: <Callback />,
      },
      {
        path: "/user",
        element: <User />,
        meta: {
          needAuth: true,
        },
        children: [
          {
            path: "/user",
            element: <Info />,
          },
          {
            path: "/user/app",
            element: <Outlet />,
            children: [
              {
                path: "/user/app",
                element: <SubApp />,
              },
              {
                path: "/user/app/:type",
                element: <Manage />,
              },
            ],
          },
          {
            path: "/user/admin",
            element: <Admin />,
            meta: {
              needAdmin: true,
            },
          },
        ],
      },
    ],
  },
];

export default routes;
