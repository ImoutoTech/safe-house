export interface RouteItem {
  path?: string;
  children?: RouteItem[];
  element?: React.ReactNode | null;
  id?: string;
  meta?: {
    needAuth?: boolean;
    title?: string;
  };
}
