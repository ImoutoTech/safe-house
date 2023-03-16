import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { GeistProvider, CssBaseline } from "@geist-ui/core";

import router from "./router/router";

import "normalize.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GeistProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </GeistProvider>
  </React.StrictMode>
);
