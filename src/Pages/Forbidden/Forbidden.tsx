import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";

const Forbidden = () => {
  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography component="h2" gutterBottom variant="h5">
        Access denied
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Your account does not have permission to open this page.
      </Typography>
      <Button component={RouterLink} to="/dashboard" variant="contained">
        Go to dashboard
      </Button>
    </Box>
  );
};

export default Forbidden;
