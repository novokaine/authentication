import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { useLogin } from "./hooks";
import { FormProvider } from "react-hook-form";
import FormTextField from "../../Components/FormTextField";

const Login = () => {
  const { errorMessage, isSubmitting, methods, onSubmit } = useLogin();

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}
        >
          <FormTextField label="Username" name="userName" required />
          <FormTextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <Button disabled={isSubmitting} type="submit" variant="contained">
            {isSubmitting ? <CircularProgress size={20} /> : "Login"}
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default Login;
