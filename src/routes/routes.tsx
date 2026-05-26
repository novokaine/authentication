import { createBrowserRouter } from "react-router";
import Login from "../Pages/Login";
import AuthWrapper from "../Components/AuthWrapper";
import Dashboard from "../Pages/Dashboard";
import Admin from "../Pages/Admin";

const routes = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    // element: <AuthWrapper />,
    Component: AuthWrapper,
    children: [
      {
        path: "/dasboard",
        handle: { requireAuth: true },
        Component: Dashboard,
      },
      {
        path: "/admin",
        handle: { requireAuth: true, requireAdmin: true },
        Component: Admin,
      },
    ],
  },
]);

export default routes;
