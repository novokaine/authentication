import { TextField, type BaseTextFieldProps } from "@mui/material";
import type { FC } from "react";
import { useController, useFormContext } from "react-hook-form";

interface IFormTextField extends BaseTextFieldProps {
  name: string;
}
const FormTextField: FC<IFormTextField> = ({
  name,
  label,
  ...restFieldProps
}) => {
  const { control } = useFormContext();

  const {
    field: { ref, ...rest },
    fieldState
  } = useController({
    name,
    control
  });

  return (
    <TextField
      {...rest}
      {...restFieldProps}
      inputRef={ref}
      label={label}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );
};

export default FormTextField;
