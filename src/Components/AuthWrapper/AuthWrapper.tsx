import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { Navigate, Outlet, useLocation, useMatches } from "react-router";
import { useAuthSession, useLogout } from "../../hooks/useAuth";
import type { RouteAccessHandle } from "../../routes/types";

const isRouteAccessHandle = (handle: unknown): handle is RouteAccessHandle => {
  return !!handle && typeof handle === "object";
};

const getRouteAccess = (handles: unknown[]) => {
  return handles.reduce<RouteAccessHandle>(
    (access, handle) => {
      if (!isRouteAccessHandle(handle)) {
        return access;
      }

      return {
        requireAdmin: access.requireAdmin || handle.requireAdmin,
        requireAuth: access.requireAuth || handle.requireAuth
      };
    },
    { requireAdmin: false, requireAuth: false }
  );
};

const AuthWrapper = () => {
  const location = useLocation();
  const matches = useMatches();
  const { data: session, error, isLoading } = useAuthSession();
  const logout = useLogout();
  const routeAccess = getRouteAccess(matches.map((match) => match.handle));
  const user = session?.user;

  if (isLoading) {
    return (
      <Box sx={{ display: "grid", minHeight: "100vh", placeItems: "center" }}>
        <CircularProgress aria-label="Checking session" />
      </Box>
    );
  }

  if (routeAccess.requireAuth && (error || !user)) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (routeAccess.requireAdmin && user?.role !== "admin") {
    return <Navigate replace to="/forbidden" />;
  }

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }}>
      <Box
        component="header"
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          mb: 4
        }}
      >
        <Box>
          <Typography component="h1" variant="h5">
            Authentication
          </Typography>
          {user ? (
            <Typography color="text.secondary" variant="body2">
              Signed in as {user.name}
            </Typography>
          ) : null}
        </Box>

        {user ? (
          <Button
            disabled={logout.isPending}
            onClick={() => logout.mutate()}
            variant="outlined"
          >
            Logout
          </Button>
        ) : null}
      </Box>

      {logout.isError ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your local session was cleared, but the logout request did not finish.
        </Alert>
      ) : null}

      <Outlet />
    </Box>
  );
};

export default AuthWrapper;
