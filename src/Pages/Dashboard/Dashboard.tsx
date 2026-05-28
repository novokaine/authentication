import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography
} from "@mui/material";
import { useUserProfile } from "../../hooks/useUserProfile";

const Dashboard = () => {
  const profile = useUserProfile();

  return (
    <Box>
      <Box
        sx={{
          alignItems: "flex-start",
          display: "flex",
          justifyContent: "space-between",
          mb: 3
        }}
      >
        <Box>
          <Typography component="h2" variant="h6">
            Dashboard
          </Typography>
        </Box>

        <Button
          disabled={profile.isFetching}
          onClick={() => void profile.refetch()}
          variant="outlined"
        >
          Refresh profile
        </Button>
      </Box>

      {profile.isLoading ? (
        <Box sx={{ display: "flex", py: 4 }}>
          <CircularProgress aria-label="Loading profile" />
        </Box>
      ) : null}

      {profile.isError ? (
        <Alert severity="error">Unable to load your profile.</Alert>
      ) : null}

      {profile.data ? (
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            maxWidth: 520,
            p: 3
          }}
        >
          <Typography component="h3" variant="subtitle1">
            {profile.data.name}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "grid", gap: 1 }}>
            <Typography color="text.secondary" variant="body2">
              Username: {profile.data.username ?? "Not provided"}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Email: {profile.data.email ?? "Not provided"}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Role: {profile.data.role ?? "Not provided"}
            </Typography>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default Dashboard;
