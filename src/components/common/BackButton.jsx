import  Button  from "@mui/material/Button"
import { useNavigate } from "react-router-dom";

const BackButton = ({ label, backPressNavigationPath, ...rest }) =>{
  const navigate = useNavigate();
  return (
    <>
     <Button {...rest} variant="contained" color="primary" onClick={() => {
           navigate(-1)
      }}>
      {label}
    </Button>
    {/* <Button {...rest} variant="contained" color="primary" onClick={() => {
        window.history.back(); 
      }}
    >{label}</Button> */}
     </>
  );
}
  
export default  BackButton;