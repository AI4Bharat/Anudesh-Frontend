import  Button  from "@mui/material/Button";

const CustomButton = ({ label, buttonVariant, color, disabled = false, ...rest }) => (
  <Button {...rest} variant={buttonVariant ? buttonVariant : "contained"} color={color ? color : "primary"} disabled={disabled}>
    {label}
  </Button>
);

export default CustomButton;
