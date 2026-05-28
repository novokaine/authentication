import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router";
import { useAuthSession } from "../../hooks/useAuth";

const PublicRoute = () => {
  const { data: session, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <Box sx={{ display: "grid", minHeight: "100vh", placeItems: "center" }}>
        <CircularProgress aria-label="Checking session" />
      </Box>
    );
  }

  if (session?.user) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
};

export default PublicRoute;
