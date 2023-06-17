import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import router from "./router/router";

import "normalize.css";
import "./assets/base.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GeistProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </GeistProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
