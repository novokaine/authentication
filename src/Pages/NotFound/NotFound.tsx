import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";

const NotFound = () => {
  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography component="h2" gutterBottom variant="h5">
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        The page you are looking for does not exist.
      </Typography>
      <Button component={RouterLink} to="/dashboard" variant="contained">
        Go to dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
