import { Navigate, createBrowserRouter } from "react-router";
import Login from "../Pages/Login";
import AuthWrapper from "../Components/AuthWrapper";
import Dashboard from "../Pages/Dashboard";
import Admin from "../Pages/Admin";
import PublicRoute from "../Components/PublicRoute";
import Forbidden from "../Pages/Forbidden";
import NotFound from "../Pages/NotFound";
import type { RouteAccessHandle } from "./types";

const routes = createBrowserRouter([
  {
    Component: PublicRoute,
    children: [
      {
        path: "/login",
        handle: { publicOnly: true } satisfies RouteAccessHandle,
        Component: Login,
      },
    ],
  },
  {
    path: "/",
    Component: AuthWrapper,
    children: [
      {
        index: true,
        element: <Navigate replace to="/dashboard" />,
        handle: { requireAuth: true } satisfies RouteAccessHandle,
      },
      {
        path: "/dashboard",
        handle: { requireAuth: true } satisfies RouteAccessHandle,
        Component: Dashboard,
      },
      {
        path: "/admin",
        handle: { requireAuth: true, requireAdmin: true } satisfies RouteAccessHandle,
        Component: Admin,
      },
      {
        path: "/forbidden",
        handle: { requireAuth: true } satisfies RouteAccessHandle,
        Component: Forbidden,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

export default routes;
