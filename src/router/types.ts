import type { RouteObject } from "react-router-dom";

export interface RouteMeta {
  title: string;
}

export interface RouteCustomItem {
  meta: RouteMeta;
}

export type RouteItem = RouteCustomItem & RouteObject;
