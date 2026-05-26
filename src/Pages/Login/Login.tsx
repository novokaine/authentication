import { Box, Button } from "@mui/material";
import { useLogin } from "./hooks";
import { FormProvider } from "react-hook-form";
import FormTextField from "../../Components/FormTextField";

const Login = () => {
  const { methods, onSubmit } = useLogin();
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
            required
          />

          <Button type="submit" variant="contained">
            Login
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default Login;
